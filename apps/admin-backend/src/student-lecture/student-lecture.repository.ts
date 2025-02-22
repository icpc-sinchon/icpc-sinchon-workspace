import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { Season, Level } from "@prisma/client";
import { StudentEntity } from "@/student/entities/student.entity";

@Injectable()
export class StudentLectureRepository {
  constructor(private prisma: PrismaService) {}

  // 이번 학기에 강의를 듣는 학생들을 lecture log까지 다 가져온다
  // lecture isCancelled가 false인 것(강의 취소 X)만 가져온다
  async getStudentsWithLectureLogBySemester(year: number, season: Season) {
    return this.prisma.student.findMany({
      where: {
        studentLectureLog: {
          some: {
            lecture: {
              lectureSemester: {
                year,
                season,
              },
            },
            isCancelled: false,
          },
        },
      },
      include: {
        studentLectureLog: {
          where: {
            isCancelled: false,
            lecture: {
              lectureSemester: {
                year,
                season,
              },
            },
          },
          include: {
            lecture: {
              include: {
                lectureSemester: true,
              },
            },
          },
        },
      },
    });
  }

  async getStudentsWithLectureLogBySemesterAndLectureLevel(
    year: number,
    season: Season,
    lectureLevel: Level,
  ): Promise<StudentEntity[]> {
    return this.prisma.student.findMany({
      where: {
        studentLectureLog: {
          some: {
            lecture: {
              lectureSemester: {
                year,
                season,
              },
              level: lectureLevel,
            },
          },
        },
      },
      include: {
        studentLectureLog: {
          where: {
            lecture: {
              lectureSemester: {
                year,
                season,
              },
              level: lectureLevel,
            },
            isCancelled: false,
          },
          include: {
            lecture: {
              include: {
                lectureSemester: true,
              },
            },
          },
        },
      },
    });
  }
}
