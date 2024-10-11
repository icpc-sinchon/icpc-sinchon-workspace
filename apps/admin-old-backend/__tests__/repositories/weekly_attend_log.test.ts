import { PrismaClient } from "@prisma/client";
import { afterAll, beforeAll, describe, it, expect, beforeEach } from "vitest";
import StudentRepository from "repositories/student_repository";
import SemesterRepository from "repositories/semester_repository";
import LectureRepository from "repositories/lecture_repository";
import { LECTURE, SEMESTER, STUDENT, TASK } from "../mock";
import WeeklyAttendLogRepository from "repositories/weekly_attend_log_repository";

const prisma = new PrismaClient();

beforeAll(async () => {
	await prisma.$connect();
});

afterAll(async () => {
	await prisma.$disconnect();
});

describe("WeeklyAttendLogRepository Basic Operations", () => {
	beforeEach(async () => {
		await WeeklyAttendLogRepository.reset();
		await StudentRepository.reset();
		await LectureRepository.reset();
		await SemesterRepository.reset();
	});

	const { id, semesterId, ...lectureData } = LECTURE[0];

	it("creates a new weekly attend log", async () => {
		const student = await StudentRepository.createStudent(STUDENT[0]);
		const semester = await SemesterRepository.createSemester(SEMESTER[0]);

		const lecture = await LectureRepository.createLecture(
			semester.id,
			lectureData,
		);

		const log = await WeeklyAttendLogRepository.createWeeklyAttendLog(
			student.id,
			lecture.id,
			{
				round: 1,
				lectureDone: true,
				taskDone: false,
			},
		);

		expect(log).toMatchObject({
			round: 1,
			lectureDone: true,
			taskDone: false,
		});
		expect(log).toHaveProperty("id");
	});

	it("updates a weekly attend log", async () => {
		const student = await StudentRepository.createStudent(STUDENT[0]);
		const semester = await SemesterRepository.createSemester(SEMESTER[0]);
		const lecture = await LectureRepository.createLecture(
			semester.id,
			lectureData,
		);

		const log = await WeeklyAttendLogRepository.createWeeklyAttendLog(
			student.id,
			lecture.id,
			{
				round: 1,
				lectureDone: true,
				taskDone: false,
			},
		);

		expect(log).toMatchObject({
			round: 1,
			lectureDone: true,
			taskDone: false,
		});

		const updatedLog = await WeeklyAttendLogRepository.updateWeeklyAttendLog(
			log.id,
			{
				taskDone: true,
			},
		);

		expect(updatedLog).toMatchObject({
			round: 1,
			lectureDone: true,
			taskDone: true,
		});
	});

	it("deletes a weekly attend log", async () => {
		const student = await StudentRepository.createStudent(STUDENT[0]);
		const semester = await SemesterRepository.createSemester(SEMESTER[0]);
		const lecture = await LectureRepository.createLecture(
			semester.id,
			lectureData,
		);

		const log = await WeeklyAttendLogRepository.createWeeklyAttendLog(
			student.id,
			lecture.id,
			{
				round: 1,
				lectureDone: true,
				taskDone: false,
			},
		);

		expect(log).toMatchObject({
			round: 1,
			lectureDone: true,
			taskDone: false,
			studentId: student.id,
			lectureId: lecture.id,
		});

		await WeeklyAttendLogRepository.deleteWeeklyAttendLog(log.id);

		const deletedLog = await WeeklyAttendLogRepository.findWeeklyAttendLogById(
			log.id,
		);
		expect(deletedLog).toBeNull();
	});

	it("finds a weekly attend log by id", async () => {
		const student = await StudentRepository.createStudent(STUDENT[0]);
		const semester = await SemesterRepository.createSemester(SEMESTER[0]);
		const lecture = await LectureRepository.createLecture(
			semester.id,
			lectureData,
		);

		const createdLog = await WeeklyAttendLogRepository.createWeeklyAttendLog(
			student.id,
			lecture.id,
			{
				round: 1,
				lectureDone: true,
				taskDone: false,
			},
		);

		const foundLog = await WeeklyAttendLogRepository.findWeeklyAttendLogById(
			createdLog.id,
		);
		expect(foundLog).toMatchObject({
			round: 1,
			lectureDone: true,
			taskDone: false,
		});
	});

	it("finds weekly attend logs by student id", async () => {
		const student1 = await StudentRepository.createStudent(STUDENT[0]);
		const student2 = await StudentRepository.createStudent(STUDENT[1]);
		const semester = await SemesterRepository.createSemester(SEMESTER[0]);
		const lecture = await LectureRepository.createLecture(
			semester.id,
			lectureData,
		);

		await WeeklyAttendLogRepository.createWeeklyAttendLog(
			student1.id,
			lecture.id,
			{
				round: 1,
				lectureDone: true,
				taskDone: false,
			},
		);

		await WeeklyAttendLogRepository.createWeeklyAttendLog(
			student2.id,
			lecture.id,
			{
				round: 1,
				lectureDone: false,
				taskDone: true,
			},
		);

		const logs = await WeeklyAttendLogRepository.findWeeklyAttendLogByStudentId(
			student1.id,
		);
		expect(logs.length).toBe(1);
		expect(logs[0]).toMatchObject({
			round: 1,
			lectureDone: true,
			taskDone: false,
		});
	});

	it("upserts a weekly attend log", async () => {
		const student = await StudentRepository.createStudent(STUDENT[0]);
		const semester = await SemesterRepository.createSemester(SEMESTER[0]);
		const lecture = await LectureRepository.createLecture(
			semester.id,
			lectureData,
		);

		const log =
			await WeeklyAttendLogRepository.upsertWeeklyAttendLogWithStudentIdAndLectureId(
				student.id,
				lecture.id,
				1,
				{ lectureDone: true, taskDone: false },
			);

		expect(log).toMatchObject({
			round: 1,
			lectureDone: true,
			taskDone: false,
		});

		const updatedLog =
			await WeeklyAttendLogRepository.upsertWeeklyAttendLogWithStudentIdAndLectureId(
				student.id,
				lecture.id,
				1,
				{ taskDone: true },
			);

		expect(updatedLog).toMatchObject({
			round: 1,
			lectureDone: true,
			taskDone: true,
		});
	});

	it("retrieves all weekly attend logs", async () => {
		const student = await StudentRepository.createStudent(STUDENT[0]);
		const semester = await SemesterRepository.createSemester(SEMESTER[0]);
		const lecture = await LectureRepository.createLecture(
			semester.id,
			lectureData,
		);

		await WeeklyAttendLogRepository.createWeeklyAttendLog(
			student.id,
			lecture.id,
			{
				round: 1,
				lectureDone: true,
				taskDone: false,
			},
		);
		await WeeklyAttendLogRepository.createWeeklyAttendLog(
			student.id,
			lecture.id,
			{
				round: 2,
				lectureDone: false,
				taskDone: true,
			},
		);

		const allLogs = await WeeklyAttendLogRepository.allWeeklyAttendLogs();
		expect(allLogs.length).toBe(2);
		expect(allLogs[0]).toHaveProperty("id");
		expect(allLogs[1]).toHaveProperty("id");
	});
});
