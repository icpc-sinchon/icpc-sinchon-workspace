import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { Prisma } from "@prisma/client";
import { StudentLectureLogEntity } from "./entities/student-lecture-log.entity";

@Injectable()
export class StudentLectureLogRepository {
  constructor(private prisma: PrismaService) {}

  async createStudentLectureLog(
    data: Prisma.StudentLectureLogCreateInput,
  ): Promise<StudentLectureLogEntity> {
    return this.prisma.studentLectureLog.create({ data });
  }

  async getAllStudentLectureLogs(): Promise<StudentLectureLogEntity[]> {
    return this.prisma.studentLectureLog.findMany();
  }

  async getStudentLectureLogById(id: number): Promise<StudentLectureLogEntity> {
    return this.prisma.studentLectureLog.findUnique({ where: { id } });
  }

  async getStudentLectureLogByLectureId(
    studentId: number,
    lectureId: number,
  ): Promise<StudentLectureLogEntity> {
    return this.prisma.studentLectureLog.findUnique({
      where: { studentId_lectureId: { studentId, lectureId } },
    });
  }

  async updateStudentLectureLog(
    id: number,
    data: Prisma.StudentLectureLogUpdateInput,
  ): Promise<StudentLectureLogEntity> {
    return this.prisma.studentLectureLog.update({ where: { id }, data });
  }

  async deleteStudentLectureLog(id: number): Promise<StudentLectureLogEntity> {
    return this.prisma.studentLectureLog.delete({ where: { id } });
  }

  async resetStudentLectureLog(): Promise<void> {
    await this.prisma.studentLectureLog.deleteMany();
  }
}
