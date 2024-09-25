import { PrismaClient } from "@prisma/client";
import { afterAll, beforeAll, describe, it, expect, beforeEach } from "vitest";
import WeeklyAttendLogService from "../services/weekly_attend_log_service";
import LectureRepository from "../repositories/lecture_repository";
import WeeklyAttendLogRepository from "../repositories/weekly_attend_log_repository";
import StudentRepository from "../repositories/student_repository";
import SemesterRepository from "../repositories/semester_repository";

const prisma = new PrismaClient();

beforeAll(async () => {
	await prisma.$connect();
});

afterAll(async () => {
	await prisma.$disconnect();
});

describe("WeeklyAttendLogService", () => {
	let weeklyAttendLogService;

	beforeEach(async () => {
		weeklyAttendLogService = new WeeklyAttendLogService();
		// 각 테스트 전에 관련 테이블들을 초기화합니다.
		await WeeklyAttendLogRepository.reset();
		await LectureRepository.reset();
		await StudentRepository.reset();
		await SemesterRepository.reset();
	});

	describe("updateWeeklyAttendLogOfStudent", () => {
		it("should create a new weekly attend log if it doesn't exist", async () => {
			const semester = await SemesterRepository.createSemester({
				year: 2024,
				season: "Summer",
			});
			const lecture = await LectureRepository.createLecture({
				level: "Novice",
				lectureNumber: 10,
				bojGroupId: 12343,
				semesterId: semester.id,
			});
			const student = await StudentRepository.createStudent({
				name: "신정화",
				bojHandle: "shinjh",
				email: "shinjh@example.com",
				phone: "010-1111-1111",
				school: "EWHA",
				studentNumber: "20240001",
				paymentStatus: "PAID_60000",
			});

			const result =
				await weeklyAttendLogService.updateWeeklyAttendLogOfStudent(
					student.id,
					{
						year: "2024",
						season: "Summer",
						lectureLevel: "Novice",
						lectureRound: 1,
						content: { lectureDone: true, taskDone: false },
					},
				);

			expect(result).toBeDefined();
			expect(result.studentId).toBe(student.id);
			expect(result.lectureId).toBe(lecture.id);
			expect(result.round).toBe(1);
			expect(result.lectureDone).toBe(true);
			expect(result.taskDone).toBe(false);
		});

		it("should update an existing weekly attend log", async () => {
			const semester = await SemesterRepository.createSemester({
				year: 2024,
				season: "Summer",
			});
			const lecture = await LectureRepository.createLecture({
				level: "Novice",
				lectureNumber: 10,
				bojGroupId: 12343,
				semesterId: semester.id,
			});
			const student = await StudentRepository.createStudent({
				name: "김성현",
				bojHandle: "kimsh",
				email: "kimsh@example.com",
				phone: "010-2222-2222",
				school: "SOGANG",
				studentNumber: "20240002",
				paymentStatus: "PAID_30000",
			});
			await WeeklyAttendLogRepository.createWeeklyAttendLog({
				studentId: student.id,
				lectureId: lecture.id,
				round: 1,
				lectureDone: true,
				taskDone: false,
			});

			const result =
				await weeklyAttendLogService.updateWeeklyAttendLogOfStudent(
					student.id,
					{
						year: "2024",
						season: "Summer",
						lectureLevel: "Novice",
						lectureRound: 1,
						content: { lectureDone: true, taskDone: true },
					},
				);

			expect(result).toBeDefined();
			expect(result.studentId).toBe(student.id);
			expect(result.lectureId).toBe(lecture.id);
			expect(result.round).toBe(1);
			expect(result.lectureDone).toBe(true);
			expect(result.taskDone).toBe(true);
		});
	});

	describe("findAllStudentsAttendLogs", () => {
		it("should return attend logs for all students", async () => {
			const semester = await SemesterRepository.createSemester({
				year: 2024,
				season: "Summer",
			});
			const lecture = await LectureRepository.createLecture({
				level: "Novice",
				lectureNumber: 10,
				bojGroupId: 12343,
				semesterId: semester.id,
			});
			const student1 = await StudentRepository.createStudent({
				name: "천민재",
				bojHandle: "cheonmj",
				email: "cheonmj@example.com",
				phone: "010-3333-3333",
				school: "HONGIK",
				studentNumber: "20240003",
				paymentStatus: "PAID_60000",
			});
			const student2 = await StudentRepository.createStudent({
				name: "이지언",
				bojHandle: "ez_code",
				email: "ezon@example.com",
				phone: "010-4444-4444",
				school: "YONSEI",
				studentNumber: "20240004",
				paymentStatus: "PAID_30000",
			});
			await WeeklyAttendLogRepository.createWeeklyAttendLog({
				studentId: student1.id,
				lectureId: lecture.id,
				round: 1,
				lectureDone: true,
				taskDone: true,
			});
			await WeeklyAttendLogRepository.createWeeklyAttendLog({
				studentId: student2.id,
				lectureId: lecture.id,
				round: 1,
				lectureDone: true,
				taskDone: false,
			});

			const result = await weeklyAttendLogService.findAllStudentsAttendLogs(
				"2024",
				"Summer",
				"Novice",
			);

			expect(result).toHaveLength(2);
			expect(result[0].bojHandle).toBe("cheonmj");
			expect(result[0].attendLog).toHaveLength(10);
			expect(result[0].attendLog[0]).toEqual({
				lectureDone: true,
				taskDone: true,
			});
			expect(result[1].bojHandle).toBe("ez_code");
			expect(result[1].attendLog).toHaveLength(10);
			expect(result[1].attendLog[0]).toEqual({
				lectureDone: true,
				taskDone: false,
			});
		});

		it("should throw NotFoundError when lecture is not found", async () => {
			await expect(
				weeklyAttendLogService.findAllStudentsAttendLogs(
					"2024",
					"Winter",
					"Advanced",
				),
			).rejects.toThrow("Lecture not found for 2024 Winter Advanced");
		});
	});

	describe("findStudentAttendLogs", () => {
		it("should return attend logs for a specific student", async () => {
			const semester = await SemesterRepository.createSemester({
				year: 2024,
				season: "Summer",
			});
			const lecture = await LectureRepository.createLecture({
				level: "Novice",
				lectureNumber: 10,
				bojGroupId: 12343,
				semesterId: semester.id,
			});
			const student = await StudentRepository.createStudent({
				name: "최연재",
				bojHandle: "yeonjae",
				email: "yeonjae@example.com",
				phone: "010-5555-5555",
				school: "SOOKMYUNG",
				studentNumber: "20240005",
				paymentStatus: "PAID_60000",
			});
			await WeeklyAttendLogRepository.createWeeklyAttendLog({
				studentId: student.id,
				lectureId: lecture.id,
				round: 1,
				lectureDone: true,
				taskDone: true,
			});

			const result = await weeklyAttendLogService.findStudentAttendLogs(
				student.id,
				"2024",
				"Summer",
				"Novice",
			);

			expect(result.bojHandle).toBe("yeonjae");
			expect(result.attendLog).toHaveLength(10);
			expect(result.attendLog[0]).toEqual({
				lectureDone: true,
				taskDone: true,
			});
			expect(result.attendLog[1]).toEqual({
				lectureDone: false,
				taskDone: false,
			});
		});

		it("should throw NotFoundError when student logs are not found", async () => {
			const semester = await SemesterRepository.createSemester({
				year: 2024,
				season: "Summer",
			});
			await LectureRepository.createLecture({
				level: "Novice",
				lectureNumber: 10,
				bojGroupId: 12343,
				semesterId: semester.id,
			});

			await expect(
				weeklyAttendLogService.findStudentAttendLogs(
					9999,
					"2024",
					"Summer",
					"Novice",
				),
			).rejects.toThrow("Student logs not found for student 9999");
		});
	});
});
