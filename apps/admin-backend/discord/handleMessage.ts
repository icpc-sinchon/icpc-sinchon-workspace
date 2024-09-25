import {
	getStudentIdFromNickname,
	getDiscordNickname,
	getBojHandleFromNickname,
} from "./utils";
import { client } from "./bot";
import * as csv from "csv-writer";
import WeeklyAttendLogRepository from "../repositories/weekly_attend_log_repository";
import type { Message } from "discord.js";
import type { CommonConfig, LectureConfig, LectureSchedule } from "./config";
import LectureRepository from "repositories/lecture_repository";
import { createCronJob, isTimeConflict } from "./time";
import { getLectureSchedule, saveLectureSchedule } from "./lecture";
import { CommandType, validateDiscordMessage } from "./validate";
import StudentLectureLogRepository from "repositories/student_lecture_log_repository";
import StudentWithAttendRepository from "repositories/student_with_attend_repository";

// 인수를 받아서 적절히 처리
// 초급이면 초급 설정을, 중급이면 중급 설정을 받는다
export function handleMessage(
	message: Message,
	commonConfig: CommonConfig,
	noviceConfig: LectureConfig,
	advancedConfig: LectureConfig,
) {
	const validatedCommand = validateDiscordMessage(message);

	const currentLectureConfig =
		validatedCommand.level === "Novice" ? noviceConfig : advancedConfig;

	switch (validatedCommand.type) {
		case CommandType.SET_LECTURE_SCHEDULE:
			handleSetLectureSchedule(
				message,
				commonConfig,
				currentLectureConfig,
				validatedCommand.round,
				validatedCommand.date,
			);
			break;
		case CommandType.LIST_LECTURE_SCHEDULE:
			handleListLectureSchedule(message, currentLectureConfig);
			break;
		case CommandType.CLEAR_LECTURE_SCHEDULE:
			handleClearLectureSchedule(message, currentLectureConfig);
			break;
		case CommandType.DELETE_LECTURE_SCHEDULE:
			handleDeleteLectureSchedule(message, currentLectureConfig);
			break;
		case CommandType.INVALID:
			message.reply(validatedCommand.invalidMessage);
			break;
	}
}

export function handleSetLectureSchedule(
	message: Message,
	commonConfig: CommonConfig,
	lectureConfig: LectureConfig,
	round: number,
	date: Date,
) {
	const lectureSchedule = getLectureSchedule(lectureConfig);
	if (isTimeConflict(date, lectureSchedule, commonConfig)) {
		return message.reply("이미 설정된 강의 시간과 겹칩니다.");
	}

	const minute = date.getMinutes();
	const hour = date.getHours();
	const day = date.getDate();
	const month = date.getMonth() + 1;

	const cronTime = `${minute} ${hour} ${day} ${month} *`;
	const newLectureSchedule: LectureSchedule = {
		id:
			lectureSchedule.length > 0
				? Math.max(...lectureSchedule.map((l) => l.id)) + 1
				: 1,
		round,
		dateTime: date.toISOString(),
		cronTime,
		level: lectureConfig.level,
	};

	const job = createCronJob(cronTime, () =>
		startLecture(newLectureSchedule, commonConfig, lectureConfig),
	);

	lectureSchedule.push(newLectureSchedule);
	saveLectureSchedule(lectureSchedule, lectureConfig);
	lectureConfig.activeJobs.set(newLectureSchedule.id, job);

	message.reply(
		`${lectureConfig.level} ${round}회차 강의 시간이 ${date.toLocaleString()}으로 설정되었습니다.`,
	);
}

// "!(초급|중급) 강의시간 확인"
export function handleListLectureSchedule(
	message: Message,
	lectureConfig: LectureConfig,
) {
	const lectureSchedules = getLectureSchedule(lectureConfig);
	if (lectureSchedules.length === 0) {
		return message.reply("설정된 강의 시간이 없습니다.");
	}
	const scheduleList = lectureSchedules
		.map(
			(lecture) =>
				`ID: ${lecture.id}, ${lecture.round}회차: ${new Date(lecture.dateTime).toLocaleString()} (${lecture.level})`,
		)
		.join("\n");

	message.reply(`설정된 강의 시간:\n${scheduleList}`);
}

