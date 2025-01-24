import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { TaskEntity } from "./entities/task.entity";
import { TaskRepository } from "./task.repository";
import { ProblemRepository } from "../problem/problem.repository";
import { LectureRepository } from "../lecture/lecture.repository";

@Injectable()
export class TaskService {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly problemRepository: ProblemRepository,
    private readonly lectureRepository: LectureRepository,
  ) {}

  async createTask(createTaskDto: CreateTaskDto): Promise<TaskEntity> {
    try {
      return await this.taskRepository.createTask({
        ...createTaskDto,
        lecture: { connect: { id: createTaskDto.lectureId } },
      });
    } catch (error) {
      throw new BadRequestException(`Failed to create task: ${error.message}`);
    }
  }

  async getAllTasks(): Promise<TaskEntity[]> {
    try {
      return await this.taskRepository.getAllTasks();
    } catch (error) {
      throw new BadRequestException(
        `Failed to retrieve all tasks: ${error.message}`,
      );
    }
  }

  async getTaskById(id: number): Promise<TaskEntity> {
    try {
      const task = await this.taskRepository.getTaskById(id);
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

  async getTasksByLectureId(lectureId: number): Promise<TaskEntity[]> {
    try {
      const lecture = await this.lectureRepository.getLectureById(lectureId);
      if (!lecture) {
        throw new NotFoundException(`Lecture with ID ${lectureId} not found`);
      }

      return await this.taskRepository.getTasksWithProblemsByLectureId(
        lectureId,
      );
    } catch (error) {
      throw new BadRequestException(
        `Failed to retrieve tasks: ${error.message}`,
      );
    }
  }

  async updateTask(
    id: number,
    updateTaskDto: UpdateTaskDto,
  ): Promise<TaskEntity> {
    const { minSolveCount, practiceId, problems } = updateTaskDto;

    try {
      const task = await this.taskRepository.getTaskById(id);
      if (!task) {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }

      const updatedTask = await this.taskRepository.updateTask(id, {
        minSolveCount,
        practiceId,
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
      throw new BadRequestException(`Failed to update task: ${error.message}`);
    }
  }

  async removeTask(id: number): Promise<TaskEntity> {
    try {
      const task = await this.taskRepository.getTaskById(id);
      if (!task) {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }
      return await this.taskRepository.deleteTask(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to delete task: ${error.message}`);
    }
  }
}
