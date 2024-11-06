import { Injectable } from '@nestjs/common';
import type { Prisma, Semester } from "@prisma/client";
import type { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class SemesterRepository {
  constructor(private prisma: PrismaService) {}

  async createSemester(params: {
    data: Prisma.SemesterCreateInput;
  }): Promise<Semester> {
    const { data } = params;
    return this.prisma.semester.create({ data });
  }

  async getSemesters(): Promise<Semester[]> {
    return this.prisma.semester.findMany();
  }

  async getSemester(params: {
    where: Prisma.SemesterWhereUniqueInput;
  }): Promise<Semester> {
    const { where } = params;
    return this.prisma.semester.findUnique({ where });
  }

  async updateSemester(params: {
    where: Prisma.SemesterWhereUniqueInput;
    data: Prisma.SemesterUpdateInput;
  }): Promise<Semester> {
    const { where, data } = params;
    return this.prisma.semester.update({ where, data });
  }

  async deleteSemester(params: {
    where: Prisma.SemesterWhereUniqueInput;
  }): Promise<Semester> {
    const { where } = params;
    return this.prisma.semester.delete({ where });
  }
}