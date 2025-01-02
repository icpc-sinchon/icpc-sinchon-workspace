import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { Prisma, Task } from "@prisma/client";

@Injectable()
export class TaskRepository {
  constructor(private prisma: PrismaService) {}

  async createTask(params: { data: Prisma.TaskCreateInput }): Promise<Task> {
    const { data } = params;
    return this.prisma.task.create({ data });
  }

  async createTasks(data: Prisma.TaskCreateManyInput[]): Promise<number> {
    const result = await this.prisma.task.createMany({
      data,
      skipDuplicates: true,
    });
    return result.count;
  }

  async getAllTasks(): Promise<Task[]> {
    return this.prisma.task.findMany();
  }

  async getTask(params: { where: Prisma.TaskWhereUniqueInput }): Promise<Task> {
    const { where } = params;
    return this.prisma.task.findUnique({ where });
  }

  async getTasks(params: { where: Prisma.TaskWhereInput }): Promise<Task[]> {
    const { where } = params;
    return this.prisma.task.findMany({ where });
  }

  async getTasksWithProblems(params: {
    where: Prisma.TaskWhereInput;
  }): Promise<Task[]> {
    const { where } = params;
    return this.prisma.task.findMany({
      where,
      include: {
        problems: true,
      },
    });
  }

  async updateTask(params: {
    where: Prisma.TaskWhereUniqueInput;
    data: Prisma.TaskUpdateInput;
  }): Promise<Task> {
    const { where, data } = params;
    return this.prisma.task.update({ where, data });
  }

  async deleteTask(params: {
    where: Prisma.TaskWhereUniqueInput;
  }): Promise<Task> {
    const { where } = params;
    return this.prisma.task.delete({ where });
  }
}
