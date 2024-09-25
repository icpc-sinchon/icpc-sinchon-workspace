import dotenv from "dotenv";
import path from "node:path";
import fs from "node:fs";
import type { CronJob } from "cron";

dotenv.config();

// 강의 시작 이후 ATTEND_LIMIT_MINUTES분 동안 음성 채널에 접속하면 출석으로 인정
const ATTEND_LIMIT_MINUTES = 15;
// 강의 시작 이후 CONNECTION_LOG_DURATION 동안의 접속 기록만 남김
const CONNECTION_LOG_DURATION = 60 * 60 * 1000; // 1시간 (밀리초 단위)
// targetChannelId를 id로 갖는 채널에 사용자가 접속하면
// alarmChannelId를 id로 갖는 채널에 접속 알림 메시지를 보낸다
const alarmChannelId = process.env.DISCORD_ALARM_CHANNEL_ID;

const SEMESTER_FILE_PATH = path.join(__dirname, "semester.json");

const semester: {
	year: number;
	season: "Summer" | "Winter";
} = JSON.parse(fs.readFileSync(SEMESTER_FILE_PATH, "utf-8"));

export type AttendanceRecord = {
	nickname: string;
	joinTime: Date;
};

export type CommonConfig = {
	year: number;
	season: "Summer" | "Winter";
	attendLimitMinutes: number;
	connectionLogDuration: number;
	alarmChannelId: string;
};

export type LectureConfig = {
	level: "Novice" | "Advanced";
	lectureScheduleFilePath: string;
	attendanceFilePath: string;
	connectionLogFilePath: string;
	targetChannelId: string;

	currentLectureStartTime: Date | null;
	isLoggingConnections: boolean;

	userJoinTimes: Map<string, Date>;
	activeJobs: Map<number, CronJob>;
	attendanceList: Map<string, AttendanceRecord>;
};

export type LectureSchedule = {
	id: number;
	round: number;
	dateTime: string;
	cronTime: string;
	level: "Novice" | "Advanced";
};

const commonConfig: CommonConfig = {
	year: semester.year,
	season: semester.season,
	attendLimitMinutes: ATTEND_LIMIT_MINUTES,
	connectionLogDuration: CONNECTION_LOG_DURATION,
	alarmChannelId: alarmChannelId as string,
};

const noviceConfig: LectureConfig = {
	level: "Novice",
	lectureScheduleFilePath: path.join(__dirname, "noviceLectureSchedule.json"),
	attendanceFilePath: path.join(__dirname, "noviceAttendance.csv"),
	connectionLogFilePath: path.join(__dirname, "noviceConnectionLog.csv"),
	targetChannelId: process.env.DISCORD_NOVICE_CHANNEL_ID as string,

	currentLectureStartTime: null,
	isLoggingConnections: false,

	userJoinTimes: new Map<string, Date>(),
	activeJobs: new Map<number, CronJob>(),
	attendanceList: new Map<string, AttendanceRecord>(),
};

const advancedConfig: LectureConfig = {
	level: "Advanced",
	lectureScheduleFilePath: path.join(__dirname, "advancedLectureSchedule.json"),
	attendanceFilePath: path.join(__dirname, "advancedAttendance.csv"),
	connectionLogFilePath: path.join(__dirname, "advancedConnectionLog.csv"),
	targetChannelId: process.env.DISCORD_ADVANCED_CHANNEL_ID as string,

	currentLectureStartTime: null,
	isLoggingConnections: false,

	userJoinTimes: new Map<string, Date>(),
	activeJobs: new Map<number, CronJob>(),
	attendanceList: new Map<string, AttendanceRecord>(),
};

export { commonConfig, noviceConfig, advancedConfig };
