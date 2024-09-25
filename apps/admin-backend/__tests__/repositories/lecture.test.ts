import { PrismaClient } from "@prisma/client";
import { afterAll, beforeAll, describe, it, expect, beforeEach } from "vitest";
import LectureRepository from "repositories/lecture_repository";
import SemesterRepository from "repositories/semester_repository";
import TaskRepository from "repositories/task_repository";

const prisma = new PrismaClient();

beforeAll(async () => {
	await prisma.$connect();
});

afterAll(async () => {
	await prisma.$disconnect();
});

describe("LectureRepository", () => {
	beforeEach(async () => {
		// 각 테스트 전에 데이터베이스 초기화
		await LectureRepository.reset();
		await SemesterRepository.reset();
	});

	it("creates lecture", async () => {
		const semester = await SemesterRepository.createSemester({
			year: 2024,
			season: "Summer",
		});

		const lecture = await LectureRepository.createLecture(semester.id, {
			level: "Novice",
			bojGroupId: 12345,
		});

		expect(lecture).toMatchObject({
			level: "Novice",
			bojGroupId: 12345,
		});
		expect(lecture).toHaveProperty("id");
	});

	it("updates lecture", async () => {
		const semester = await SemesterRepository.createSemester({
			year: 2024,
			season: "Summer",
		});

		const lecture = await LectureRepository.createLecture(semester.id, {
			level: "Novice",
			bojGroupId: 12345,
		});

		const updatedLecture = await LectureRepository.updateLecture(lecture.id, {
			level: "Intermediate",
			bojGroupId: 67890,
		});

		expect(updatedLecture).toMatchObject({
			level: "Intermediate",
			bojGroupId: 67890,
		});
	});

	it("deletes lecture", async () => {
		const semester = await SemesterRepository.createSemester({
			year: 2024,
			season: "Summer",
		});

		const lecture = await LectureRepository.createLecture(semester.id, {
			level: "Novice",
			bojGroupId: 12345,
		});

		expect(lecture).toHaveProperty("id");

		await LectureRepository.deleteLecture(lecture.id);

		const deletedLecture = await LectureRepository.findLectureById(lecture.id);
		expect(deletedLecture).toBeNull();
	});

	it("finds lecture by id", async () => {
		const semester = await SemesterRepository.createSemester({
			year: 2024,
			season: "Summer",
		});

		const createdLecture = await LectureRepository.createLecture(semester.id, {
			level: "Novice",
			bojGroupId: 12345,
		});

		const foundLecture = await LectureRepository.findLectureById(
			createdLecture.id,
		);
		expect(foundLecture).toMatchObject({
			level: "Novice",
			bojGroupId: 12345,
		});
	});

	it("finds lectures by semester year, season", async () => {
		const semester = await SemesterRepository.createSemester({
			year: 2024,
			season: "Summer",
		});

		await LectureRepository.createLecture(semester.id, {
			level: "Novice",
			bojGroupId: 12345,
		});

		await LectureRepository.createLecture(semester.id, {
			level: "Intermediate",
			bojGroupId: 67890,
		});

		const lectures = await LectureRepository.findLecturesBySemester(
			2024,
			"Summer",
		);
		expect(lectures.length).toBe(2);
		expect(lectures[0]).toMatchObject({
			level: "Novice",
			bojGroupId: 12345,
		});
	});

	it("find lecture by year, season, and level", async () => {
		const semester = await SemesterRepository.createSemester({
			year: 2024,
			season: "Summer",
		});

		await LectureRepository.createLecture(semester.id, {
			level: "Novice",
			bojGroupId: 12345,
		});

		const lecture = await LectureRepository.findLectureBySemesterAndLevel(
			2024,
			"Summer",
			"Novice",
		);
		expect(lecture).toMatchObject({
			level: "Novice",
			bojGroupId: 12345,
		});
	});

	it("retrieves lectures with tasks by semester", async () => {
		const semester = await SemesterRepository.createSemester({
			year: 2024,
			season: "Summer",
		});

		const lecture = await LectureRepository.createLecture(semester.id, {
			level: "Novice",
			bojGroupId: 12345,
		});

		await TaskRepository.createTask(lecture.id, {
			round: 1,
			practiceId: 1,
			minSolveCount: 3,
		});

		const lectures = await LectureRepository.findLecturesWithTasksBySemester(
			2024,
			"Summer",
		);
		expect(lectures.length).toBe(1);
		expect(lectures[0]).toHaveProperty("task");
		expect(lectures[0].task).toHaveLength(1);
	});

	it("retrieves all lectures", async () => {
		const semester1 = await SemesterRepository.createSemester({
			year: 2024,
			season: "Summer",
		});

		const semester2 = await SemesterRepository.createSemester({
			year: 2024,
			season: "Fall",
		});

		await LectureRepository.createLecture(semester1.id, {
			level: "Novice",
			bojGroupId: 12345,
		});

		await LectureRepository.createLecture(semester2.id, {
			level: "Intermediate",
			bojGroupId: 67890,
		});

		const allLectures = await LectureRepository.allLectures();
		expect(allLectures.length).toBe(2);
		expect(allLectures[0]).toHaveProperty("level");
		expect(allLectures[1]).toHaveProperty("bojGroupId");
	});
});
