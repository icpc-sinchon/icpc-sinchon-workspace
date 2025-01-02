import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { TaskRepository } from "./task.repository";
import { ProblemRepository } from "../problem/problem.repository";
import type { Prisma } from "@prisma/client";

@Injectable()
export class TaskService {
  constructor(
    private taskRepository: TaskRepository,
    private problemRepository: ProblemRepository,
  ) {}

  createTask(createTaskDto: CreateTaskDto) {
    return this.taskRepository.createTask({
      data: {
        ...createTaskDto,
        lecture: { connect: { id: createTaskDto.lectureId } },
      },
    });
  }

  findTaskById(id: number) {
    return this.taskRepository.getTask({ where: { id } });
  }

  findTasksByLecture(lectureId: number) {
    return this.taskRepository.getTasks({ where: { lectureId } });
  }

  async updateTask(
    id: number,
    updateData: {
      minSolveCount: number;
      practiceId: number;
      problems: Prisma.ProblemCreateManyInput[];
    },
  ) {
    const { minSolveCount, practiceId, problems } = updateData;

    // Find the task with its associated problems
    const task = await this.taskRepository.getTasksWithProblems({
      where: { id },
    });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    // Update the task's details
    await this.taskRepository.updateTask({
      where: { id },
      data: { minSolveCount, practiceId },
    });

    // Delete existing problems associated with the task
    await this.problemRepository.deleteProblemsByTaskId(id);

    // Recreate the new problems
    const problemData = problems.map((problem) => ({
      ...problem,
      taskId: id,
    }));
    await this.problemRepository.createProblems({ data: problemData });
  }

  getAllTasks() {
    return this.taskRepository.getAllTasks();
  }

  removeTask(id: number) {
    return this.taskRepository.deleteTask({ where: { id } });
  }
}
