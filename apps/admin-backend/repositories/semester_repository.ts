import type { Prisma, PrismaClient } from "@prisma/client";
import BaseRepository from "./base_repository";

export default class SemesterRepository extends BaseRepository {
	static instance: PrismaClient;
	/**
	 * Creates a new semester
	 */
	static async createSemester(props: Prisma.SemesterCreateInput) {
		return SemesterRepository.instance.semester.create({ data: props });
	}

	/**
	 * Finds a semester by id
	 */
	static async findSemesterById(id: number) {
		return SemesterRepository.instance.semester.findUnique({ where: { id } });
	}

	/**
	 * Finds a semester by semester year and season
	 *
	 * @param {{year: number, season: string}} semester
	 * @returns {Promise<Semester>}
	 */
	static async findSemesterBySeason(semester: Prisma.SemesterWhereInput) {
		return SemesterRepository.instance.semester.findFirst({ where: semester });
	}

	/**
	 * Find all semesters
	 *
	 * @returns {Promise<Array<Semester>>}
	 */
	static async allSemesters() {
		return SemesterRepository.instance.semester.findMany();
	}

	/**
	 * Resets the repository
	 *
	 * @returns {Promise<void>}
	 */
	static async reset() {
		return SemesterRepository.instance.semester.deleteMany();
	}
}
