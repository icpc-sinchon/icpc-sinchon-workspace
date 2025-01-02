import { Injectable, NotFoundException } from "@nestjs/common";
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
  }

  findLectureById(id: number) {
    return this.lectureRepository.getLecture({ where: { id } });
  }

  findLecturesBySemester(year: number, season: Season) {
    return this.lectureRepository.getLectures({
      where: {
        lectureSemester: {
          year,
          season,
        },
      },
    });
  }

  findLectureBySemesterAndLevel(year: number, season: Season, level: Level) {
    return this.lectureRepository.getLectures({
      where: {
        lectureSemester: {
          year,
          season,
        },
        level,
      },
    });
  }

  findLecturesWithTasksBySemester(year: number, season: Season) {
    return this.lectureRepository.getLecturesWithTasks({
      where: {
        lectureSemester: {
          year,
          season,
        },
      },
    });
  }

  updateLecture(id: number, updateLectureDto: UpdateLectureDto) {
    return this.lectureRepository.updateLecture({
      where: { id },
      data: updateLectureDto,
    });
  }

  getAllLectures() {
    return this.lectureRepository.getAllLectures();
  }

  removeLecture(id: number) {
    return this.lectureRepository.deleteLecture({ where: { id } });
  }
}
