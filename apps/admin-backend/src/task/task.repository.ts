import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { Prisma } from "@prisma/client";
import { TaskEntity } from "./entities/task.entity";

@Injectable()
export class TaskRepository {
  constructor(private prisma: PrismaService) {}

  async createTask(params: {
    data: Prisma.TaskCreateInput;
  }): Promise<TaskEntity> {
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

  async getAllTasks(): Promise<TaskEntity[]> {
    return this.prisma.task.findMany();
  }

  async getTask(params: {
    where: Prisma.TaskWhereUniqueInput;
  }): Promise<TaskEntity> {
    const { where } = params;
    return this.prisma.task.findUnique({ where });
  }

  async getTasks(params: {
    where: Prisma.TaskWhereInput;
  }): Promise<TaskEntity[]> {
    const { where } = params;
    return this.prisma.task.findMany({ where });
  }

  async getTasksWithProblems(params: {
    where: Prisma.TaskWhereInput;
  }): Promise<TaskEntity[]> {
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
  }): Promise<TaskEntity> {
    const { where, data } = params;
    return this.prisma.task.update({ where, data });
  }

  async deleteTask(params: {
    where: Prisma.TaskWhereUniqueInput;
  }): Promise<TaskEntity> {
    const { where } = params;
    return this.prisma.task.delete({ where });
  }

  async resetTask(): Promise<void> {
    await this.prisma.task.deleteMany();
  }
}
