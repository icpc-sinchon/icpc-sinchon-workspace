import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import type { Season } from "@prisma/client";
import type { CreateSemesterDto } from "./dto/create-semester.dto";
import type { UpdateSemesterDto } from "./dto/update-semester.dto";
import { SemesterEntity } from "./entities/semester.entity";
import { SemesterRepository } from "./semester.repository";

@Injectable()
export class SemesterService {
  constructor(private readonly semesterRepository: SemesterRepository) {}

  async createSemester(
    createSemesterDto: CreateSemesterDto,
  ): Promise<SemesterEntity> {
    try {
      return await this.semesterRepository.createSemester(createSemesterDto);
    } catch (error) {
      throw new BadRequestException(
        `Failed to create semester: ${error.message}`,
      );
    }
  }

  async getAllSemesters(): Promise<SemesterEntity[]> {
    try {
      return await this.semesterRepository.getAllSemesters();
    } catch (error) {
      throw new BadRequestException(
        `Failed to retrieve all semesters: ${error.message}`,
      );
    }
  }

  async getSemesterById(id: number): Promise<SemesterEntity> {
    try {
      const semester = await this.semesterRepository.getSemesterById(id);
      if (!semester) {
        throw new NotFoundException(`Semester with ID ${id} not found`);
      }
      return semester;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to retrieve semester for id ${id}: ${error.message}`,
      );
    }
  }

  async getSemesterByYearAndSeason(
    year: number,
    season: Season,
  ): Promise<SemesterEntity> {
    try {
      const semester = await this.semesterRepository.getSemesterByYearAndSeason(
        year,
        season,
      );
      if (!semester) {
        throw new NotFoundException(
          `Semester not found for year ${year} and season ${season}`,
        );
      }
      return semester;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to retrieve semester for year ${year} and season ${season}: ${error.message}`,
      );
    }
  }

  async updateSemester(
    id: number,
    updateSemesterDto: UpdateSemesterDto,
  ): Promise<SemesterEntity> {
    try {
      const semester = await this.semesterRepository.getSemesterById(id);
      if (!semester) {
        throw new NotFoundException(`Semester with ID ${id} not found`);
      }
      return await this.semesterRepository.updateSemester(
        id,
        updateSemesterDto,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to update semester: ${error.message}`,
      );
    }
  }

  async deleteSemester(id: number): Promise<SemesterEntity> {
    try {
      const semester = await this.semesterRepository.getSemesterById(id);
      if (!semester) {
        throw new NotFoundException(`Semester with ID ${id} not found`);
      }
      return await this.semesterRepository.deleteSemester(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to delete semester: ${error.message}`,
      );
    }
  }
}
