import { Injectable } from "@nestjs/common";
import { CreateLectureDto } from "./dto/create-lecture.dto";
import { UpdateLectureDto } from "./dto/update-lecture.dto";
import { LectureRepository } from "./lecture.repository";
import { Level, Season } from "@prisma/client";

@Injectable()
export class LectureService {
  constructor(private lectureRepository: LectureRepository) {}

  createLecture(createLectureDto: CreateLectureDto) {
    return this.lectureRepository.createLecture({
      data: {
        ...createLectureDto,
        lectureSemester: { connect: { id: createLectureDto.semesterId } },
      },
    });
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
