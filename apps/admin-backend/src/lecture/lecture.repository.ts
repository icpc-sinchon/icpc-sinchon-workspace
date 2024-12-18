import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "@/prisma/prisma.service";
import { LectureEntity } from "./entities/lecture.entity";

@Injectable()
export class LectureRepository {
  constructor(private prisma: PrismaService) {}

  async createLecture(params: {
    data: Prisma.LectureCreateInput;
  }): Promise<LectureEntity> {
    const { data } = params;
    return this.prisma.lecture.create({ data });
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
