import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { Prisma } from "@prisma/client";
import { StudentLectureLogEntity } from "./entities/student-lecture-log.entity";

@Injectable()
export class StudentLectureLogRepository {
  constructor(private prisma: PrismaService) {}

  async createStudentLectureLog(params: {
    data: Prisma.StudentLectureLogCreateInput;
  }): Promise<StudentLectureLogEntity> {
    const { data } = params;
    return this.prisma.studentLectureLog.create({ data });
  }

  async getAllStudentLectureLogs(): Promise<StudentLectureLogEntity[]> {
    return this.prisma.studentLectureLog.findMany();
  }

  async getStudentLectureLog(params: {
    where: Prisma.StudentLectureLogWhereUniqueInput;
  }): Promise<StudentLectureLogEntity> {
    const { where } = params;
    return this.prisma.studentLectureLog.findUnique({ where });
  }

  async getStudentLectureLogs(params: {
    where: Prisma.StudentLectureLogWhereInput;
  }): Promise<StudentLectureLogEntity[]> {
    const { where } = params;
    return this.prisma.studentLectureLog.findMany({ where });
  }

  async updateStudentLectureLog(params: {
    where: Prisma.StudentLectureLogWhereUniqueInput;
    data: Prisma.StudentLectureLogUpdateInput;
  }): Promise<StudentLectureLogEntity> {
    const { where, data } = params;
    return this.prisma.studentLectureLog.update({ where, data });
  }

  async deleteStudentLectureLog(params: {
    where: Prisma.StudentLectureLogWhereUniqueInput;
  }): Promise<StudentLectureLogEntity> {
    const { where } = params;
    return this.prisma.studentLectureLog.delete({ where });
  }

  async resetStudentLectureLog(): Promise<void> {
    await this.prisma.studentLectureLog.deleteMany();
  }
}
