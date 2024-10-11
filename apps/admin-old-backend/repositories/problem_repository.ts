import BaseRepository from "./base_repository";
import TaskRepository from "./task_repository";
import type { Prisma, PrismaClient } from "@prisma/client";

export default class ProblemRepository extends BaseRepository {
	static instance: PrismaClient;

	// TODO: taskID를 통한 필터링은 service에서 처리하도록 변경?
	static async createProblem(
		taskId: number,
		problemData: Omit<Prisma.ProblemCreateInput, "task">,
	) {
		const { bojProblemNumber } = problemData;
		const problem = await ProblemRepository.findProblemByBojProblemNumber(
			taskId,
			bojProblemNumber,
		);

		if (!problem) {
			return ProblemRepository.instance.problem.create({
				data: {
					...problemData,
					task: { connect: { id: taskId } },
				},
			});
		}
		return problem;
	}

	static async createProblems(props: Prisma.ProblemCreateManyInput[]) {
		const promises = props.map((problem) => {
			const { taskId, ...data } = problem;
			return ProblemRepository.createProblem(taskId, data);
		});
		const results = await Promise.all(promises);
		return results;
	}

	static async updateProblem(id: number, props: Prisma.ProblemUpdateInput) {
		return ProblemRepository.instance.problem.update({
			where: { id },
			data: props,
		});
	}

	static async deleteProblemsByTaskId(taskId: number) {
		return ProblemRepository.instance.problem.deleteMany({
			where: { taskId },
		});
	}

	static async deleteProblem(problemId: number) {
		return ProblemRepository.instance.problem.delete({
			where: { id: problemId },
		});
	}

	static async findProblemById(id: number) {
		return ProblemRepository.instance.problem.findUnique({ where: { id } });
	}

	static async findProblemByBojProblemNumber(
		taskId: number,
		bojProblemNumber: number,
	) {
		return ProblemRepository.instance.problem.findFirst({
			where: { taskId, bojProblemNumber },
		});
	}

	static async findProblemsByTaskId(taskId: number) {
		return ProblemRepository.instance.problem.findMany({
			where: { taskId: taskId },
		});
	}

	static async allProblems() {
		return ProblemRepository.instance.problem.findMany();
	}

	static async reset() {
		return ProblemRepository.instance.problem.deleteMany();
	}
}
