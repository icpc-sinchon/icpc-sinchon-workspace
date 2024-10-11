import { PrismaClient } from "@prisma/client";
import { afterAll, beforeAll, describe, it, expect, beforeEach } from "vitest";
import StudentRepository from "../repositories/student_repository";
import SemesterRepository from "../repositories/semester_repository";
import LectureRepository from "../repositories/lecture_repository";
import StudentLectureLogRepository from "../repositories/student_lecture_log_repository";
import { STUDENT } from "./mock";
import StudentService from "../services/student_service";
import StudentLectureService from "../services/student_lecture_service";

const prisma = new PrismaClient();

beforeAll(async () => {
	await prisma.$connect();
});

afterAll(async () => {
	await prisma.$disconnect();
});

describe("StudentLectureService", () => {
	let studentLectureService: StudentLectureService;

	beforeEach(async () => {
		studentLectureService = StudentLectureService.getInstance();
		// 각 테스트 전에 관련 테이블들을 초기화합니다.
		await StudentRepository.reset();
		await LectureRepository.reset();
		await SemesterRepository.reset();
		await StudentLectureLogRepository.reset();
	});

	describe("createStudentLectureLogWithStudent", () => {
		it("should create a new student and lecture log if student doesn't exist", async () => {
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

			const result =
				await studentLectureService.createStudentLectureLogWithStudent({
					name: "신정화",
					bojHandle: "shinjh",
					email: "shinjh@example.com",
					phone: "010-1111-1111",
					school: "EWHA",
					studentNumber: "20240001",
					paymentStatus: "PAID_60000",
					refundAccount: "123456-78910",
					lectureInfo: { year: 2024, season: "Summer", lectureLevel: "Novice" },
				});

			expect(result).toBeDefined();
			expect(result).toHaveProperty("id");
			expect(result.studentId).toBeDefined();
			expect(result.lectureId).toBe(lecture.id);
		});

		it("should create only lecture log if student already exists", async () => {
			const semester = await SemesterRepository.createSemester({
				year: 2024,
				season: "Summer",
			});
			const lecture = await LectureRepository.createLecture({
				level: "Advanced",
				lectureNumber: 10,
				bojGroupId: 2345,
				semesterId: semester.id,
			});
			const existingStudent = await StudentRepository.createStudent({
				name: "김성현",
				bojHandle: "kimsh",
				email: "kimsh@example.com",
				phone: "010-2222-2222",
				school: "SOGANG",
				studentNumber: "20240002",
				paymentStatus: "PAID_30000",
				refundAccount: "123456-78910",
			});

			const result =
				await studentLectureService.createStudentLectureLogWithStudent({
					name: "김성현",
					bojHandle: "kimsh",
					email: "kimsh@example.com",
					phone: "010-2222-2222",
					school: "SOGANG",
					studentNumber: "20240002",
					paymentStatus: "PAID_30000",
					refundAccount: "123456-78910",
					lectureInfo: {
						year: 2024,
						season: "Summer",
						lectureLevel: "Advanced",
					},
				});

			expect(result).toBeDefined();
			expect(result.studentId).toBe(existingStudent.id);
			expect(result.lectureId).toBe(lecture.id);
		});
	});

	describe("updateStudentLectureLogByStudentId", () => {
		it("should update existing student lecture log", async () => {
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
				name: "천민재",
				bojHandle: "cheonmj",
				email: "cheonmj@example.com",
				phone: "010-3333-3333",
				school: "HONGIK",
				studentNumber: "20240003",
				paymentStatus: "PAID_60000",
				refundAccount: "123456-78910",
			});
			await StudentLectureLogRepository.createStudentLectureLog({
				studentId: student.id,
				lectureId: lecture.id,
			});

			const result =
				await studentLectureService.updateStudentLectureLogByStudentId(
					student.id,
					{
						year: 2024,
						season: "Summer",
						lectureLevel: "Novice",
						content: { isInvited: true },
					},
				);

			expect(result).toBeDefined();
			expect(result.isInvited).toBe(true);
		});

		it("should throw error when student lecture log doesn't exist", async () => {
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
			const student = await StudentRepository.createStudent({
				name: "이지언",
				bojHandle: "ez_code",
				email: "ezon@example.com",
				phone: "010-4444-4444",
				school: "YONSEI",
				studentNumber: "20240004",
				paymentStatus: "PAID_30000",
				refundAccount: "2341464-32232",
			});

			await expect(
				studentLectureService.updateStudentLectureLogByStudentId(student.id, {
					year: 2024,
					season: "Summer",
					lectureLevel: "Novice",
					content: { isInvited: true },
				}),
			).rejects.toThrow("Student lecture log not found");
		});
	});

	describe("updateLectureOfStudent", () => {
		it("should change student's lecture", async () => {
			const semester = await SemesterRepository.createSemester({
				year: 2024,
				season: "Summer",
			});
			const noviceLecture = await LectureRepository.createLecture({
				level: "Novice",
				lectureNumber: 10,
				bojGroupId: 12343,
				semesterId: semester.id,
			});
			const advancedLecture = await LectureRepository.createLecture({
				level: "Advanced",
				lectureNumber: 10,
				bojGroupId: 2345,
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
				refundAccount: "123456-78910",
			});
			await StudentLectureLogRepository.createStudentLectureLog({
				studentId: student.id,
				lectureId: noviceLecture.id,
			});

			const result = await studentLectureService.updateLectureOfStudent(
				student.id,
				{
					year: 2024,
					season: "Summer",
					from: "Novice",
					to: "Advanced",
					content: { isInvited: true },
				},
			);

			expect(result).toBeDefined();
			expect(result.lectureId).toBe(advancedLecture.id);
			expect(result.isInvited).toBe(true);

			const oldLog =
				await StudentLectureLogRepository.findStudentLectureLogByLectureId(
					student.id,
					noviceLecture.id,
				);
			expect(oldLog.isCancelled).toBe(true);
		});
	});

	describe("deleteStudentLectureLogByStudentId", () => {
		it("should mark student lecture log as cancelled", async () => {
			const semester = await SemesterRepository.createSemester({
				year: 2024,
				season: "Winter",
			});
			const lecture = await LectureRepository.createLecture({
				level: "Advanced",
				lectureNumber: 10,
				bojGroupId: 4567,
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
			await StudentLectureLogRepository.createStudentLectureLog({
				studentId: student.id,
				lectureId: lecture.id,
			});

			const result =
				await studentLectureService.deleteStudentLectureLogByStudentId(
					student.id,
					{
						year: 2024,
						season: "Winter",
						lectureLevel: "Advanced",
					},
				);

			expect(result).toBeDefined();
			expect(result.isCancelled).toBe(true);
		});
	});

	describe("findStudentLectureLogByStudentId", () => {
		it("should find student lecture log", async () => {
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
			const createdLog =
				await StudentLectureLogRepository.createStudentLectureLog({
					studentId: student.id,
					lectureId: lecture.id,
				});

			const result =
				await studentLectureService.findStudentLectureLogByStudentId(
					student.id,
					{
						year: 2024,
						season: "Summer",
						lectureLevel: "Novice",
					},
				);

			expect(result).toBeDefined();
			expect(result.id).toBe(createdLog.id);
		});
	});
});
