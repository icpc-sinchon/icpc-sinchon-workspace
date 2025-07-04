import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { CreateProblemDto } from "./dto/create-problem.dto";
import { UpdateProblemDto } from "./dto/update-problem.dto";
import { ProblemEntity } from "./entities/problem.entity";
import { ProblemRepository } from "./problem.repository";
import { TaskRepository } from "../task/task.repository";

@Injectable()
export class ProblemService {
  constructor(
    private readonly problemRepository: ProblemRepository,
    private readonly taskRepository: TaskRepository,
  ) {}

  async createProblem(
    createProblemDto: CreateProblemDto,
  ): Promise<ProblemEntity> {
    const { taskId, ...problemData } = createProblemDto;

    if (!taskId) {
      throw new BadRequestException("Task ID is required");
    }

    try {
      const task = await this.taskRepository.getTaskById(taskId);
      if (!task) {
        throw new NotFoundException(`Task with ID ${taskId} not found`);
      }

      return await this.problemRepository.createProblem({
        ...problemData,
        task: { connect: { id: taskId } },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to create problem: ${error.message}`,
      );
    }
  }

  async getAllProblems(): Promise<ProblemEntity[]> {
    try {
      return await this.problemRepository.getAllProblems();
    } catch (error) {
      throw new BadRequestException(
        `Failed to retrieve all problems: ${error.message}`,
      );
    }
  }

  async getProblemById(id: number): Promise<ProblemEntity> {
    try {
      const problem = await this.problemRepository.getProblemById(id);
      if (!problem) {
        throw new NotFoundException(`Problem with ID ${id} not found`);
      }
      return problem;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to retrieve problem for id ${id}: ${error.message}`,
      );
    }
  }

  async getProblemsByTaskId(taskId: number): Promise<ProblemEntity[]> {
    try {
      const task = await this.taskRepository.getTaskById(taskId);
      if (!task) {
        throw new NotFoundException(`Task with ID ${taskId} not found`);
      }

      return await this.problemRepository.getProblemsByTaskId(taskId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to retrieve problems for task id ${taskId}: ${error.message}`,
      );
    }
  }

  async getProblemByBojProblemNumber(
    taskId: number,
    bojProblemNumber: number,
  ): Promise<ProblemEntity> {
    try {
      const problem =
        await this.problemRepository.getProblemByTaskIdAndBojProblemNumber(
          taskId,
          bojProblemNumber,
        );
      if (!problem) {
        throw new NotFoundException(
          `Problem not found for task id ${taskId} and BOJ problem number ${bojProblemNumber}`,
        );
      }
      return problem;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to retrieve problem for task id ${taskId} and BOJ problem number ${bojProblemNumber}: ${error.message}`,
      );
    }
  }

  async updateProblem(
    id: number,
    updateProblemDto: UpdateProblemDto,
  ): Promise<ProblemEntity> {
    try {
      const problem = await this.problemRepository.getProblemById(id);
      if (!problem) {
        throw new NotFoundException(`Problem with ID ${id} not found`);
      }
      return await this.problemRepository.updateProblem(id, updateProblemDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to update problem: ${error.message}`,
      );
    }
  }

  async deleteProblem(id: number): Promise<ProblemEntity> {
    try {
      if (!id || id <= 0) {
        throw new BadRequestException(`Invalid problem ID: ${id}`);
      }
      const problem = await this.problemRepository.getProblemById(id);
      if (!problem) {
        throw new NotFoundException(`Problem with ID ${id} not found`);
      }
      return await this.problemRepository.deleteProblem(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to delete problem: ${error.message}`,
      );
    }
  }
}
