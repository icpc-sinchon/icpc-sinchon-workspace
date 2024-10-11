// TODO: BOJ 스크랩과 관련된 코드들 다 작성 후 테스트 코드 작성
// import { PrismaClient } from "@prisma/client";
// import { afterAll, beforeAll, describe, it, expect, beforeEach } from "vitest";
// import StudentLectureLogRepository from "repositories/student_lecture_log_repository";
// import StudentRepository from "repositories/student_repository";
// import SemesterRepository from "repositories/semester_repository";
// import LectureRepository from "repositories/lecture_repository";
// import { LECTURE, SEMESTER, STUDENT } from "../mock";
// import StudentWithAttendRepository from "repositories/student_with_attend_repository";
// import WeeklyAttendLogRepository from "repositories/weekly_attend_log_repository";

// const prisma = new PrismaClient();

// beforeAll(async () => {
// 	await prisma.$connect();
// });

// afterAll(async () => {
// 	await prisma.$disconnect();
// });

// describe("StudentWithAttendRepository", () => {
// 	beforeAll(() => {
// 		StudentWithAttendRepository.instance = new PrismaClient();
// 		StudentRepository.instance = new PrismaClient();
// 		SemesterRepository.instance = new PrismaClient();
// 		LectureRepository.instance = new PrismaClient();
// 		StudentLectureLogRepository.instance = new PrismaClient();
// 		WeeklyAttendLogRepository.instance = new PrismaClient();
// 	});

// 	afterAll(async () => {
// 		await StudentWithAttendRepository.instance.$disconnect();
// 	});

// 	beforeEach(async () => {
// 		await StudentRepository.reset();
// 		await SemesterRepository.reset();
// 		await LectureRepository.reset();
// 		await StudentLectureLogRepository.reset();
// 		await WeeklyAttendLogRepository.reset();
// 	});

// 	const { id, semesterId, ...lectureData } = LECTURE[0];

// 	it("finds student with attend log by BOJ handle", async () => {
// 		const student = await StudentRepository.createStudent(STUDENT[0]);
// 		const semester = await SemesterRepository.createSemester(SEMESTER[0]);
// 		const lecture = await LectureRepository.createLecture(
// 			semester.id,
// 			lectureData,
// 		);
// 		await StudentLectureLogRepository.createStudentLectureLog(
// 			student.id,
// 			lecture.id,
// 			{ isInvited: true, isCancelled: false },
// 		);
// 		await WeeklyAttendLogRepository.createWeeklyAttendLog(
// 			student.id,
// 			lecture.id,
// 			{ round: 1, lectureDone: true, taskDone: false },
// 		);

// 		const studentWithAttendLog =
// 			await StudentWithAttendRepository.findStudentWithAttendLogByBojHandle(
// 				student.bojHandle,
// 			);

// 		expect(studentWithAttendLog).toBeDefined();
// 		expect(studentWithAttendLog?.bojHandle).toBe(student.bojHandle);
// 		expect(studentWithAttendLog?.weeklyAttendLog).toHaveLength(1);
// 		expect(studentWithAttendLog?.weeklyAttendLog[0]).toMatchObject({
// 			round: 1,
// 			lectureDone: true,
// 			taskDone: false,
// 		});
// 	});

// 	it("finds students with attend logs in lecture", async () => {
// 		const student = await StudentRepository.createStudent(STUDENT[0]);
// 		const semester = await SemesterRepository.createSemester(SEMESTER[0]);
// 		const lecture = await LectureRepository.createLecture(
// 			semester.id,
// 			lectureData,
// 		);
// 		await StudentLectureLogRepository.createStudentLectureLog(
// 			student.id,
// 			lecture.id,
// 			{ isInvited: true, isCancelled: false },
// 		);
// 		await WeeklyAttendLogRepository.createWeeklyAttendLog(
// 			student.id,
// 			lecture.id,
// 			{ round: 1, lectureDone: true, taskDone: false },
// 		);

// 		const studentWithAttendLogs =
// 			await StudentWithAttendRepository.findStudentsWithAttendLogsInLecture(
// 				student.id,
// 				lecture.id,
// 			);

