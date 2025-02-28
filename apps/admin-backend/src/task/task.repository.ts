import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { Prisma } from "@prisma/client";
import { TaskEntity } from "./entities/task.entity";

@Injectable()
export class TaskRepository {
  constructor(private prisma: PrismaService) {}

  async createTask(data: Prisma.TaskCreateInput): Promise<TaskEntity> {
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

  async getTaskById(id: number): Promise<TaskEntity> {
    return this.prisma.task.findUnique({ where: { id } });
  }

  async getTaskWithProblemsById(id: number) {
    return this.prisma.task.findUnique({
      where: { id },
      include: { problems: true },
    });
  }

  async getTasksByLectureId(lectureId: number): Promise<TaskEntity[]> {
    return this.prisma.task.findMany({ where: { lectureId } });
  }

  async getTasksWithProblemsByLectureId(
    lectureId: number
  ): Promise<TaskEntity[]> {
    return this.prisma.task.findMany({
      where: { lectureId },
      include: { problems: true },
    });
  }

  async updateTask(
    id: number,
    data: Prisma.TaskUpdateInput
  ): Promise<TaskEntity> {
    return this.prisma.task.update({ where: { id }, data });
  }

  async deleteTask(id: number): Promise<TaskEntity> {
    return this.prisma.task.delete({ where: { id } });
  }

  async resetTask(): Promise<void> {
    await this.prisma.task.deleteMany();
  }
}
