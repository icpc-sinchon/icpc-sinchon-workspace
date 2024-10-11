import { PrismaClient } from "@prisma/client";
import { afterAll, beforeAll, describe, it, expect, beforeEach } from "vitest";
import StudentRepository from "repositories/student_repository";
import SemesterRepository from "repositories/semester_repository";
import LectureRepository from "repositories/lecture_repository";
import StudentLectureLogRepository from "repositories/student_lecture_log_repository";
import { LECTURE, SEMESTER, STUDENT } from "../mock";

const prisma = new PrismaClient();

beforeAll(async () => {
	await prisma.$connect();
});

afterAll(async () => {
	await prisma.$disconnect();
});

describe("StudentRepository", () => {
	beforeEach(async () => {
		// 각 테스트 전에 데이터베이스 초기화
		await StudentRepository.reset();
		await SemesterRepository.reset();
		await LectureRepository.reset();
		await StudentLectureLogRepository.reset();
	});

	it("creates student", async () => {
		const student = await StudentRepository.createStudent({
			name: "김철수",
			bojHandle: "fesoo",
			school: "SOGANG",
			email: "fesoo@example.com",
			phone: "01012345678",
			studentNumber: "2021-12345",
			paymentStatus: "PAID_30000",
			refundAccount: "123456-78910",
		});

		expect(student).toMatchObject({
			bojHandle: "fesoo",
			email: "fesoo@example.com",
		});
	});

	it("creates many students", async () => {
		const result = await StudentRepository.createStudents(STUDENT);

		expect(result.count).toBe(STUDENT.length);
	});

	it("finds student by BOJ handle", async () => {
		const createdStudent = await StudentRepository.createStudent({
			name: "이영희",
			bojHandle: "younghee",
			school: "YONSEI",
			email: "younghee@example.com",
			phone: "01087654321",
			studentNumber: "2021-67890",
			paymentStatus: "PAID_60000",
			refundAccount: "123456-78910",
		});

		const foundStudent =
			await StudentRepository.findStudentByBojHandle("younghee");
		expect(foundStudent).toMatchObject({
			bojHandle: "younghee",
			email: "younghee@example.com",
		});
	});

	it("updates student", async () => {
		const student = await StudentRepository.createStudent({
			name: "박민수",
			bojHandle: "minsu",
			school: "EWHA",
			email: "minsu@example.com",
			phone: "01011112222",
			studentNumber: "2021-13579",
			paymentStatus: "PAID_30000",
			refundAccount: "123456-78910",
		});

		const updatedStudent = await StudentRepository.updateStudent(student.id, {
			name: "박연수",
			paymentStatus: "PAID_60000",
		});

		expect(updatedStudent).toMatchObject({
			name: "박연수",
			paymentStatus: "PAID_60000",
		});
	});

	it("deletes student", async () => {
		const student = await StudentRepository.createStudent({
			name: "정소희",
			bojHandle: "sohee",
			school: "HONGIK",
			email: "sohee@example.com",
			phone: "01033334444",
			studentNumber: "2021-24680",
			paymentStatus: "PAID_30000",
			refundAccount: "2324893-123123",
		});

		await StudentRepository.deleteStudent(student.id);

		const deletedStudent = await StudentRepository.findStudentById(student.id);
		expect(deletedStudent).toBeNull();
	});

	it("retrieves all students", async () => {
		await StudentRepository.createStudents([
			{
				name: "강동훈",
				bojHandle: "donghoon",
				school: "SOGANG",
				email: "donghoon@example.com",
				phone: "01055556666",
				studentNumber: "2021-11111",
				paymentStatus: "PAID_30000",
				refundAccount: "123456-78910",
			},
			{
				name: "최지현",
				bojHandle: "jihyun",
				school: "YONSEI",
				email: "jihyun@example.com",
				phone: "01077778888",
				studentNumber: "2021-22222",
				paymentStatus: "PAID_60000",
				refundAccount: "2903432-123123",
			},
		]);

		const allStudents = await StudentRepository.allStudents();
		expect(allStudents.length).toBe(2);
		expect(allStudents[0]).toHaveProperty("bojHandle");
		expect(allStudents[1]).toHaveProperty("bojHandle");
	});
});
