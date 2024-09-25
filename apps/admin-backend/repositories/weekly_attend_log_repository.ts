import BaseRepository from "./base_repository";
import type { Prisma, PrismaClient, Semester } from "@prisma/client";

export default class WeeklyAttendLogRepository extends BaseRepository {
	static instance: PrismaClient;
	/**
	 * Creates a new weekly attend log
	 */
	static async createWeeklyAttendLog(
		studentId: number,
		lectureId: number,
		weeklyAttendLogData: Omit<
			Prisma.WeeklyAttendLogCreateInput,
			"student" | "lecture"
		>,
	) {
		return WeeklyAttendLogRepository.instance.weeklyAttendLog.create({
			data: {
				...weeklyAttendLogData,
				student: {
					connect: { id: studentId },
				},
				lecture: {
					connect: { id: lectureId },
				},
			},
		});
	}

	/**
	 * Updates a weekly attend log by id
	 *
	 * @param {number} id
	 * @param {Object} props
	 * @returns {Promise<WeeklyAttendLog>}
	 */
	static async updateWeeklyAttendLog(
		id: number,
		props: Prisma.WeeklyAttendLogUpdateInput,
	) {
		return WeeklyAttendLogRepository.instance.weeklyAttendLog.update({
			where: { id },
			data: props,
		});
	}

	/**
	 * Deletes a weekly attend log by id
	 *
	 * @param {number} id
	 * @returns {Promise<WeeklyAttendLog>}
	 */
	static async deleteWeeklyAttendLog(id: number) {
		return WeeklyAttendLogRepository.instance.weeklyAttendLog.delete({
			where: { id },
		});
	}

	/**
	 * Finds a weekly attend log by id
	 *
	 * @param {number} id
	 * @returns {Promise<WeeklyAttendLog>}
	 */
	static async findWeeklyAttendLogById(id: number) {
		return WeeklyAttendLogRepository.instance.weeklyAttendLog.findUnique({
			where: { id },
		});
	}

	static async findWeeklyAttendLogByStudentId(studentId: number) {
		return WeeklyAttendLogRepository.instance.weeklyAttendLog.findMany({
			where: { studentId },
		});
	}

	static async upsertWeeklyAttendLogWithStudentIdAndLectureId(
		studentId: number,
		lectureId: number,
		round: number,
		newLog: { lectureDone?: boolean; taskDone?: boolean },
	) {
		return WeeklyAttendLogRepository.instance.weeklyAttendLog.upsert({
			where: {
				studentId_lectureId_round: {
					studentId,
					lectureId,
					round,
				},
			},
			update: newLog,
			create: {
				...newLog,
				round,
				student: {
					connect: { id: studentId },
				},
				lecture: {
					connect: { id: lectureId },
				},
			},
		});
	}

	/**
	 * Find all weekly attend logs
	 *
	 * @returns {Promise<Array<WeeklyAttendLog>>}
	 */
	static async allWeeklyAttendLogs() {
		return WeeklyAttendLogRepository.instance.weeklyAttendLog.findMany();
	}

	/**
	 * Resets the repository
	 *
	 * @returns {Promise<void>}
	 */
	static async reset() {
		return WeeklyAttendLogRepository.instance.weeklyAttendLog.deleteMany();
	}
}
