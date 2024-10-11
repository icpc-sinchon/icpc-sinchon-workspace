import type { Prisma, PrismaClient } from "@prisma/client";
import BaseRepository from "./base_repository";

export default class TaskRepository extends BaseRepository {
	static instance: PrismaClient;
	/**
	 * Creates a new task
	 */
	static async createTask(
		lectureId: number,
		taskData: Omit<Prisma.TaskCreateInput, "lecture">,
	) {
		const task = await TaskRepository.instance.task.findFirst({
			where: { lectureId: lectureId, round: taskData.round },
		});
		if (!task) {
			return TaskRepository.instance.task.create({
				data: {
					...taskData,
					lecture: { connect: { id: lectureId } },
				},
			});
		}
		return task;
	}

	/**
	 * Creates new tasks
	 *
	 * @param {Object[]} props
	 * @returns {Promise<Task[]>}
	 */
	static async createTasks(props: Prisma.TaskCreateManyInput[]) {
		return TaskRepository.instance.task.createMany({
			data: props,
			skipDuplicates: true,
		});
	}

	/**
	 * Updates a task by id
	 *
	 * @param {number} id
	 * @param {Object} props
	 * @returns {Promise<Task>}
	 */
	static async updateTask(id: number, props: Prisma.TaskUpdateInput) {
		return TaskRepository.instance.task.update({
			where: { id },
			data: props,
		});
	}

	/**
	 * Deletes a task by id
	 *
	 * @param {number} id
	 * @returns {Promise<Task>}
	 */
	static async deleteTask(id: number) {
		return TaskRepository.instance.task.delete({
			where: { id },
		});
	}

	/**
	 * Finds a task by id
	 *
	 * @param {number} id
	 * @returns {Promise<Task>}
	 */
	static async findTaskWithProblemsById(id: number) {
		return TaskRepository.instance.task.findUnique({
			where: { id },
			include: { problems: true },
		});
	}

	static async findTaskByLectureId(lectureId: number) {
		return TaskRepository.instance.task.findMany({
			where: { lectureId },
		});
	}

	/**
	 * Find all tasks
	 *
	 * @returns {Promise<Array<Task>>}
	 */
	static async allTasks() {
		return TaskRepository.instance.task.findMany();
	}

	/**
	 * Resets the repository
	 *
	 * @returns {Promise<void>}
	 */
	static async reset() {
		return TaskRepository.instance.task.deleteMany();
	}
}
