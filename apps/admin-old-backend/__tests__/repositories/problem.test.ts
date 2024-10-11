import { PrismaClient } from "@prisma/client";
import { afterAll, beforeAll, describe, it, expect, beforeEach } from "vitest";
import ProblemRepository from "repositories/problem_repository";
import TaskRepository from "repositories/task_repository";
import LectureRepository from "repositories/lecture_repository";
import SemesterRepository from "repositories/semester_repository";
import { LECTURE, SEMESTER, TASK, PROBLEM } from "__tests__/mock";

const prisma = new PrismaClient();

beforeAll(async () => {
	await prisma.$connect();
});

afterAll(async () => {
	await prisma.$disconnect();
});

describe("ProblemRepository", () => {
	beforeEach(async () => {
		// 각 테스트 전에 데이터베이스 초기화
		await ProblemRepository.reset();
		await TaskRepository.reset();
		await LectureRepository.reset();
		await SemesterRepository.reset();
	});

	const { id, semesterId, ...lectureData } = LECTURE[0];
	const { id: tid, lectureId, ...taskData } = TASK[0];
	const { id: pid, taskId: tid2, ...problemData } = PROBLEM[0];

	it("creates problem", async () => {
		const semester = await SemesterRepository.createSemester(SEMESTER[0]);
		const lecture = await LectureRepository.createLecture(
			semester.id,
			lectureData,
		);
		const task = await TaskRepository.createTask(lecture.id, taskData);

		const problem = await ProblemRepository.createProblem(task.id, problemData);

		expect(problem).toMatchObject({
			bojProblemNumber: PROBLEM[0].bojProblemNumber,
			essential: PROBLEM[0].essential,
		});
	});

	it("creates many problems", async () => {
		const semester = await SemesterRepository.createSemester(SEMESTER[0]);
		const lecture = await LectureRepository.createLecture(
			semester.id,
			lectureData,
		);
		const task = await TaskRepository.createTask(lecture.id, taskData);

		const problemsToCreate = PROBLEM.map((problem) => ({
			bojProblemNumber: problem.bojProblemNumber,
			essential: problem.essential,
			taskId: task.id,
		}));

		const problems = await ProblemRepository.createProblems(problemsToCreate);

		expect(problems.length).toBe(PROBLEM.length);
	});

	it("finds problem by BOJ problem number", async () => {
		const semester = await SemesterRepository.createSemester(SEMESTER[0]);
		const lecture = await LectureRepository.createLecture(
			semester.id,
			lectureData,
		);
		const task = await TaskRepository.createTask(lecture.id, taskData);

		await ProblemRepository.createProblem(task.id, problemData);

		const foundProblem = await ProblemRepository.findProblemByBojProblemNumber(
			task.id,
			PROBLEM[0].bojProblemNumber,
		);
		expect(foundProblem).toMatchObject({
			bojProblemNumber: PROBLEM[0].bojProblemNumber,
			essential: PROBLEM[0].essential,
		});
	});

	it("updates problem", async () => {
		const semester = await SemesterRepository.createSemester(SEMESTER[0]);
		const lecture = await LectureRepository.createLecture(
			semester.id,
			lectureData,
		);
		const task = await TaskRepository.createTask(lecture.id, taskData);

		const problem = await ProblemRepository.createProblem(task.id, problemData);

		const updatedProblem = await ProblemRepository.updateProblem(problem.id, {
			essential: !problem.essential,
		});

		expect(updatedProblem).toMatchObject({
			bojProblemNumber: PROBLEM[0].bojProblemNumber,
			essential: !PROBLEM[0].essential,
		});
	});

	it("deletes problem", async () => {
		const semester = await SemesterRepository.createSemester(SEMESTER[0]);
		const lecture = await LectureRepository.createLecture(
			semester.id,
			lectureData,
		);
		const task = await TaskRepository.createTask(lecture.id, taskData);

		const problem = await ProblemRepository.createProblem(task.id, problemData);

		await ProblemRepository.deleteProblem(problem.id);

		const deletedProblem = await ProblemRepository.findProblemById(problem.id);
		expect(deletedProblem).toBeNull();
	});

	it("deletes problems by task id", async () => {
		const semester = await SemesterRepository.createSemester(SEMESTER[0]);
		const lecture = await LectureRepository.createLecture(
			semester.id,
			lectureData,
		);
		const task = await TaskRepository.createTask(lecture.id, taskData);

		await ProblemRepository.createProblems(
			PROBLEM.map((problem) => ({
				bojProblemNumber: problem.bojProblemNumber,
				essential: problem.essential,
				taskId: task.id,
			})),
		);

		await ProblemRepository.deleteProblemsByTaskId(task.id);

		const problems = await ProblemRepository.findProblemsByTaskId(task.id);
		expect(problems.length).toBe(0);
	});

	it("retrieves all problems", async () => {
		const semester = await SemesterRepository.createSemester(SEMESTER[0]);
		const lecture = await LectureRepository.createLecture(
			semester.id,
			lectureData,
		);
		const task = await TaskRepository.createTask(lecture.id, taskData);

		await ProblemRepository.createProblems(
			PROBLEM.map((problem) => ({
				bojProblemNumber: problem.bojProblemNumber,
				essential: problem.essential,
				taskId: task.id,
			})),
		);

		const allProblems = await ProblemRepository.allProblems();
		expect(allProblems.length).toBe(PROBLEM.length);
		expect(allProblems[0]).toHaveProperty("bojProblemNumber");
		expect(allProblems[1]).toHaveProperty("bojProblemNumber");
	});

	it("finds problems by task id", async () => {
		const semester = await SemesterRepository.createSemester(SEMESTER[0]);
		const lecture = await LectureRepository.createLecture(
			semester.id,
			lectureData,
		);
		const task = await TaskRepository.createTask(lecture.id, taskData);

		await ProblemRepository.createProblems(
			PROBLEM.map((problem) => ({
				bojProblemNumber: problem.bojProblemNumber,
				essential: problem.essential,
				taskId: task.id,
			})),
		);

		const problemsInTask = await ProblemRepository.findProblemsByTaskId(
			task.id,
		);

		expect(problemsInTask.length).toBe(PROBLEM.length);
	});
});
