import { CronJob } from "cron";
import type { CommonConfig, LectureSchedule } from "./config";

type Duration = {
	minutes: number;
	seconds: number;
};

export function createCronJob(cronTime: string, callback: () => void): CronJob {
	const job = new CronJob(cronTime, callback);
	job.start();
	return job;
}

export function isValidDate(year: number, month: number, day: number) {
	// 월은 0부터 시작하므로 1을 빼줍니다.
	const date = new Date(year, month - 1, day);
	return (
		date.getFullYear() === year &&
		date.getMonth() === month - 1 &&
		date.getDate() === day
	);
}

export function isValidTime(hour: number, minute: number) {
	return hour >= 0 && hour < 24 && minute >= 0 && minute < 60;
}

export function calculateDuration(startTime: Date): Duration {
	const time = new Date().getTime() - startTime.getTime();
	return {
		minutes: Math.floor(time / 60000),
		seconds: Math.floor((time % 60000) / 1000),
	};
}

export function isTimeConflict(
	newDate: Date,
	lectureSchedules: LectureSchedule[],
	commonConfig: CommonConfig,
): boolean {
	return lectureSchedules.some((lecture) => {
		const lectureDate = new Date(lecture.dateTime);
		return (
			newDate.getTime() - lectureDate.getTime() <
			commonConfig.attendLimitMinutes * 60 * 1000
		);
	});
}
