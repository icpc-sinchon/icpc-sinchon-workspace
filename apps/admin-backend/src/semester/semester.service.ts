import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import type { CreateSemesterDto } from "./dto/create-semester.dto";
import type { UpdateSemesterDto } from "./dto/update-semester.dto";
import { SemesterRepository } from "./semester.repository";
import type { Semester } from "@prisma/client";

@Injectable()
export class SemesterService {
  constructor(private semesterRepository: SemesterRepository) {}

  async createSemester(createSemesterDto: CreateSemesterDto): Promise<Semester> {
    try {
      return await this.semesterRepository.createSemester({ data: createSemesterDto });
    } catch (error) {
      throw new BadRequestException(`Semester creation failed: ${error.message}`);
    }
  }

  async findSemesterById(id: number): Promise<Semester> {
    try {
      const semester = await this.semesterRepository.getSemester({ where: { id } });
      if (!semester) {
        throw new NotFoundException(`Semester with ID ${id} not found`);
      }
      return semester;
    } catch (error) {
      throw new BadRequestException(`Failed to retrieve semester: ${error.message}`);
    }
  }

  async updateSemester(
    id: number,
    updateSemesterDto: UpdateSemesterDto,
  ): Promise<Semester> {
    try {
      await this.findSemesterById(id);
      return await this.semesterRepository.updateSemester({
        where: { id },
        data: updateSemesterDto,
      });
    } catch (error) {
      throw new BadRequestException(`Semester update failed: ${error.message}`);
    }
  }

  async getAllSemesters(): Promise<Semester[]> {
    try {
      return await this.semesterRepository.getAllSemesters();
    } catch (error) {
      throw new BadRequestException(`Failed to retrieve semesters: ${error.message}`);
    }
  }

  async removeSemester(id: number): Promise<Semester> {
    try {
      await this.findSemesterById(id);
      return await this.semesterRepository.deleteSemester({ where: { id } });
    } catch (error) {
      throw new BadRequestException(`Semester deletion failed: ${error.message}`);
    }
  }
}
