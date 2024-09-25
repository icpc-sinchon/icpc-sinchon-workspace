import type { Request, Response } from "express";
import TaskRepository from "repositories/task_repository";
import type { Prisma } from "@prisma/client";
import ProblemRepository from "repositories/problem_repository";
import type { EmptyObject } from "types";

class TaskController {
	private static instance: TaskController;

	private constructor() {}

	public static getInstance(): TaskController {
		if (!TaskController.instance) {
			TaskController.instance = new TaskController();
		}
		return TaskController.instance;
	}

	public async getAllTasks(req: Request, res: Response): Promise<void> {
		try {
			const tasks = await TaskRepository.allTasks();
			console.log(tasks);
			res.json(tasks);
		} catch (err) {
			console.error(err);
			res
				.status(500)
				.send(err instanceof Error ? err.message : "Unknown error");
		}
	}

	public async getTaskById(
		req: Request<{ taskId: string }>,
		res: Response,
	): Promise<void> {
		const taskId = Number.parseInt(req.params.taskId);
		try {
			const task = await TaskRepository.findTaskWithProblemsById(taskId);
			res.json(task);
		} catch (err) {
			console.error(err);
			res
				.status(500)
				.send(err instanceof Error ? err.message : "Unknown error");
		}
	}

	public async createTask(
		req: Request<EmptyObject, EmptyObject, Prisma.TaskCreateManyInput>,
		res: Response,
	): Promise<void> {
		try {
			const task = req.body;
			const { lectureId, ...taskData } = task;
			console.log(task);
			await TaskRepository.createTask(lectureId, taskData);
			res.status(200).send("add success");
		} catch (err) {
			console.error(err);
			res
				.status(500)
				.send(err instanceof Error ? err.message : "Unknown error");
		}
	}

	public async createMultipleTasks(
		req: Request<EmptyObject, EmptyObject, Prisma.TaskCreateManyInput[]>,
		res: Response,
	): Promise<void> {
		try {
			const tasks = req.body;
			console.log(tasks);
			await TaskRepository.createTasks(tasks);
			res.status(200).send("add success");
		} catch (err) {
			console.error(err);
			res
				.status(500)
				.send(err instanceof Error ? err.message : "Unknown error");
		}
	}

	public async updateTask(
		req: Request<
			{ taskId: string },
			EmptyObject,
			{
				minSolveCount: number;
				practiceId: number;
				problems: Prisma.ProblemCreateManyInput[];
			}
		>,
		res: Response,
	): Promise<void> {
		const taskId = Number.parseInt(req.params.taskId);
		const { minSolveCount, practiceId, problems } = req.body;
		try {
			const task = await TaskRepository.findTaskWithProblemsById(taskId);

			if (!task) {
				res.status(404).send("task not found");
				return;
			}

			await TaskRepository.updateTask(taskId, {
				minSolveCount,
				practiceId,
			});

			await ProblemRepository.deleteProblemsByTaskId(taskId);
			await ProblemRepository.createProblems(problems);

			res.status(200).send(`update task ${taskId} success`);
		} catch (err) {
			console.error(err);
			res
				.status(500)
				.send(err instanceof Error ? err.message : "Unknown error");
		}
	}

	public async deleteTask(
		req: Request<{ taskId: string }>,
		res: Response,
	): Promise<void> {
		try {
			const taskId = Number.parseInt(req.params.taskId);
			await TaskRepository.deleteTask(taskId);
			res.status(200).send(`delete task ${taskId} success`);
		} catch (err) {
			console.error(err);
			res
				.status(500)
				.send(err instanceof Error ? err.message : "Unknown error");
		}
	}
}

export default TaskController;
