import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { Prisma, Problem } from "@prisma/client";

@Injectable()
export class ProblemRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createProblem(params: {
    data: Prisma.ProblemCreateInput;
  }): Promise<Problem> {
    const { data } = params;
    return this.prisma.problem.create({ data });
  }

  async getAllProblems(): Promise<Problem[]> {
    return this.prisma.problem.findMany();
  }

  async getProblem(params: {
    where: Prisma.ProblemWhereUniqueInput;
  }): Promise<Problem | null> {
    const { where } = params;
    return this.prisma.problem.findUnique({ where });
  }

  async getProblems(params: { where: Prisma.ProblemWhereInput }): Promise<
    Problem[]
  > {
    const { where } = params;
    return this.prisma.problem.findMany({ where });
  }

  async updateProblem(params: {
    where: Prisma.ProblemWhereUniqueInput;
    data: Prisma.ProblemUpdateInput;
  }): Promise<Problem> {
    const { where, data } = params;
    return this.prisma.problem.update({ where, data });
  }

  async deleteProblem(params: {
    where: Prisma.ProblemWhereUniqueInput;
  }): Promise<Problem> {
    const { where } = params;
    return this.prisma.problem.delete({ where });
  }

  async resetProblems(): Promise<void> {
    await this.prisma.problem.deleteMany();
  }
}
