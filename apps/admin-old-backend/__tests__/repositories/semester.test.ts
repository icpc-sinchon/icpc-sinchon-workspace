import { PrismaClient } from "@prisma/client";
import { afterAll, beforeAll, describe, it, expect, beforeEach } from "vitest";
import SemesterRepository from "repositories/semester_repository";

const prisma = new PrismaClient();

beforeAll(async () => {
	await prisma.$connect();
});

afterAll(async () => {
	await prisma.$disconnect();
});

describe("SemesterRepository", () => {
	beforeEach(async () => {
		// 각 테스트 전에 데이터베이스를 초기화합니다.
		await SemesterRepository.reset();
	});

	describe("createSemester", () => {
		it("should create a new semester", async () => {
			const semesterData = { year: 2024, season: "Summer" } as const;
			const semester = await SemesterRepository.createSemester(semesterData);

			expect(semester).toHaveProperty("id");
			expect(semester.year).toBe(semesterData.year);
			expect(semester.season).toBe(semesterData.season);
		});
	});

	describe("findSemesterById", () => {
		it("should find a semester by id", async () => {
			const createdSemester = await SemesterRepository.createSemester({
				year: 2024,
				season: "Summer",
			});
			const foundSemester = await SemesterRepository.findSemesterById(
				createdSemester.id,
			);

			expect(foundSemester).toEqual(createdSemester);
		});

		it("should return null for non-existent id", async () => {
			const foundSemester = await SemesterRepository.findSemesterById(999);

			expect(foundSemester).toBeNull();
		});
	});

	describe("findSemesterBySeason", () => {
		it("should find a semester by year and season", async () => {
			const semesterData = { year: 2024, season: "Summer" } as const;
			await SemesterRepository.createSemester(semesterData);

			const foundSemester =
				await SemesterRepository.findSemesterBySeason(semesterData);

			expect(foundSemester).not.toBeNull();
			expect(foundSemester?.year).toBe(semesterData.year);
			expect(foundSemester?.season).toBe(semesterData.season);
		});

		it("should return null for non-existent semester", async () => {
			const foundSemester = await SemesterRepository.findSemesterBySeason({
				year: 2025,
				season: "Winter",
			});

			expect(foundSemester).toBeNull();
		});
	});

	describe("allSemesters", () => {
		it("should return all semesters", async () => {
			await SemesterRepository.createSemester({ year: 2024, season: "Summer" });
			await SemesterRepository.createSemester({ year: 2024, season: "Fall" });
			await SemesterRepository.createSemester({ year: 2025, season: "Spring" });

			const allSemesters = await SemesterRepository.allSemesters();

			expect(allSemesters).toHaveLength(3);
			expect(allSemesters[0]).toHaveProperty("id");
			expect(allSemesters[1]).toHaveProperty("year");
			expect(allSemesters[2]).toHaveProperty("season");
		});

		it("should return an empty array when no semesters exist", async () => {
			const allSemesters = await SemesterRepository.allSemesters();

			expect(allSemesters).toEqual([]);
		});
	});

	describe("reset", () => {
		it("should delete all semesters", async () => {
			await SemesterRepository.createSemester({ year: 2024, season: "Summer" });
			await SemesterRepository.createSemester({ year: 2024, season: "Fall" });

			expect(await SemesterRepository.allSemesters()).toHaveLength(2);

			await SemesterRepository.reset();

			const allSemesters = await SemesterRepository.allSemesters();
			expect(allSemesters).toHaveLength(0);
		});
	});
});
