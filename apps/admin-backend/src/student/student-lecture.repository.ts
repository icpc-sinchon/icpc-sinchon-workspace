import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { Prisma, Season, Level } from "@prisma/client";
import { StudentEntity } from "./entities/student.entity";
import { StudentLectureEntity } from "./entities/student-lecture.entity";

@Injectable()
export class StudentLectureRepository {
  constructor(private prisma: PrismaService) {}

  // lectureData로는 lecture를 유일하게 식별 가능한
  // lectureId 또는 semesterId + level을 받는다
  // 받은 데이터로 student와 lecture log를 생성한다
  async createStudentWithLectureLog(
    studentData: Prisma.StudentCreateInput,
    lectureId: number,
  ): Promise<StudentEntity> {
    return this.prisma.student.create({
      data: {
        ...studentData,
        studentLectureLog: {
          create: {
            isCancelled: false,
            // 초대 여부는 기본 false로 설정
            // 언젠가 초대 기능도 만들어야...
            isInvited: false,
            lecture: {
              connect: { id: lectureId },
            },
          },
        },
      },
    });
  }

  // 이번 학기에 강의를 듣는 학생들을 lecture log까지 다 가져온다
  // lecture isCancelled가 false인 것(강의 취소 X)만 가져온다
  async getStudentsWithLectureLogBySemester(
    year: number,
    season: Season,
  ): Promise<StudentLectureEntity[]> {
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

  async getAllStudentsWithLectureLogs(): Promise<StudentEntity[]> {
    return this.prisma.student.findMany({
      include: {
        studentLectureLog: {
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
