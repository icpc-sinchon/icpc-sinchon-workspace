import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { Prisma, Semester } from "@prisma/client";
import { SemesterEntity } from "./entities/semester.entity";

@Injectable()
export class SemesterRepository {
  constructor(private prisma: PrismaService) {}

  async createSemester(params: {
    data: Prisma.SemesterCreateInput;
  }): Promise<SemesterEntity> {
    const { data } = params;
    return this.prisma.semester.create({ data });
  }

  async getAllSemesters(): Promise<SemesterEntity[]> {
    return this.prisma.semester.findMany();
  }

  async getSemester(params: {
    where: Prisma.SemesterWhereUniqueInput;
  }): Promise<SemesterEntity> {
    const { where } = params;
    return this.prisma.semester.findUnique({ where });
  }

  async getSemesters(params: {
    where: Prisma.SemesterWhereInput;
  }): Promise<SemesterEntity[]> {
    const { where } = params;
    return this.prisma.semester.findMany({ where });
  }

  async updateSemester(params: {
    where: Prisma.SemesterWhereUniqueInput;
    data: Prisma.SemesterUpdateInput;
  }): Promise<SemesterEntity> {
    const { where, data } = params;
    return this.prisma.semester.update({ where, data });
  }

  async deleteSemester(params: {
    where: Prisma.SemesterWhereUniqueInput;
  }): Promise<SemesterEntity> {
    const { where } = params;
    return this.prisma.semester.delete({ where });
  }

  async resetSemester(): Promise<void> {
    await this.prisma.semester.deleteMany();
  }
}
