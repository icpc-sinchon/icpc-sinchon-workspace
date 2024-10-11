import { PrismaClient } from "@prisma/client";
import { afterAll, beforeAll, describe, it, expect, beforeEach } from "vitest";
import StudentLectureLogRepository from "repositories/student_lecture_log_repository";
import StudentRepository from "repositories/student_repository";
import SemesterRepository from "repositories/semester_repository";
import LectureRepository from "repositories/lecture_repository";
import { LECTURE, SEMESTER, STUDENT } from "../mock";

const prisma = new PrismaClient();

beforeAll(async () => {
	await prisma.$connect();
});

afterAll(async () => {
	await prisma.$disconnect();
});

describe("StudentLectureLogRepository", () => {
	beforeEach(async () => {
		await StudentLectureLogRepository.reset();
		await StudentRepository.reset();
		await LectureRepository.reset();
		await SemesterRepository.reset();
	});

	const { id, semesterId, ...lectureData } = LECTURE[0];

	it("creates a new student lecture log", async () => {
		const student = await StudentRepository.createStudent(STUDENT[0]);
		const semester = await SemesterRepository.createSemester(SEMESTER[0]);
		const lecture = await LectureRepository.createLecture(
			semester.id,
			lectureData,
		);

		const log = await StudentLectureLogRepository.createStudentLectureLog(
			student.id,
			lecture.id,
			{
				isInvited: false,
				isCancelled: false,
			},
		);

		expect(log).toHaveProperty("id");
		expect(log).toMatchObject({
			isInvited: false,
			isCancelled: false,
		});
	});

	it("updates a student lecture log", async () => {
		const student = await StudentRepository.createStudent(STUDENT[0]);
		const semester = await SemesterRepository.createSemester(SEMESTER[0]);
		const lecture = await LectureRepository.createLecture(
			semester.id,
			lectureData,
		);

		const log = await StudentLectureLogRepository.createStudentLectureLog(
			student.id,
			lecture.id,
			{
				isInvited: false,
				isCancelled: false,
			},
		);

		expect(log).toMatchObject({
			isInvited: false,
			isCancelled: false,
		});

		const updatedLog =
			await StudentLectureLogRepository.updateStudentLectureLog(log.id, {
				isInvited: true,
			});

		expect(updatedLog).toMatchObject({
			isInvited: true,
			isCancelled: false,
		});
	});

	it("deletes a student lecture log", async () => {
		const student = await StudentRepository.createStudent(STUDENT[0]);
		const semester = await SemesterRepository.createSemester(SEMESTER[0]);
		const lecture = await LectureRepository.createLecture(
			semester.id,
			lectureData,
		);

		const log = await StudentLectureLogRepository.createStudentLectureLog(
			student.id,
			lecture.id,
			{
				isInvited: false,
				isCancelled: false,
			},
		);

		await StudentLectureLogRepository.deleteStudentLectureLog(log.id);

		const deletedLog =
			await StudentLectureLogRepository.findStudentLectureLogById(log.id);
		expect(deletedLog).toBeNull();
	});

	it("finds a student lecture log by id", async () => {
		const student = await StudentRepository.createStudent(STUDENT[0]);
		const semester = await SemesterRepository.createSemester(SEMESTER[0]);
		const lecture = await LectureRepository.createLecture(
			semester.id,
			lectureData,
		);

		const createdLog =
			await StudentLectureLogRepository.createStudentLectureLog(
				student.id,
				lecture.id,
				{
					isInvited: false,
					isCancelled: false,
				},
			);

		const foundLog =
			await StudentLectureLogRepository.findStudentLectureLogById(
				createdLog.id,
			);
		expect(foundLog).toMatchObject({
			isInvited: false,
			isCancelled: false,
		});
	});

	it("finds a student lecture log by student id and lecture id", async () => {
		const student = await StudentRepository.createStudent(STUDENT[0]);
		const semester = await SemesterRepository.createSemester(SEMESTER[0]);
		const lecture = await LectureRepository.createLecture(
			semester.id,
			lectureData,
		);

		await StudentLectureLogRepository.createStudentLectureLog(
			student.id,
			lecture.id,
			{
				isInvited: false,
				isCancelled: false,
			},
		);

		const foundLog =
			await StudentLectureLogRepository.findStudentLectureLogByLectureId(
				student.id,
				lecture.id,
			);
		expect(foundLog).toMatchObject({
			isInvited: false,
			isCancelled: false,
		});
	});

	it("retrieves all student lecture logs", async () => {
		const student1 = await StudentRepository.createStudent(STUDENT[0]);
		const student2 = await StudentRepository.createStudent(STUDENT[1]);
		const semester = await SemesterRepository.createSemester(SEMESTER[0]);
		const lecture = await LectureRepository.createLecture(
			semester.id,
			lectureData,
		);

		await StudentLectureLogRepository.createStudentLectureLog(
			student1.id,
			lecture.id,
			{
				isInvited: false,
				isCancelled: false,
			},
		);
		await StudentLectureLogRepository.createStudentLectureLog(
			student2.id,
			lecture.id,
			{
				isInvited: true,
				isCancelled: false,
			},
		);

		const allLogs = await StudentLectureLogRepository.allStudentLectureLogs();
		expect(allLogs.length).toBe(2);
		expect(allLogs[0]).toHaveProperty("id");
		expect(allLogs[1]).toHaveProperty("id");
	});
});
