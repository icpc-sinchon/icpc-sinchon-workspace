import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { TaskRepository } from "./task.repository";
import { ProblemRepository } from "../problem/problem.repository";
import type { Prisma, Task } from "@prisma/client";

@Injectable()
export class TaskService {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly problemRepository: ProblemRepository,
  ) {}

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
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

  async findTaskById(id: number): Promise<Task> {
    try {
      const task = await this.taskRepository.getTask({ where: { id } });
      if (!task) {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }
      return task;
    } catch (error) {
      throw new BadRequestException(`Failed to retrieve task: ${error.message}`);
    }
  }

  async findTasksByLectureId(lectureId: number): Promise<Task[]> {
    try {
      return await this.taskRepository.getTasksWithProblems({ where: { lectureId } });
    } catch (error) {
      throw new BadRequestException(`Failed to retrieve tasks: ${error.message}`);
    }
  }

  async updateTask(
    id: number,
    updateData: {
      minSolveCount: number;
      practiceId: number;
      problems: Prisma.ProblemCreateManyInput[];
    },
  ): Promise<Task> {
    const { minSolveCount, practiceId, problems } = updateData;

    try {
      // Find the task with its associated problems
      const task = await this.taskRepository.getTasksWithProblems({
        where: { id },
      });
      if (!task) {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }

      // Update the task's details
      const updatedTask = await this.taskRepository.updateTask({
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

      return updatedTask;
    } catch (error) {
      throw new BadRequestException(`Task update failed: ${error.message}`);
    }
  }

  async getAllTasks(): Promise<Task[]> {
    try {
      return await this.taskRepository.getAllTasks();
    } catch (error) {
      throw new BadRequestException(`Failed to retrieve tasks: ${error.message}`);
    }
  }

  async removeTask(id: number): Promise<Task> {
    try {
      const task = await this.findTaskById(id);
      return await this.taskRepository.deleteTask({ where: { id: task.id } });
    } catch (error) {
      throw new BadRequestException(`Task deletion failed: ${error.message}`);
    }
  }
}
