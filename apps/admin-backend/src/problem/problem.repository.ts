import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { Prisma } from "@prisma/client";
import { ProblemEntity } from "./entities/problem.entity";

@Injectable()
export class ProblemRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createProblem(params: {
    data: Prisma.ProblemCreateInput;
  }): Promise<ProblemEntity> {
    const { data } = params;
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

  async getProblem(params: {
    where: Prisma.ProblemWhereUniqueInput;
  }): Promise<ProblemEntity> {
    const { where } = params;
    return this.prisma.problem.findUnique({ where });
  }

  async getProblems(params: {
    where: Prisma.ProblemWhereInput;
  }): Promise<ProblemEntity[]> {
    const { where } = params;
    return this.prisma.problem.findMany({ where });
  }

  async updateProblem(params: {
    where: Prisma.ProblemWhereUniqueInput;
    data: Prisma.ProblemUpdateInput;
  }): Promise<ProblemEntity> {
    const { where, data } = params;
    return this.prisma.problem.update({ where, data });
  }

  async deleteProblem(params: {
    where: Prisma.ProblemWhereUniqueInput;
  }): Promise<ProblemEntity> {
    const { where } = params;
    return this.prisma.problem.delete({ where });
  }

  async deleteProblemsByTaskId(taskId: number): Promise<void> {
    await this.prisma.problem.deleteMany({ where: { taskId } });
  }

  async resetProblems(): Promise<void> {
    await this.prisma.problem.deleteMany();
  }
}
