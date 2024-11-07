import { Injectable } from '@nestjs/common';
import type { Prisma, Semester } from '@prisma/client';
import type { PrismaService } from 'src/prisma/prisma.service';
import type { CreateSemesterDto } from './dto/create-semester.dto';

@Injectable()
export class SemesterRepository {
  constructor(private prisma: PrismaService) {}

  async createSemester(
    createSemesterDto: CreateSemesterDto
  ): Promise<Semester> {
    return this.prisma.semester.create({
      data: createSemesterDto,
    });
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