import type { Message } from "discord.js";
import { isValidDate, isValidTime } from "./time";

export enum CommandType {
	SET_LECTURE_SCHEDULE = 0,
	LIST_LECTURE_SCHEDULE = 1,
	CLEAR_LECTURE_SCHEDULE = 2,
	DELETE_LECTURE_SCHEDULE = 3,
	INVALID = 4,
}

type Level = "Novice" | "Advanced";

type ValidatedSetLectureCommand = {
	type: CommandType.SET_LECTURE_SCHEDULE;
	level: Level;
	round: number;
	date: Date;
};

type ValidatedListLectureCommand = {
	type: CommandType.LIST_LECTURE_SCHEDULE;
	level: Level;
};

type ValidatedClearLectureCommand = {
	type: CommandType.CLEAR_LECTURE_SCHEDULE;
	level: Level;
};

type ValidatedDeleteLectureCommand = {
	type: CommandType.DELETE_LECTURE_SCHEDULE;
	level: Level;
	id: number;
};

type ValidatedInvalidCommand = {
	type: CommandType.INVALID;
	level: Level;
	invalidMessage: string;
};

type ValidatedCommand =
	| ValidatedSetLectureCommand
	| ValidatedListLectureCommand
	| ValidatedClearLectureCommand
	| ValidatedDeleteLectureCommand
	| ValidatedInvalidCommand;

export function validateDiscordMessage(message: Message): ValidatedCommand {
	const content = message.content.trim().toLowerCase();
	const parts = content.split(" ");

	// 메시지가 3어절 미만인 경우 해당하는 명령어가 없다
	if (parts.length < 3) {
		return {
			type: CommandType.INVALID,
			level: "Novice",
			invalidMessage: "올바르지 않은 명령어 형식입니다. 도움말을 참고해주세요.",
		};
	}

	// 메시지의 첫 단어가 "!초급" 또는 "!중급"이 아닌 경우 해당하는 명령어가 없다
	const level =
		parts[0] === "!초급" ? "Novice" : parts[0] === "!중급" ? "Advanced" : null;
	if (!level) {
		return {
			type: CommandType.INVALID,
			level: "Novice",
			invalidMessage:
				"!초급 또는 !중급으로 시작하는 명령어만 사용 가능합니다. 도움말을 참고해주세요.",
		};
	}

	// 명령어는 모두 !초급/!중급 강의시간 (설정|확인|초기화|삭제)로 시작한다
	if (parts[1] !== "강의시간") {
		return {
			type: CommandType.INVALID,
			level,
			invalidMessage: "올바르지 않은 명령어 형식입니다. 도움말을 참고해주세요.",
		};
	}

	switch (parts[2]) {
		case "설정":
			return validateSetLectureSchedule(parts, level);
		case "확인":
			return validateListLectureSchedule(parts, level);
		case "초기화":
			return validateClearLectureSchedule(parts, level);
		case "삭제":
			return validateDeleteLectureSchedule(parts, level);
		default:
			return {
				type: CommandType.INVALID,
				level,
				invalidMessage:
					"올바르지 않은 명령어 형식입니다. 도움말을 참고해주세요.",
			};
	}
}

function validateSetLectureSchedule(
	parts: string[],
	level: Level,
): ValidatedSetLectureCommand | ValidatedInvalidCommand {
	if (parts.length !== 6) {
		return {
			type: CommandType.INVALID,
			level,
			invalidMessage:
				"올바른 형식: !(초급|중급) 강의시간 설정 n회차 YYYY-MM-DD HH:mm",
		};
	}

	const [_, __, ___, roundStr, dateStr, timeStr] = parts;

	const roundMatch = roundStr.match(/^(\d+)회차$/);
	if (!roundMatch) {
		return {
			type: CommandType.INVALID,
			level,
			invalidMessage:
				"올바른 형식: !(초급|중급) 강의시간 설정 n회차 YYYY-MM-DD HH:mm",
		};
	}

	const round = Number.parseInt(roundMatch[1]);
	if (Number.isNaN(round) || round < 1) {
		return {
			type: CommandType.INVALID,
			level,
			invalidMessage: "올바르지 않은 회차 입력입니다.",
		};
	}

	// 날짜와 시간 검사를 위한 정규 표현식
	const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
	const timeRegex = /^\d{2}:\d{2}$/;

	if (!dateRegex.test(dateStr) || !timeRegex.test(timeStr)) {
		return {
			type: CommandType.INVALID,
			level,
			invalidMessage:
				"올바른 날짜와 시간 형식을 입력하세요 (예: 2024-07-10 10:00)",
		};
	}

	const [year, month, day] = dateStr.split("-").map(Number);
	const [hour, minute] = timeStr.split(":").map(Number);
	const date = new Date(year, month - 1, day, hour, minute);

	// 날짜와 시간의 유효성 검사
	if (
		!isValidDate(year, month, day) ||
		!isValidTime(hour, minute) ||
		Number.isNaN(date.getTime())
	) {
		return {
			type: CommandType.INVALID,
			level,
			invalidMessage: "유효하지 않은 날짜 또는 시간입니다.",
		};
	}

	if (date < new Date()) {
		return {
			type: CommandType.INVALID,
			level,
			invalidMessage: "강의 시간은 현재 시간 이후로 설정해야 합니다.",
		};
	}

	return { type: CommandType.SET_LECTURE_SCHEDULE, level, round, date };
}

function validateListLectureSchedule(
	parts: string[],
	level: Level,
): ValidatedListLectureCommand | ValidatedInvalidCommand {
	if (parts.length !== 3) {
		return {
			type: CommandType.INVALID,
			level,
			invalidMessage: "올바른 형식: !(초급|중급) 강의시간 확인",
		};
	}
	return { type: CommandType.LIST_LECTURE_SCHEDULE, level };
}

function validateClearLectureSchedule(
	parts: string[],
	level: Level,
): ValidatedClearLectureCommand | ValidatedInvalidCommand {
	if (parts.length !== 3) {
		return {
			type: CommandType.INVALID,
			level,
			invalidMessage: "올바른 형식: !(초급|중급) 강의시간 초기화",
		};
	}
	return { type: CommandType.CLEAR_LECTURE_SCHEDULE, level };
}

function validateDeleteLectureSchedule(
	parts: string[],
	level: Level,
): ValidatedDeleteLectureCommand | ValidatedInvalidCommand {
	if (parts.length !== 4) {
		return {
			type: CommandType.INVALID,
			level,
			invalidMessage: "올바른 형식: !(초급|중급) 강의시간 삭제 삭제할id",
		};
	}

	const id = Number.parseInt(parts[3]);
	if (Number.isNaN(id) || id < 1) {
		return {
			type: CommandType.INVALID,
			level,
			invalidMessage: "올바르지 않은 ID입니다.",
		};
	}

	return { type: CommandType.DELETE_LECTURE_SCHEDULE, level, id };
}