// 		expect(studentWithAttendLogs).toBeDefined();
// 		expect(studentWithAttendLogs?.bojHandle).toBe(student.bojHandle);
// 		expect(studentWithAttendLogs?.weeklyAttendLog).toHaveLength(1);
// 		expect(studentWithAttendLogs?.weeklyAttendLog[0]).toMatchObject({
// 			round: 1,
// 			lectureDone: true,
// 			taskDone: false,
// 		});
// 	});

// 	it("retrieves all students with attend logs in lecture", async () => {
// 		const student1 = await StudentRepository.createStudent(STUDENT[0]);
// 		const student2 = await StudentRepository.createStudent(STUDENT[1]);
// 		const semester = await SemesterRepository.createSemester(SEMESTER[0]);
// 		const lecture = await LectureRepository.createLecture(
// 			semester.id,
// 			lectureData,
// 		);

// 		await StudentLectureLogRepository.createStudentLectureLog(
// 			student1.id,
// 			lecture.id,
// 			{ isInvited: true, isCancelled: false },
// 		);
// 		await StudentLectureLogRepository.createStudentLectureLog(
// 			student2.id,
// 			lecture.id,
// 			{ isInvited: true, isCancelled: false },
// 		);
// 		await WeeklyAttendLogRepository.createWeeklyAttendLog(
// 			student1.id,
// 			lecture.id,
// 			{ round: 1, lectureDone: true, taskDone: false },
// 		);
// 		await WeeklyAttendLogRepository.createWeeklyAttendLog(
// 			student2.id,
// 			lecture.id,
// 			{ round: 1, lectureDone: false, taskDone: true },
// 		);

// 		const studentsWithAttendLogs =
// 			await StudentWithAttendRepository.allStudentsWithAttendLogsInLecture(
// 				lecture.id,
// 			);

// 		expect(studentsWithAttendLogs).toHaveLength(2);
// 		expect(studentsWithAttendLogs[0].weeklyAttendLog).toHaveLength(1);
// 		expect(studentsWithAttendLogs[1].weeklyAttendLog).toHaveLength(1);
// 	});

// 	it("upserts student attend logs", async () => {
// 		const student = await StudentRepository.createStudent(STUDENT[0]);
// 		const semester = await SemesterRepository.createSemester(SEMESTER[0]);
// 		const lecture = await LectureRepository.createLecture(
// 			semester.id,
// 			lectureData,
// 		);

// 		const attendLog = [
// 			{ round: 1, lectureDone: true, taskDone: false },
// 			{ round: 2, lectureDone: false, taskDone: true },
// 		];

// 		await StudentWithAttendRepository.upsertStudentAttendLogs(
// 			student.id,
// 			lecture.id,
// 			attendLog,
// 		);

// 		const updatedStudent =
// 			await StudentWithAttendRepository.findStudentWithAttendLogByBojHandle(
// 				student.bojHandle,
// 			);

// 		expect(updatedStudent?.weeklyAttendLog).toHaveLength(2);
// 		expect(updatedStudent?.weeklyAttendLog[0]).toMatchObject(attendLog[0]);
// 		expect(updatedStudent?.weeklyAttendLog[1]).toMatchObject(attendLog[1]);

// 		// Test update
// 		const updatedAttendLog = [
// 			{ round: 1, lectureDone: true, taskDone: true },
// 			{ round: 2, lectureDone: true, taskDone: true },
// 		];

// 		await StudentWithAttendRepository.upsertStudentAttendLogs(
// 			student.id,
// 			lecture.id,
// 			updatedAttendLog,
// 		);

// 		const finalStudent =
// 			await StudentWithAttendRepository.findStudentWithAttendLogByBojHandle(
// 				student.bojHandle,
// 			);

// 		expect(finalStudent?.weeklyAttendLog).toHaveLength(2);
// 		expect(finalStudent?.weeklyAttendLog[0]).toMatchObject(updatedAttendLog[0]);
// 		expect(finalStudent?.weeklyAttendLog[1]).toMatchObject(updatedAttendLog[1]);
// 	});
// });
