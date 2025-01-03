import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { ProblemRepository } from "./problem.repository";
import { CreateProblemDto } from "./dto/create-problem.dto";
import { UpdateProblemDto } from "./dto/update-problem.dto";
import type { Problem } from "@prisma/client";

@Injectable()
export class ProblemService {
  constructor(private readonly problemRepository: ProblemRepository) {}

  async createProblem(createProblemDto: CreateProblemDto): Promise<Problem> {
    try {
      return await this.problemRepository.createProblem({
        data: {
          ...createProblemDto,
          task: { connect: { id: createProblemDto.taskId } }, // 관계 설정
        },
      });
    } catch (error) {
      throw new BadRequestException(
        `Problem creation failed: ${error.message}`,
      );
    }
  }

  async findProblemById(id: number): Promise<Problem> {
    try {
      const problem = await this.problemRepository.getProblem({
        where: { id },
      });
      if (!problem) {
        throw new NotFoundException(`Problem with ID ${id} not found`);
      }
      return problem;
    } catch (error) {
      throw new BadRequestException(
        `Failed to retrieve problem: ${error.message}`,
      );
    }
  }

  async findProblemByBojProblemNumber(
    taskId: number,
    bojProblemNumber: number,
  ): Promise<Problem | null> {
    try {
      const problems = await this.problemRepository.getProblems({
        where: { taskId, bojProblemNumber },
      });
      return problems.length > 0 ? problems[0] : null;
    } catch (error) {
      throw new BadRequestException(
        `Failed to find problem with BOJ problem number ${bojProblemNumber}: ${error.message}`,
      );
    }
  }

  async findProblemsByTaskId(taskId: number): Promise<Problem[]> {
    try {
      return await this.problemRepository.getProblems({ where: { taskId } });
    } catch (error) {
      throw new BadRequestException(
        `Failed to retrieve problems: ${error.message}`,
      );
    }
  }

  async updateProblem(
    id: number,
    updateProblemDto: UpdateProblemDto,
  ): Promise<Problem> {
    try {
      await this.findProblemById(id); // Ensure the problem exists
      return await this.problemRepository.updateProblem({
        where: { id },
        data: updateProblemDto,
      });
    } catch (error) {
      throw new BadRequestException(`Problem update failed: ${error.message}`);
    }
  }

  async getAllProblems(): Promise<Problem[]> {
    try {
      return await this.problemRepository.getAllProblems();
    } catch (error) {
      throw new BadRequestException(
        `Failed to retrieve problems: ${error.message}`,
      );
    }
  }

  async removeProblem(id: number): Promise<Problem> {
    try {
      await this.findProblemById(id); // Ensure the problem exists
      return await this.problemRepository.deleteProblem({ where: { id } });
    } catch (error) {
      throw new BadRequestException(
        `Problem deletion failed: ${error.message}`,
      );
    }
  }
}
