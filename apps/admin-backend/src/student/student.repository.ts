import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { Prisma } from "@prisma/client";
import { StudentEntity } from "./entities/student.entity";

@Injectable()
export class StudentRepository {
  constructor(private prisma: PrismaService) {}

  async createStudent(params: {
    data: Prisma.StudentCreateInput;
  }): Promise<StudentEntity> {
    const { data } = params;
    return this.prisma.student.create({ data });
  }

  async getAllStudents(): Promise<StudentEntity[]> {
    return this.prisma.student.findMany();
  }

  async getStudent(params: {
    where: Prisma.StudentWhereUniqueInput;
  }): Promise<StudentEntity> {
    const { where } = params;
    return this.prisma.student.findUnique({ where });
  }

  async getStudents(params: {
    where: Prisma.StudentWhereInput;
  }): Promise<StudentEntity[]> {
    const { where } = params;
    return this.prisma.student.findMany({ where });
  }

  async updateStudent(params: {
    where: Prisma.StudentWhereUniqueInput;
    data: Prisma.StudentUpdateInput;
  }): Promise<StudentEntity> {
    const { where, data } = params;
    return this.prisma.student.update({ where, data });
  }

  async deleteStudent(params: {
    where: Prisma.StudentWhereUniqueInput;
  }): Promise<StudentEntity> {
    const { where } = params;
    return this.prisma.student.delete({ where });
  }

  async resetStudent(): Promise<void> {
    await this.prisma.student.deleteMany();
  }
}
