import type { Semester, Prisma } from "@prisma/client";
import SemesterRepository from "repositories/semester_repository";

export default class SemesterService {
	private static instance: SemesterService;
	private semesterRepository: typeof SemesterRepository;

	private constructor() {
		this.semesterRepository = SemesterRepository;
	}

	public static getInstance(): SemesterService {
		if (!SemesterService.instance) {
			SemesterService.instance = new SemesterService();
		}
		return SemesterService.instance;
	}

	/**
	 * Creates a new semester
	 *
	 * @param props - The properties to create the semester
	 * @returns A promise that resolves to the created Semester
	 * @throws Error if the semester already exists
	 */
	async createSemester(props: Prisma.SemesterCreateInput) {
		const { year, season } = props;
		if (!year || !season) {
			throw new Error("Year and season are required");
		}
		const existingSemester = await this.findSemesterBySeason({ year, season });
		if (existingSemester) {
			throw new Error("Semester already exists");
		}
		return this.semesterRepository.createSemester(props);
	}

	/**
	 * Finds a semester by id
	 *
	 * @param id - The id of the semester to find
	 * @returns A promise that resolves to the found Semester or null
	 */
	async findSemesterById(id: number) {
		return this.semesterRepository.findSemesterById(id);
	}

	/**
	 * Finds a semester by year and season
	 *
	 * @param semester - An object containing the year and season to search for
	 * @returns A promise that resolves to the found Semester or null
	 */
	async findSemesterBySeason(
		semester: Prisma.SemesterWhereInput,
	): Promise<Semester | null> {
		return this.semesterRepository.findSemesterBySeason(semester);
	}

	/**
	 * Find all semesters
	 *
	 * @returns A promise that resolves to an array of all Semesters
	 */
	async getAllSemesters() {
		return this.semesterRepository.allSemesters();
	}

	/**
	 * Resets all semesters
	 *
	 * @returns A promise that resolves when the reset is complete
	 */
	async resetSemesters(): Promise<Prisma.BatchPayload> {
		return this.semesterRepository.reset();
	}
}
