import { PrismaService } from "@/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { UpdateAttendanceDto } from "./dto/update-student-attend.dto";

@Injectable()
export class StudentAttendRepository {
  constructor(private prisma: PrismaService) {}

  // 학생의 BOJ 핸들을 이용해 해당 학생의 출석 로그까지 포함해서 가져온다
  async getStudentWithAttendLogByBojHandle(bojHandle: string) {
    return this.prisma.student.findUnique({
      where: {
        bojHandle,
      },
      include: {
        weeklyAttendLog: true,
      },
    });
  }

  // student ID, lecture ID로 해당 학생의 출석 로그를 가져온다
  // 이때 해당 학생이 해당 강의를 듣는 경우에 한해서만 가져온다
  async getStudentAttendLogByStudentIdAndLectureId(
    studentId: number,
    lectureId: number
  ) {
    return this.prisma.student.findUnique({
      select: {
        id: true,
        name: true,
        bojHandle: true,
        studentLectureLog: {
          where: {
            isCancelled: false,
            lecture: {
              id: lectureId,
            },
          },
          select: {
            lecture: {
              select: {
                id: true,
                level: true,
              },
            },
          },
        },
        weeklyAttendLog: {
          where: {
            lecture: {
              id: lectureId,
            },
          },
          select: {
            round: true,
            lectureDone: true,
            taskDone: true,
          },
        },
      },
      // 해당 강의를 듣는 student만 가져온다
      where: {
        id: studentId,
        studentLectureLog: {
          some: {
            lecture: {
              id: lectureId,
            },
          },
        },
      },
    });
  }

  // TODO: student lecture log로 refundAccount 옮겨진 부분 적용
  async getAllStudentsWithAttendLogInLecture(lectureId: number) {
    return this.prisma.student.findMany({
      select: {
        id: true,
        name: true,
        bojHandle: true,
        studentLectureLog: {
          where: {
            isCancelled: false,
            lecture: {
              id: lectureId,
            },
          },
          select: {
            refundAccount: true,
            refundOption: true,
            lecture: {
              select: {
                id: true,
                level: true,
                lectureNumber: true,
              },
            },
          },
        },
        weeklyAttendLog: {
          where: {
            lecture: {
              id: lectureId,
            },
          },
          select: {
            round: true,
            lectureDone: true,
            taskDone: true,
          },
        },
      },
      // 해당 강의를 듣는 student만 가져온다
      where: {
        studentLectureLog: {
          some: {
            isCancelled: false,
            lecture: {
              id: lectureId,
            },
          },
        },
      },
    });
  }
}
