import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import type { Prisma } from "@prisma/client";
import { Level } from "@prisma/client";
import { LectureEntity } from "./entities/lecture.entity";
import { TaskRepository } from "../task/task.repository";

@Injectable()
export class LectureRepository {
  constructor(
    private prisma: PrismaService,
    private readonly taskRepository: TaskRepository,
  ) {}

  async createLecture(params: {
    data: Prisma.LectureCreateInput;
  }): Promise<LectureEntity> {
    const { data } = params;
    return this.prisma.lecture.create({ data });
  }

  async createLectureWithTasks(params: {
    data: Prisma.LectureCreateInput;
  }): Promise<LectureEntity> {
    const { data } = params;
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

  async getLecture(params: {
    where: Prisma.LectureWhereUniqueInput;
  }): Promise<LectureEntity> {
    const { where } = params;
    return this.prisma.lecture.findUnique({ where });
  }

  async getLectures(params: {
    where: Prisma.LectureWhereInput;
  }): Promise<LectureEntity[]> {
    const { where } = params;
    return this.prisma.lecture.findMany({ where });
  }

  async getLecturesWithTasks(params: {
    where: Prisma.LectureWhereInput;
  }): Promise<LectureEntity[]> {
    const { where } = params;
    return this.prisma.lecture.findMany({
      where,
      include: {
        task: {
          include: { problems: true },
        },
      },
    });
  }

  async getLecturesBySemester(params: {
    where: { lectureSemester: Prisma.SemesterWhereInput };
  }): Promise<LectureEntity[]> {
    const { where } = params;
    return this.prisma.lecture.findMany({ where });
  }

  async getLectureBySemesterAndLevel(params: {
    semesterId: number;
    level: Level;
  }): Promise<LectureEntity> {
    const { semesterId, level } = params;
    return this.prisma.lecture.findUnique({
      where: {
        semesterId_level: {
          semesterId,
          level,
        },
      },
    });
  }

  async getLecturesWithTasksBySemester(params: {
    where: { lectureSemester: Prisma.SemesterWhereInput };
  }): Promise<LectureEntity[]> {
    const { where } = params;
    return this.prisma.lecture.findMany({
      where,
      include: {
        task: {
          include: { problems: true },
        },
      },
    });
  }

  async updateLecture(params: {
    where: Prisma.LectureWhereUniqueInput;
    data: Prisma.LectureUpdateInput;
  }): Promise<LectureEntity> {
    const { where, data } = params;
    return this.prisma.lecture.update({ where, data });
  }

  async deleteLecture(params: {
    where: Prisma.LectureWhereUniqueInput;
  }): Promise<LectureEntity> {
    const { where } = params;
    return this.prisma.lecture.delete({ where });
  }

  async resetLecture(): Promise<void> {
    await this.prisma.lecture.deleteMany();
  }
}
