import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import type { Level, Season } from "@prisma/client";
import { CreateLectureDto } from "./dto/create-lecture.dto";
import { UpdateLectureDto } from "./dto/update-lecture.dto";
import { LectureEntity } from "./entities/lecture.entity";
import { LectureRepository } from "./lecture.repository";
import { SemesterRepository } from "../semester/semester.repository";

@Injectable()
export class LectureService {
  constructor(
    private readonly lectureRepository: LectureRepository,
    private readonly semesterRepository: SemesterRepository,
  ) {}

  async createLectureWithTasks(
    createLectureDto: CreateLectureDto,
  ): Promise<LectureEntity> {
    const { semesterId, lectureNumber, ...lectureData } = createLectureDto;

    try {
      const semester =
        await this.semesterRepository.getSemesterById(semesterId);
      if (!semester) {
        throw new NotFoundException(`Semester with ID ${semesterId} not found`);
      }

      const newLecture = await this.lectureRepository.createLectureWithTasks({
        ...lectureData,
        lectureNumber,
        lectureSemester: { connect: { id: semesterId } },
      });

      return newLecture;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to create lecture with tasks: ${error.message}`,
      );
    }
  }

  async getAllLectures(): Promise<LectureEntity[]> {
    try {
      return await this.lectureRepository.getAllLectures();
    } catch (error) {
      throw new BadRequestException(
        `Failed to retrieve all lectures: ${error.message}`,
      );
    }
  }

  async getLectureById(id: number): Promise<LectureEntity> {
    try {
      const lecture = await this.lectureRepository.getLectureById(id);
      if (!lecture) {
        throw new NotFoundException(`Lecture with ID ${id} not found`);
      }
      return lecture;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to retrieve lecture: ${error.message}`,
      );
    }
  }

  async getLecturesBySemester(
    year: number,
    season: Season,
  ): Promise<LectureEntity[]> {
    try {
      const semester = await this.semesterRepository.getSemesterByYearAndSeason(
        year,
        season,
      );
      if (!semester) {
        throw new NotFoundException(
          `Semester not found for year: ${year}, season: ${season}`,
        );
      }

      return await this.lectureRepository.getLecturesBySemester(semester.id);
    } catch (error) {
      throw new BadRequestException(
        `Failed to retrieve lectures for year ${year} and season ${season}: ${error.message}`,
      );
    }
  }

  async getLectureBySemesterAndLevel(
    year: number,
    season: Season,
    level: Level,
  ): Promise<LectureEntity> {
    try {
      const semester = await this.semesterRepository.getSemesterByYearAndSeason(
        year,
        season,
      );
      if (!semester) {
        throw new NotFoundException(
          `Semester not found for year: ${year}, season: ${season}`,
        );
      }

      const lecture = await this.lectureRepository.getLectureBySemesterAndLevel(
        semester.id,
        level,
      );
      if (!lecture) {
        throw new NotFoundException(
          `Lecture not found for year: ${year}, season: ${season}, level: ${level}`,
        );
      }

      return lecture;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to retrieve lectures for year: ${year}, season: ${season}, level: ${level}: ${error.message}`,
      );
    }
  }

  async getLecturesWithTasksBySemester(
    year: number,
    season: Season,
  ): Promise<LectureEntity[]> {
    try {
      const semester = await this.semesterRepository.getSemesterByYearAndSeason(
        year,
        season,
      );
      if (!semester) {
        throw new NotFoundException(
          `Semester not found for year: ${year}, season: ${season}`,
        );
      }

      return await this.lectureRepository.getLecturesWithTasksBySemester(
        semester.id,
      );
    } catch (error) {
      throw new BadRequestException(
        `Failed to retrieve lectures with tasks for year ${year} and season ${season}: ${error.message}`,
      );
    }
  }

  async updateLecture(
    id: number,
    updateLectureDto: UpdateLectureDto,
  ): Promise<LectureEntity> {
    try {
      const lecture = await this.lectureRepository.getLectureById(id);
      if (!lecture) {
        throw new NotFoundException(`Lecture with ID ${id} not found`);
      }
      return await this.lectureRepository.updateLecture(id, updateLectureDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to update lecture: ${error.message}`,
      );
    }
  }

  async deleteLecture(id: number): Promise<LectureEntity> {
    try {
      const lecture = await this.lectureRepository.getLectureById(id);
      if (!lecture) {
        throw new NotFoundException(`Lecture with ID ${id} not found`);
      }
      return await this.lectureRepository.deleteLecture(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to delete lecture: ${error.message}`,
      );
    }
  }
}
