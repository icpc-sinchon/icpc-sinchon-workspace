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
    const semesterCreateInput: Prisma.SemesterCreateInput = {
      ...createSemesterDto,
    };
    const semester = await this.semesterRepository.createSemester({
      data: semesterCreateInput,
    });
    return semester;
  }

  async getSemesters(): Promise<Semester[]> {
    const semesters = await this.semesterRepository.getSemesters();
    return semesters;
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
    const existingSemester = await this.getSemesterById(id);
    if (!existingSemester) {
      throw new NotFoundException(`Semester with ID ${id} not found`);
    }

    const semesterUpdateInput: Prisma.SemesterUpdateInput = {
      ...updateSemesterDto,
    };
    const semester = await this.semesterRepository.updateSemester({
      where: { id },
      data: semesterUpdateInput,
    });
    return semester;
  }

  async deleteSemester(id: number): Promise<Semester> {
    const existingSemester = await this.getSemesterById(id);
    if (!existingSemester) {
      throw new NotFoundException(`Semester with ID ${id} not found`);
    }

    const semester = await this.semesterRepository.deleteSemester({
      where: { id },
    });
    return semester;
  }
}
