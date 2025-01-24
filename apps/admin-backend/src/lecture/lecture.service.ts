import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { Level, Season } from "@prisma/client";
import { CreateLectureDto } from "./dto/create-lecture.dto";
import { UpdateLectureDto } from "./dto/update-lecture.dto";
import { LectureEntity } from "./entities/lecture.entity";
import { LectureRepository } from "./lecture.repository";
import { TaskRepository } from "../task/task.repository";
import { SemesterRepository } from "../semester/semester.repository";
import { SemesterService } from "../semester/semester.service";

@Injectable()
export class LectureService {
  constructor(
    private readonly lectureRepository: LectureRepository,
    private readonly taskRepository: TaskRepository,
    private readonly semesterRepository: SemesterRepository,
    private readonly semesterService: SemesterService,
  ) {}

  async createLectureWithTasks(
    createLectureDto: CreateLectureDto,
  ): Promise<LectureEntity> {
    const { semesterId, lectureNumber, ...lectureData } = createLectureDto;

    try {
      const semester = await this.semesterRepository.getSemester({
        where: { id: semesterId },
      });

      if (!semester) {
        throw new NotFoundException(`Semester with ID ${semesterId} not found`);
      }

      const newLecture = await this.lectureRepository.createLectureWithTasks({
        data: {
          ...lectureData,
          lectureNumber,
          lectureSemester: { connect: { id: semesterId } },
        },
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

  async getLectureById(id: number): Promise<LectureEntity> {
    try {
      const lecture = await this.lectureRepository.getLecture({
        where: { id },
      });
      if (!lecture) {
        throw new NotFoundException(`Lecture with ID ${id} not found`);
      }
      return lecture;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to find lecture: ${error.message}`);
    }
  }

  async getLecturesBySemester(
    year: number,
    season: Season,
  ): Promise<LectureEntity[]> {
    try {
      return await this.lectureRepository.getLecturesBySemester({
        where: { lectureSemester: { year, season } },
      });
    } catch (error) {
      throw new BadRequestException(
        `Failed to find lectures by semester: ${error.message}`,
      );
    }
  }

  async getLectureBySemesterAndLevel(
    year: number,
    season: Season,
    level: Level,
  ): Promise<LectureEntity> {
    try {
      const semester = await this.semesterService.findSemesterBySeason(
        year,
        season,
      );

      if (!semester) {
        throw new NotFoundException(
          `Semester not found for year: ${year}, season: ${season}`,
        );
      }

      const lecture = await this.lectureRepository.getLectureBySemesterAndLevel(
        { semesterId: semester.id, level },
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
        `Failed to find lecture by semester and level: ${error.message}`,
      );
    }
  }

  async getLecturesWithTasksBySemester(
    year: number,
    season: Season,
  ): Promise<LectureEntity[]> {
    try {
      return await this.lectureRepository.getLecturesWithTasksBySemester({
        where: { lectureSemester: { year, season } },
      });
    } catch (error) {
      throw new BadRequestException(
        `Failed to find lectures with tasks: ${error.message}`,
      );
    }
  }

  async updateLecture(
    id: number,
    updateLectureDto: UpdateLectureDto,
  ): Promise<LectureEntity> {
    try {
      await this.getLectureById(id);
      return await this.lectureRepository.updateLecture({
        where: { id },
        data: updateLectureDto,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Lecture update failed: ${error.message}`);
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

  async removeLecture(id: number): Promise<LectureEntity> {
    try {
      await this.getLectureById(id);
      return await this.lectureRepository.deleteLecture({ where: { id } });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Lecture deletion failed: ${error.message}`,
      );
    }
  }
}
