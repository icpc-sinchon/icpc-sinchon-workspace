import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import type { CreateSemesterDto } from "./dto/create-semester.dto";
import type { UpdateSemesterDto } from "./dto/update-semester.dto";
import { SemesterRepository } from "./semester.repository";
import type { Season } from "@prisma/client";
import { SemesterEntity } from "./entities/semester.entity";

@Injectable()
export class SemesterService {
  constructor(private readonly semesterRepository: SemesterRepository) {}

  async createSemester(
    createSemesterDto: CreateSemesterDto,
  ): Promise<SemesterEntity> {
    try {
      return await this.semesterRepository.createSemester({
        data: createSemesterDto,
      });
    } catch (error) {
      throw new BadRequestException(
        `Semester creation failed: ${error.message}`,
      );
    }
  }

  async findSemesterById(id: number): Promise<SemesterEntity> {
    try {
      const semester = await this.semesterRepository.getSemester({
        where: { id },
      });
      if (!semester) {
        throw new NotFoundException(`Semester with ID ${id} not found`);
      }
      return semester;
    } catch (error) {
      throw new BadRequestException(
        `Failed to retrieve semester: ${error.message}`,
      );
    }
  }

  async findSemesterBySeason(
    year: number,
    season: Season,
  ): Promise<SemesterEntity> {
    try {
      const semester = await this.semesterRepository.getSemester({
        where: {
          year_season: {
            year,
            season,
          },
        },
      });

      if (!semester) {
        throw new NotFoundException(
          `Semester for year ${year} and season ${season} not found`,
        );
      }

      return semester;
    } catch (error) {
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
      await this.findSemesterById(id);
      return await this.semesterRepository.updateSemester({
        where: { id },
        data: updateSemesterDto,
      });
    } catch (error) {
      throw new BadRequestException(`Semester update failed: ${error.message}`);
    }
  }

  async getAllSemesters(): Promise<SemesterEntity[]> {
    try {
      return await this.semesterRepository.getAllSemesters();
    } catch (error) {
      throw new BadRequestException(
        `Failed to retrieve semesters: ${error.message}`,
      );
    }
  }

  async removeSemester(id: number): Promise<SemesterEntity> {
    try {
      await this.findSemesterById(id);
      return await this.semesterRepository.deleteSemester({ where: { id } });
    } catch (error) {
      throw new BadRequestException(
        `Semester deletion failed: ${error.message}`,
      );
    }
  }
}
