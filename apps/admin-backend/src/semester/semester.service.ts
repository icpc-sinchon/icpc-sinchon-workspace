import { Injectable } from '@nestjs/common';
import type { Prisma, Semester } from '@prisma/client';
import type { SemesterRepository } from './semester.repository';
import type { CreateSemesterDto } from './dto/create-semester.dto';

@Injectable()
export class SemesterService {
  constructor(private semesterRepository: SemesterRepository) {}

  async createSemester(createSemesterDto: CreateSemesterDto) {
    const semester = await this.semesterRepository.createSemester(createSemesterDto);
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
