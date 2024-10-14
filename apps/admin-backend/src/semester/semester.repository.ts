import { Injectable } from '@nestjs/common';
import { Prisma, Semester } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SemesterRepository {
  constructor(private prisma: PrismaService) {}

  async createSemester(params: { data: Prisma.SemesterCreateInput }): Promise<Semester> {
    const { data } = params;
    return this.prisma.semester.create({ data });
  }
}