// "!(초급|중급) 강의시간 초기화"
export function handleClearLectureSchedule(
	message: Message,
	lectureConfig: LectureConfig,
) {
	saveLectureSchedule([], lectureConfig);
	for (const job of lectureConfig.activeJobs.values()) {
		job.stop();
	}
	lectureConfig.activeJobs.clear();

	message.reply("모든 강의 시간이 삭제되었습니다.");
}

// "!(초급|중급) 강의시간 삭제 id"
function handleDeleteLectureSchedule(
	message: Message,
	lectureConfig: LectureConfig,
) {
	const args = message.content.split(" ");

	const id = Number.parseInt(args[3]);
	const lectureSchedule = getLectureSchedule(lectureConfig);
	const updatedSchedule = lectureSchedule.filter(
		(lecture) => lecture.id !== id,
	);

	if (lectureSchedule.length === updatedSchedule.length) {
		return message.reply(`ID ${id}에 해당하는 강의 시간을 찾을 수 없습니다.`);
	}

	saveLectureSchedule(updatedSchedule, lectureConfig);
	const job = lectureConfig.activeJobs.get(id);
	if (job) {
		job.stop();
		lectureConfig.activeJobs.delete(id);
	}

	message.reply(`ID ${id}의 강의 시간이 삭제되었습니다.`);
}

export function startLecture(
	lectureSchedule: LectureSchedule,
	commonConfig: CommonConfig,
	lectureConfig: LectureConfig,
) {
	const alarmChannel = client.channels.cache.get(commonConfig.alarmChannelId);

	if (!alarmChannel) {
		return console.error("알람 채널을 찾을 수 없습니다.");
	}

	const targetChannel = client.channels.cache.get(
		lectureConfig.targetChannelId,
	);
	if (!targetChannel || !targetChannel.isVoiceBased()) {
		return console.error("출석 체크를 할 채널이 없거나 음성 채널이 아닙니다.");
	}
	const targetChannelName = targetChannel.name;

	const { round, dateTime } = lectureSchedule;

	if (alarmChannel.isTextBased()) {
		alarmChannel.send(
			`${round}회차 강의 시작 시간입니다. ${targetChannelName} 채널에 접속해주세요.`,
		);
	}

	// 강의 시작 시간을 지금으로 설정
	lectureConfig.currentLectureStartTime = new Date();
	// 강의 접속 로그 기록 시작
	lectureConfig.isLoggingConnections = true;
	// 강의의 출석 리스트 초기화
	lectureConfig.attendanceList.clear();

	// 일정 시간 이후 접속 로그 기록 종료
	setTimeout(() => {
		lectureConfig.isLoggingConnections = false;
		console.log("접속 로그 기록이 종료되었습니다.");
	}, commonConfig.connectionLogDuration);

	// 이미 채널에 있는 사용자들 출석 체크
	for (const [userId, member] of targetChannel.members) {
		const nickname = getDiscordNickname(member);
		checkAttendance(
			userId,
			nickname,
			// joinTime은 강의 시작 시간으로 한다
			lectureConfig.currentLectureStartTime,
			commonConfig,
			lectureConfig,
		);
		if (lectureConfig.isLoggingConnections) {
			logConnection(
				nickname,
				lectureConfig.currentLectureStartTime,
				"already_attended",
				lectureConfig,
			);
		}
	}

	setTimeout(
		() => endAttendanceCheck(lectureSchedule, commonConfig, lectureConfig),
		commonConfig.attendLimitMinutes * 60 * 1000,
	);
}

function endAttendanceCheck(
	endingLectureSchedule: LectureSchedule,
	commonConfig: CommonConfig,
	lectureConfig: LectureConfig,
) {
	saveAttendance(endingLectureSchedule, lectureConfig);
	saveAttendanceToDB(endingLectureSchedule, commonConfig, lectureConfig);
	// 강의 스케쥴 파일에서 해당 시간의 강의를 삭제
	const lectureSchedule = getLectureSchedule(lectureConfig);
	const updatedSchedule = lectureSchedule.filter(
		(lecture) => lecture.dateTime !== endingLectureSchedule.dateTime,
	);
	saveLectureSchedule(updatedSchedule, lectureConfig);

	const endingScheduleId = endingLectureSchedule.id;
	const job = lectureConfig.activeJobs.get(endingScheduleId);
	if (job) {
		job.stop();
		lectureConfig.activeJobs.delete(endingScheduleId);
	}

	lectureConfig.currentLectureStartTime = null;

	const alarmChannel = client.channels.cache.get(commonConfig.alarmChannelId);
	// 출석 리스트 출력
	const attendanceMessage = Array.from(lectureConfig.attendanceList.values())
		.map((user) => user.nickname)
		.join(", ");

	if (alarmChannel?.isTextBased()) {
		alarmChannel.send(
			`출석 체크가 종료되었습니다. 출석체크된 사용자 목록: ${attendanceMessage}`,
		);
	}
}

