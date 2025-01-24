import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { Prisma } from "@prisma/client";
import { ProblemEntity } from "./entities/problem.entity";

@Injectable()
export class ProblemRepository {
  constructor(private prisma: PrismaService) {}

  async createProblem(data: Prisma.ProblemCreateInput): Promise<ProblemEntity> {
    return this.prisma.problem.create({ data });
  }

  async createProblems(data: Prisma.ProblemCreateManyInput[]): Promise<number> {
    const result = await this.prisma.problem.createMany({
      data,
      skipDuplicates: true,
    });
    return result.count;
  }

  async getAllProblems(): Promise<ProblemEntity[]> {
    return this.prisma.problem.findMany();
  }

  async getProblemById(id: number): Promise<ProblemEntity> {
    return this.prisma.problem.findUnique({ where: { id } });
  }

  async getProblemsByTaskId(taskId: number): Promise<ProblemEntity[]> {
    return this.prisma.problem.findMany({ where: { taskId } });
  }

  async getProblemByTaskIdAndBojProblemNumber(
    taskId: number,
    bojProblemNumber: number,
  ): Promise<ProblemEntity> {
    return this.prisma.problem.findUnique({
      where: { taskId_bojProblemNumber: { taskId, bojProblemNumber } },
    });
  }

  async updateProblem(
    id: number,
    data: Prisma.ProblemUpdateInput,
  ): Promise<ProblemEntity> {
    return this.prisma.problem.update({ where: { id }, data });
  }

  async deleteProblem(id: number): Promise<ProblemEntity> {
    return this.prisma.problem.delete({ where: { id } });
  }

  async deleteProblemsByTaskId(taskId: number): Promise<void> {
    await this.prisma.problem.deleteMany({ where: { taskId } });
  }

  async resetProblems(): Promise<void> {
    await this.prisma.problem.deleteMany();
  }
}
