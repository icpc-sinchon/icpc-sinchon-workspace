import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { Prisma, Season } from "@prisma/client";
import { SemesterEntity } from "./entities/semester.entity";

@Injectable()
export class SemesterRepository {
  constructor(private prisma: PrismaService) {}

  async createSemester(
    data: Prisma.SemesterCreateInput,
  ): Promise<SemesterEntity> {
    return this.prisma.semester.create({ data });
  }

  async getAllSemesters(): Promise<SemesterEntity[]> {
    return this.prisma.semester.findMany();
  }

  async getSemesterById(id: number): Promise<SemesterEntity> {
    return this.prisma.semester.findUnique({ where: { id } });
  }

  async getSemesterByYearAndSeason(
    year: number,
    season: Season,
  ): Promise<SemesterEntity> {
    return this.prisma.semester.findUnique({
      where: {
        year_season: {
          year,
          season,
        },
      },
    });
  }

  async updateSemester(
    id: number,
    data: Prisma.SemesterUpdateInput,
  ): Promise<SemesterEntity> {
    return this.prisma.semester.update({ where: { id }, data });
  }

  async deleteSemester(id: number): Promise<SemesterEntity> {
    return this.prisma.semester.delete({ where: { id } });
  }

  async resetSemester(): Promise<void> {
    await this.prisma.semester.deleteMany();
  }
}
