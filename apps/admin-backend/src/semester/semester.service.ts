import { Injectable, NotFoundException } from "@nestjs/common";
import type { CreateSemesterDto } from "./dto/create-semester.dto";
import type { UpdateSemesterDto } from "./dto/update-semester.dto";
import { SemesterRepository } from "./semester.repository";
import type { Semester } from "@prisma/client";

@Injectable()
export class SemesterService {
  constructor(private semesterRepository: SemesterRepository) {}

  createSemester(createSemesterDto: CreateSemesterDto) {
    return this.semesterRepository.createSemester({ data: createSemesterDto });
  }

  findSemesterById(id: number): Promise<Semester | null> {
    const semester = this.semesterRepository.getSemester({
      where: { id },
    });

    if (!semester) {
      throw new NotFoundException(`Semester with ID ${id} not found`);
    }

    return semester;
  }

  updateSemester(
    id: number,
    updateSemesterDto: UpdateSemesterDto,
  ): Promise<Semester> {
    // getSemesterById에서 존재하지 않으면 예외 발생하므로 별도 체크 불필요
    this.findSemesterById(id);

    const semester = this.semesterRepository.updateSemester({
      where: { id },
      data: updateSemesterDto,
    });
    return semester;
  }

  getAllSemesters(): Promise<Semester[]> {
    return this.semesterRepository.getAllSemesters();
  }

  removeSemester(id: number): Promise<Semester> {
    return this.semesterRepository.deleteSemester({ where: { id } });
  }
}
