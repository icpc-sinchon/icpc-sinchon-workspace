import { PrismaClient } from "@prisma/client";
import { afterAll, beforeAll, describe, it, expect, beforeEach } from "vitest";
import StudentRepository from "../repositories/student_repository";
import SemesterRepository from "../repositories/semester_repository";
import LectureRepository from "../repositories/lecture_repository";
import StudentLectureLogRepository from "../repositories/student_lecture_log_repository";
import { STUDENT } from "./mock";
import StudentService from "../services/student_service";

const prisma = new PrismaClient();

beforeAll(async () => {
	await prisma.$connect();
});

afterAll(async () => {
	await prisma.$disconnect();
});

describe("student service", () => {
	let studentService;

	beforeEach(async () => {
		studentService = new StudentService();
		await StudentRepository.reset();
		await SemesterRepository.reset();
		await LectureRepository.reset();
		await StudentLectureLogRepository.reset();
	});

	describe("findStudentsWithLectureLevelsBySemester", () => {
		it("should return an empty array when no students are found", async () => {
			const semester = await SemesterRepository.createSemester({
				year: 2024,
				season: "Summer",
			});

			const result =
				await studentService.findStudentsWithLectureLevelsBySemester(
					2024,
					"Summer",
				);

			expect(result).toEqual([]);
		});

		it("should return students with their lecture levels", async () => {
			const semester = await SemesterRepository.createSemester({
				year: 2024,
				season: "Summer",
			});
			const lecture1 = await LectureRepository.createLecture({
				level: "Novice",
				lectureNumber: 10,
				bojGroupId: 12345,
				semesterId: semester.id,
			});
			const lecture2 = await LectureRepository.createLecture({
				level: "Advanced",
				lectureNumber: 10,
				bojGroupId: 23456,
				semesterId: semester.id,
			});

			const student1 = await StudentRepository.createStudent(STUDENT[0]);

			const student2 = await StudentRepository.createStudent(STUDENT[1]);

			await StudentLectureLogRepository.createStudentLectureLog({
				studentId: student1.id,
				lectureId: lecture1.id,
				isInvited: true,
				isCancelled: false,
			});
			await StudentLectureLogRepository.createStudentLectureLog({
				studentId: student1.id,
				lectureId: lecture2.id,
				isInvited: true,
				isCancelled: false,
			});
			await StudentLectureLogRepository.createStudentLectureLog({
				studentId: student2.id,
				lectureId: lecture2.id,
				isInvited: true,
				isCancelled: false,
			});

			const result =
				await studentService.findStudentsWithLectureLevelsBySemester(
					2024,
					"Summer",
				);

			expect(result).toHaveLength(2);
			expect(result[0]).toMatchObject({
				id: student1.id,
				name: "신정화",
				bojHandle: "shinjh",
				email: "shinjh@example.com",
				phone: "010-1111-1111",
				studentNumber: "20240001",
				paymentStatus: "PAID_60000",
				lectureLevels: expect.arrayContaining(["Novice", "Advanced"]),
			});
			expect(result[1]).toMatchObject({
				id: student2.id,
				name: "김성현",
				bojHandle: "kimsh",
				email: "kimsh@example.com",
				phone: "010-2222-2222",
				studentNumber: "20240002",
				paymentStatus: "PAID_30000",
				lectureLevels: ["Advanced"],
			});
		});

		it("should handle students with 1 lecture logs", async () => {
			const semester = await SemesterRepository.createSemester({
				year: 2024,
				season: "Summer",
			});

			const lecture = await LectureRepository.createLecture({
				level: "Novice",
				lectureNumber: 10,
				bojGroupId: 12345,
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
			});

			await StudentLectureLogRepository.createStudentLectureLog({
				studentId: student.id,
				lectureId: lecture.id,
			});

			const result =
				await studentService.findStudentsWithLectureLevelsBySemester(
					2024,
					"Summer",
				);

			expect(result).toHaveLength(1);
			expect(result[0]).toMatchObject({
				id: student.id,
				name: "천민재",
				bojHandle: "cheonmj",
				email: "cheonmj@example.com",
				phone: "010-3333-3333",
				studentNumber: "20240003",
				paymentStatus: "PAID_60000",
				lectureLevels: ["Novice"],
			});
		});

		it("should handle no lecture log in some semester", async () => {
			const semester = await SemesterRepository.createSemester({
				year: 2024,
				season: "Summer",
			});

			const lecture = await LectureRepository.createLecture({
				level: "Novice",
				lectureNumber: 10,
				bojGroupId: 12345,
				semesterId: semester.id,
			});

			const student1 = await StudentRepository.createStudent({
				name: "이지언",
				bojHandle: "ez_code",
				email: "ezon@example.com",
				phone: "010-4444-4444",
				school: "YONSEI",
				studentNumber: "20240004",
				paymentStatus: "PAID_30000",
			});

			const student2 = await StudentRepository.createStudent({
				name: "최연재",
				bojHandle: "yeonjae",
				email: "yeonjae@example.com",
				phone: "010-5555-5555",
				school: "SOOKMYUNG",
				studentNumber: "20240005",
				paymentStatus: "PAID_60000",
			});

			await StudentLectureLogRepository.createStudentLectureLog({
				studentId: student1.id,
				lectureId: lecture.id,
				isInvited: true,
				isCancelled: false,
			});

			const result =
				await studentService.findStudentsWithLectureLevelsBySemester(
					2024,
					"Winter",
				);

			expect(result).toHaveLength(0);
			// expect(result[0]).toMatchObject({
			// 	id: student1.id,
			// 	name: "이지언",
			// 	bojHandle: "ez_code",
			// 	email: "ezon@example.com",
			// 	phone: "010-4444-4444",
			// 	studentNumber: "20240004",
			// 	paymentStatus: "PAID_30000",
			// 	lectureLevels: ["Novice"],
			// });
		});

		it("should not return students from different semesters", async () => {
			const semester2024Summer = await SemesterRepository.createSemester({
				year: 2024,
				season: "Summer",
			});
			const semester2024Winter = await SemesterRepository.createSemester({
				year: 2024,
				season: "Winter",
			});

			const lecture2024Summer = await LectureRepository.createLecture({
				level: "Novice",
				lectureNumber: 10,
				bojGroupId: 12345,
				semesterId: semester2024Summer.id,
			});
			const lecture2024Winter = await LectureRepository.createLecture({
				level: "Advanced",
				lectureNumber: 10,
				bojGroupId: 23456,
				semesterId: semester2024Winter.id,
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
				lectureId: lecture2024Summer.id,
				isInvited: true,
				isCancelled: false,
			});
			await StudentLectureLogRepository.createStudentLectureLog({
				studentId: student.id,
				lectureId: lecture2024Winter.id,
				isInvited: true,
				isCancelled: false,
			});

			const resultSummer =
				await studentService.findStudentsWithLectureLevelsBySemester(
					2024,
					"Summer",
				);

			const resultWinter =
				await studentService.findStudentsWithLectureLevelsBySemester(
					2024,
					"Winter",
				);

			expect(resultSummer).toHaveLength(1);
			expect(resultSummer[0].lectureLevels).toEqual(["Novice"]);

			expect(resultWinter).toHaveLength(1);
			expect(resultWinter[0].lectureLevels).toEqual(["Advanced"]);
		});
	});
});
