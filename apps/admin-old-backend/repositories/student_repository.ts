import BaseRepository from "./base_repository";
import type { Prisma, Student, PrismaClient } from "@prisma/client";

export default class StudentRepository extends BaseRepository {
	static instance: PrismaClient;
	/**
	 * Creates a new student
	 */
	static async createStudent(studentData: Prisma.StudentCreateInput) {
		return StudentRepository.instance.student.create({ data: studentData });
	}

	/**
	 * Creates new students
	 */
	static async createStudents(studentData: Prisma.StudentCreateManyInput[]) {
		return StudentRepository.instance.student.createMany({
			data: studentData,
			skipDuplicates: true,
		});
	}

	/**
	 * Updates a student by id
	 */
	static async updateStudent(
		studentId: number,
		newStudentData: Prisma.StudentUpdateInput,
	) {
		return StudentRepository.instance.student.update({
			where: { id: studentId },
			data: newStudentData,
		});
	}

	/**
	 * Deletes a student by id
	 */
	static async deleteStudent(studentId: number) {
		return StudentRepository.instance.student.delete({
			where: { id: studentId },
		});
	}

	/**
	 * Finds a student by id
	 */
	static async findStudentById(studentId: number) {
		return StudentRepository.instance.student.findUnique({
			where: { id: studentId },
		});
	}

	/**
	 * Finds a student by boj handle
	 */
	static async findStudentByBojHandle(bojHandle: Student["bojHandle"]) {
		return StudentRepository.instance.student.findUnique({
			where: { bojHandle },
		});
	}

	// 모든 학생 조회
	static async allStudents() {
		return StudentRepository.instance.student.findMany();
	}

	/**
	 * Resets the repository
	 */
	static async reset() {
		return StudentRepository.instance.student.deleteMany();
	}
}
