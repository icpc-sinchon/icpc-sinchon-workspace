import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskRepository } from "./task.repository";
import { ProblemRepository } from "../problem/problem.repository";
import type { Prisma } from "@prisma/client";
import { TaskEntity } from "./entities/task.entity";

@Injectable()
export class TaskService {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly problemRepository: ProblemRepository,
  ) {}

  async createTask(createTaskDto: CreateTaskDto): Promise<TaskEntity> {
    try {
      return await this.taskRepository.createTask({
        data: {
          ...createTaskDto,
          lecture: { connect: { id: createTaskDto.lectureId } },
        },
      });
    } catch (error) {
      throw new BadRequestException(`Task creation failed: ${error.message}`);
    }
  }

  async findTaskById(id: number): Promise<TaskEntity> {
    try {
      const task = await this.taskRepository.getTask({ where: { id } });
      if (!task) {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }
      return task;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to retrieve task: ${error.message}`,
      );
    }
  }

  async findTasksByLectureId(lectureId: number): Promise<TaskEntity[]> {
    try {
      return await this.taskRepository.getTasksWithProblems({
        where: { lectureId },
      });
    } catch (error) {
      throw new BadRequestException(
        `Failed to retrieve tasks: ${error.message}`,
      );
    }
  }

  async updateTask(
    id: number,
    updateData: {
      minSolveCount: number;
      practiceId: number;
      problems: Prisma.ProblemCreateManyInput[];
    },
  ): Promise<TaskEntity> {
    const { minSolveCount, practiceId, problems } = updateData;

    try {
      const task = await this.taskRepository.getTasksWithProblems({
        where: { id },
      });
      if (!task) {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }

      const updatedTask = await this.taskRepository.updateTask({
        where: { id },
        data: { minSolveCount, practiceId },
      });

      await this.problemRepository.deleteProblemsByTaskId(id);

      const problemData = problems.map((problem) => ({
        ...problem,
        taskId: id,
      }));
      await this.problemRepository.createProblems(problemData);

      return updatedTask;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Task update failed: ${error.message}`);
    }
  }

  async getAllTasks(): Promise<TaskEntity[]> {
    try {
      return await this.taskRepository.getAllTasks();
    } catch (error) {
      throw new BadRequestException(
        `Failed to retrieve tasks: ${error.message}`,
      );
    }
  }

  async removeTask(id: number): Promise<TaskEntity> {
    try {
      const task = await this.findTaskById(id);
      return await this.taskRepository.deleteTask({ where: { id: task.id } });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Task deletion failed: ${error.message}`);
    }
  }
}