export function checkAttendance(
	userId: string,
	nickname: string,
	joinTime: Date,
	commonConfig: CommonConfig,
	lectureConfig: LectureConfig,
) {
	const { currentLectureStartTime, attendanceList } = lectureConfig;
	if (currentLectureStartTime && !attendanceList.has(userId)) {
		const timeSinceLectureStart =
			(joinTime.getTime() - currentLectureStartTime.getTime()) / (60 * 1000);
		if (timeSinceLectureStart <= commonConfig.attendLimitMinutes) {
			attendanceList.set(userId, {
				nickname,
				joinTime: new Date(
					Math.max(joinTime.getTime(), currentLectureStartTime.getTime()),
				),
			});
		}
	}
}

function saveAttendance(
	lectureSchedule: LectureSchedule,
	lectureConfig: LectureConfig,
) {
	const { attendanceList } = lectureConfig;
	const lectureDate = new Date(lectureSchedule.dateTime);
	const round = lectureSchedule.round;

	const csvWriter = csv.createObjectCsvWriter({
		path: lectureConfig.attendanceFilePath,
		header: [
			{ id: "lectureDate", title: "Lecture Date" },
			{ id: "round", title: "Round" },
			{ id: "nickname", title: "Nickname" },
			{ id: "joinTime", title: "Join Time" },
		],
		append: true,
	});

	// 기록할 때는 localeString으로 저장
	const records = Array.from(attendanceList.values()).map(
		({ nickname, joinTime }) => ({
			lectureDate: lectureDate.toLocaleString(),
			round,
			nickname,
			joinTime: joinTime.toLocaleString(),
		}),
	);

	csvWriter
		.writeRecords(records)
		.then(() => console.log("출석 기록이 저장되었습니다."))
		.catch((err: Error) => console.error("출석 기록 저장 중 오류 발생:", err));
}

// 출석 DB에 업데이트 하는 함수
async function saveAttendanceToDB(
	lectureSchedule: LectureSchedule,
	commonConfig: CommonConfig,
	lectureConfig: LectureConfig,
) {
	const { year, season } = commonConfig;
	const { level: lectureLevel, attendanceList } = lectureConfig;
	const { round } = lectureSchedule;

	const lecture = await LectureRepository.findLectureBySemesterAndLevel(
		year,
		season,
		lectureLevel,
	);

	if (!lecture) {
		console.error("강의 ID를 찾을 수 없습니다.");
		return;
	}

	const studentBojHandles = Array.from(attendanceList.values())
		.map(({ nickname }) => getBojHandleFromNickname(nickname))
		.filter((bojHandle) => bojHandle !== null);

	if (studentBojHandles.length) {
		await StudentWithAttendRepository.upsertStudentWeeklyAttendLogsByBojHandlesAndLectureIdAndRound(
			studentBojHandles,
			lecture.id,
			round,
			{ lectureDone: true },
		);
		console.log("출석 DB가 업데이트 되었습니다.");
	}
}

export function logConnection(
	nickname: string,
	time: Date,
	action: string,
	lectureConfig: LectureConfig,
) {
	const csvWriter = csv.createObjectCsvWriter({
		path: lectureConfig.connectionLogFilePath,
		header: [
			{ id: "date", title: "Date" },
			{ id: "nickname", title: "Nickname" },
			{ id: "action", title: "Action" },
		],
		append: true,
	});

	csvWriter
		.writeRecords([{ date: time.toLocaleString(), nickname, action }])
		.then(() => console.log("접속 로그가 기록되었습니다."))
		.catch((err: Error) => console.error("접속 로그 기록 중 오류 발생:", err));
}
