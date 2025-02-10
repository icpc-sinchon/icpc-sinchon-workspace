import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { Prisma } from "@prisma/client";
import { StudentEntity } from "./entities/student.entity";

@Injectable()
export class StudentRepository {
  constructor(private prisma: PrismaService) {}

  async createStudent(data: Prisma.StudentCreateInput): Promise<StudentEntity> {
    return this.prisma.student.create({ data });
  }

  async getAllStudents(): Promise<StudentEntity[]> {
    return this.prisma.student.findMany();
  }

  async getStudentById(id: number): Promise<StudentEntity> {
    return this.prisma.student.findUnique({ where: { id } });
  }

  async getStudentByBojHandle(bojHandle: string): Promise<StudentEntity> {
    return this.prisma.student.findUnique({ where: { bojHandle } });
  }

  async updateStudent(
    id: number,
    data: Prisma.StudentUpdateInput,
  ): Promise<StudentEntity> {
    return this.prisma.student.update({ where: { id }, data });
  }

  async deleteStudent(id: number): Promise<StudentEntity> {
    return this.prisma.student.delete({ where: { id } });
  }

  async resetStudent(): Promise<void> {
    await this.prisma.student.deleteMany();
  }
}
