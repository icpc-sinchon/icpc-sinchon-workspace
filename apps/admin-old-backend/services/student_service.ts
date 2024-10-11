import type { Prisma, Semester } from "@prisma/client";
import StudentRepository from "../repositories/student_repository";

export default class StudentService {
	private static instance: StudentService;
	private studentRepository: typeof StudentRepository;

	private constructor() {
		this.studentRepository = StudentRepository;
	}

	public static getInstance(): StudentService {
		if (!StudentService.instance) {
			StudentService.instance = new StudentService();
		}
		return StudentService.instance;
	}

	async updateStudent(studentId: number, props: Prisma.StudentUpdateInput) {
		return StudentRepository.updateStudent(studentId, props);
	}

	async deleteStudent(studentId: number) {
		return this.studentRepository.deleteStudent(studentId);
	}

	async findStudentById(studentId: number) {
		return this.studentRepository.findStudentById(studentId);
	}

	async findStudentByBojHandle(bojHandle: string) {
		return this.studentRepository.findStudentByBojHandle(bojHandle);
	}

	async getAllStudents() {
		return this.studentRepository.allStudents();
	}

	async resetStudents() {
		return this.studentRepository.reset();
	}
}
