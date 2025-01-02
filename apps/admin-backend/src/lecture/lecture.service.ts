import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { CreateLectureDto } from "./dto/create-lecture.dto";
import { UpdateLectureDto } from "./dto/update-lecture.dto";
import { LectureRepository } from "./lecture.repository";
import { TaskRepository } from "../task/task.repository";
import { SemesterRepository } from "../semester/semester.repository";
import { Level, Season } from "@prisma/client";

@Injectable()
export class LectureService {
  constructor(
    private lectureRepository: LectureRepository,
    private taskRepository: TaskRepository,
    private semesterRepository: SemesterRepository,
  ) {}

  async createLectureWithTasks(createLectureDto: CreateLectureDto) {
    const { semesterId, lectureNumber, ...lectureData } = createLectureDto;

    try {
      const semesterExists = await this.semesterRepository.getSemester({
        where: { id: semesterId },
      });

      if (!semesterExists) {
        throw new NotFoundException(`Semester with ID ${semesterId} not found`);
      }

      const newLecture = await this.lectureRepository.createLecture({
        data: {
          ...lectureData,
          lectureSemester: { connect: { id: semesterId } },
        },
      });

      const tasks = Array.from({ length: lectureNumber }, (_, i) => ({
        lectureId: newLecture.id,
        round: i + 1,
        practiceId: 0,
        minSolveCount: 0,
      }));

      await this.taskRepository.createTasks(tasks);

      return newLecture;
    } catch (error) {
      throw new BadRequestException(`Failed to create lecture with tasks: ${error.message}`);
    }
  }

  async findLectureById(id: number) {
    try {
      const lecture = await this.lectureRepository.getLecture({ where: { id } });
      if (!lecture) {
        throw new NotFoundException(`Lecture with ID ${id} not found`);
      }
      return lecture;
    } catch (error) {
      throw new BadRequestException(`Failed to find lecture: ${error.message}`);
    }
  }

  async findLecturesBySemester(year: number, season: Season) {
    try {
      return await this.lectureRepository.getLectures({
        where: {
          lectureSemester: {
            year,
            season,
          },
        },
      });
    } catch (error) {
      throw new BadRequestException(`Failed to find lectures by semester: ${error.message}`);
    }
  }

  async findLectureBySemesterAndLevel(year: number, season: Season, level: Level) {
    try {
      return await this.lectureRepository.getLectures({
        where: {
          lectureSemester: {
            year,
            season,
          },
          level,
        },
      });
    } catch (error) {
      throw new BadRequestException(`Failed to find lecture by semester and level: ${error.message}`);
    }
  }

  async findLecturesWithTasksBySemester(year: number, season: Season) {
    try {
      return await this.lectureRepository.getLecturesWithTasks({
        where: {
          lectureSemester: {
            year,
            season,
          },
        },
      });
    } catch (error) {
      throw new BadRequestException(`Failed to find lectures with tasks: ${error.message}`);
    }
  }

  async updateLecture(id: number, updateLectureDto: UpdateLectureDto) {
    try {
      await this.findLectureById(id); // Check if lecture exists

      return await this.lectureRepository.updateLecture({
        where: { id },
        data: updateLectureDto,
      });
    } catch (error) {
      throw new BadRequestException(`Failed to update lecture: ${error.message}`);
    }
  }

  async getAllLectures() {
    try {
      return await this.lectureRepository.getAllLectures();
    } catch (error) {
      throw new BadRequestException(`Failed to retrieve all lectures: ${error.message}`);
    }
  }

  async removeLecture(id: number) {
    try {
      await this.findLectureById(id); // Check if lecture exists
      return await this.lectureRepository.deleteLecture({ where: { id } });
    } catch (error) {
      throw new BadRequestException(`Failed to delete lecture: ${error.message}`);
    }
  }
}
