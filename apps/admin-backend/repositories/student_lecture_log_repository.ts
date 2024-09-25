import BaseRepository from "./base_repository";
import type { Prisma, PrismaClient } from "@prisma/client";

export default class StudentLectureLogRepository extends BaseRepository {
	static instance: PrismaClient;

	static async createStudentLectureLog(
		studentId: number,
		lectureId: number,
		studentLectureLogData: Omit<
			Prisma.StudentLectureLogCreateInput,
			"student" | "lecture"
		>,
	) {
		return StudentLectureLogRepository.instance.studentLectureLog.create({
			data: {
				...studentLectureLogData,
				lecture: {
					connect: { id: lectureId },
				},
				student: {
					connect: { id: studentId },
				},
			},
		});
	}

	static async updateStudentLectureLog(
		id: number,
		props: Prisma.StudentLectureLogUpdateInput,
	) {
		return StudentLectureLogRepository.instance.studentLectureLog.update({
			where: { id },
			data: props,
		});
	}

	static async deleteStudentLectureLog(id: number) {
		return StudentLectureLogRepository.instance.studentLectureLog.delete({
			where: { id },
		});
	}

	static async findStudentLectureLogById(id: number) {
		return StudentLectureLogRepository.instance.studentLectureLog.findUnique({
			where: { id },
		});
	}

	static async findStudentLectureLogByLectureId(
		studentId: number,
		lectureId: number,
	) {
		return StudentLectureLogRepository.instance.studentLectureLog.findUnique({
			where: { studentId_lectureId: { studentId, lectureId } },
		});
	}

	/**
	 * Find all student lecture logs
	 *
	 * @returns A promise that resolves to an array of StudentLectureLog
	 */
	static async allStudentLectureLogs() {
		return StudentLectureLogRepository.instance.studentLectureLog.findMany();
	}

	/**
	 * Resets the repository
	 *
	 * @returns A promise that resolves when the reset is complete
	 */
	static async reset() {
		return StudentLectureLogRepository.instance.studentLectureLog.deleteMany();
	}
}
