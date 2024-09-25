import type { CommonConfig, LectureConfig, LectureSchedule } from "./config";
import { createCronJob } from "./time";
import { startLecture } from "./handleMessage";

import fs from "node:fs";

// lectureConfig를 받아서 강의 스케줄을 JSON 파일에서 읽어온다
export function getLectureSchedule(
	lectureConfig: LectureConfig,
): LectureSchedule[] {
	try {
		const schedule = JSON.parse(
			fs.readFileSync(lectureConfig.lectureScheduleFilePath, "utf-8"),
		);
		return schedule;
	} catch (e) {
		console.error(e);
		return [];
	}
}

// 강의 스케줄을 lectureConfig에서 지정하는 경로의 JSON 파일에 저장한다
export function saveLectureSchedule(
	lectureSchedules: LectureSchedule[],
	lectureConfig: LectureConfig,
) {
	fs.writeFileSync(
		lectureConfig.lectureScheduleFilePath,
		JSON.stringify(lectureSchedules, null, 2),
	);
}

export function setupExistingLectureSchedule(
	lectureSchedules: LectureSchedule[],
	commonConfig: CommonConfig,
	lectureConfig: LectureConfig,
) {
	for (const lecture of lectureSchedules) {
		const date = new Date(lecture.dateTime);
		// 지금 이후에 있는 강의만 스케줄링
		if (date > new Date()) {
			const job = createCronJob(lecture.cronTime, () =>
				startLecture(lecture, commonConfig, lectureConfig),
			);
			if (job) {
				lectureConfig.activeJobs.set(lecture.id, job);
			}
		}
	}
}
