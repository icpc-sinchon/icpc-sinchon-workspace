import { Injectable } from '@nestjs/common';
import type { Prisma, Semester } from "@prisma/client";
import type { SemesterRepository } from "./semester.repository";

@Injectable()
export class SemesterService {
  constructor(private semesterRepository: SemesterRepository) {}

  async createSemester(params: { data: Prisma.SemesterCreateInput }) {
    const { data } = params;
    const semester = await this.semesterRepository.createSemester({ data });
    return semester;
  }

  async getSemesters(): Promise<Semester[]> {
    const semesters = await this.semesterRepository.getSemesters();
    return semesters;
  }

  async getSemesterById(params: { id: number }): Promise<Semester | null> {
    const { id } = params;
    const semester = await this.semesterRepository.getSemester({
      where: { id },
    });
    return semester;
  }

  async updateSemester(params: { where: Prisma.SemesterWhereUniqueInput; data: Prisma.SemesterUpdateInput }) {
    const { where, data } = params;
    const semester = await this.semesterRepository.updateSemester({
      where,
      data,
    });
    return semester;
  }

  async deleteSemester(params: { where: Prisma.SemesterWhereUniqueInput }) {
    const { where } = params;
    const semester = await this.semesterRepository.deleteSemester({ where });
    return semester;
  }
}
