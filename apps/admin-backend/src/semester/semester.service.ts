import { Injectable, NotFoundException } from "@nestjs/common";
import { SemesterRepository } from "./semester.repository";
import type { Prisma, Semester } from "@prisma/client";
import type { CreateSemesterDto } from "./dto/create-semester.dto";
import type { UpdateSemesterDto } from "./dto/update-semester.dto";

@Injectable()
export class SemesterService {
  constructor(private semesterRepository: SemesterRepository) {}

  async createSemester(
    createSemesterDto: CreateSemesterDto,
  ): Promise<Semester> {
    return this.semesterRepository.createSemester({ data: createSemesterDto });
  }

  async getAllSemesters(): Promise<Semester[]> {
    return this.semesterRepository.getAllSemesters();
  }

  async getSemesterById(id: number): Promise<Semester | null> {
    const semester = await this.semesterRepository.getSemester({
      where: { id },
    });

    if (!semester) {
      throw new NotFoundException(`Semester with ID ${id} not found`);
    }

    return semester;
  }

  async updateSemester(
    id: number,
    updateSemesterDto: UpdateSemesterDto,
  ): Promise<Semester> {
    // getSemesterById에서 존재하지 않으면 예외 발생하므로 별도 체크 불필요
    await this.getSemesterById(id);

    const semester = await this.semesterRepository.updateSemester({
      where: { id },
      data: updateSemesterDto,
    });
    return semester;
  }

  async deleteSemester(id: number): Promise<Semester> {
    // getSemesterById에서 존재하지 않으면 예외 발생하므로 별도 체크 불필요
    await this.getSemesterById(id);

    return this.semesterRepository.deleteSemester({ where: { id } });
  }
}
