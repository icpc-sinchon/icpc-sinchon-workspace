import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import type { Prisma, Level } from "@prisma/client";
import { LectureEntity } from "./entities/lecture.entity";
import { TaskRepository } from "../task/task.repository";

@Injectable()
export class LectureRepository {
  constructor(
    private prisma: PrismaService,
    private readonly taskRepository: TaskRepository,
  ) {}

  async createLecture(data: Prisma.LectureCreateInput): Promise<LectureEntity> {
    return this.prisma.lecture.create({ data });
  }

  async createLectureWithTasks(
    data: Prisma.LectureCreateInput,
  ): Promise<LectureEntity> {
    const newLecture = await this.prisma.lecture.create({ data });

    const tasks = Array.from({ length: newLecture.lectureNumber }, (_, i) => ({
      lectureId: newLecture.id,
      round: i + 1,
      practiceId: 0,
      minSolveCount: 0,
    }));

    await this.taskRepository.createTasks(tasks);

    return newLecture;
  }

  async getAllLectures(): Promise<LectureEntity[]> {
    return this.prisma.lecture.findMany();
  }

  async getLectureById(id: number): Promise<LectureEntity> {
    return this.prisma.lecture.findUnique({ where: { id } });
  }

  async getLecturesBySemester(semesterId: number): Promise<LectureEntity[]> {
    return this.prisma.lecture.findMany({
      where: {
        semesterId,
      },
    });
  }

  async getLectureBySemesterAndLevel(
    semesterId: number,
    level: Level,
  ): Promise<LectureEntity | null> {
    return this.prisma.lecture.findUnique({
      where: {
        semesterId_level: {
          semesterId,
          level,
        },
      },
    });
  }

  async getLecturesWithTasksBySemester(
    semesterId: number,
  ): Promise<LectureEntity[]> {
    return this.prisma.lecture.findMany({
      where: {
        semesterId,
      },
      include: {
        task: {
          include: { problems: true },
        },
      },
    });
  }

  async updateLecture(
    id: number,
    data: Prisma.LectureUpdateInput,
  ): Promise<LectureEntity> {
    return this.prisma.lecture.update({ where: { id }, data });
  }

  async deleteLecture(id: number): Promise<LectureEntity> {
    return this.prisma.lecture.delete({ where: { id } });
  }

  async resetLecture(): Promise<void> {
    await this.prisma.lecture.deleteMany();
  }
}
