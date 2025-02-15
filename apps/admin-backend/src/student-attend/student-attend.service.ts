import { Injectable } from "@nestjs/common";
import { CreateStudentAttendDto } from "./dto/create-student-attend.dto";
import {
  UpdateAttendanceDto,
  UpdateStudentAttendDto,
} from "./dto/update-student-attend.dto";
import { Lecture, Prisma, Semester } from "@prisma/client";
import { StudentAttendRepository } from "./student-attend.repository";
import { LectureRepository } from "@/lecture/lecture.repository";
import { WeeklyAttendLogRepository } from "@/weekly-attend-log/weekly-attend-log.repository";

const studentWithWeeklyAttendLog =
  Prisma.validator<Prisma.StudentDefaultArgs>()({
    select: {
      id: true,
      name: true,
      bojHandle: true,
      weeklyAttendLog: {
        select: { round: true, lectureDone: true, taskDone: true },
      },
      studentLectureLog: {
        select: {
          lecture: { select: { id: true, level: true, lectureNumber: true } },
        },
      },
    },
  });

type StudentWithWeeklyAttendLog = Prisma.StudentGetPayload<
  typeof studentWithWeeklyAttendLog
>;

@Injectable()
export class StudentAttendService {
  constructor(
    private readonly studentAttendRepository: StudentAttendRepository,
    private readonly lectureRepository: LectureRepository, // TODO: 환급정책 관련
    private readonly weeklyAttendLogRepository: WeeklyAttendLogRepository
  ) {}

  private mapAttendanceData(
    studentData: StudentWithWeeklyAttendLog,
    lectureNumber: number
  ) {
    return {
      studentId: studentData.id,
      lectureId: studentData.studentLectureLog[0]?.lecture.id,
      name: studentData.name,
      bojHandle: studentData.bojHandle,
      attendLog: Array.from({ length: lectureNumber }, (_, index) => {
        const log = studentData.weeklyAttendLog.find(
          (log) => log.round === index + 1
        );
        return log
          ? {
              lectureDone: log.lectureDone,
              taskDone: log.taskDone,
              round: log.round,
            }
          : { lectureDone: false, taskDone: false, round: index + 1 };
      }),
    };
  }

  async findAllStudentsAttendLogsInLecture(
    semesterId: number,
    lectureLevel: Lecture["level"]
  ) {
    const lecture = await this.lectureRepository.getLectureBySemesterAndLevel(
      semesterId,
      lectureLevel
    );

    if (!lecture) {
      throw new Error(`Lecture not found for ${lectureLevel}`);
    }

    const studentsWithAttendLogs =
      await this.studentAttendRepository.getAllStudentsWithAttendLogInLecture(
        lecture.id
      );

    const result = studentsWithAttendLogs.map((student) =>
      this.mapAttendanceData(student, lecture.lectureNumber)
    );

    return result;
  }

  updateMultipleAttendance(dto: UpdateAttendanceDto[]) {
    console.log("bulk update attendance", dto);
    const updates = dto.map((data) => {
      this.weeklyAttendLogRepository.upsertWeeklyAttendLog({
        where: {
          studentId_lectureId_round: {
            lectureId: data.lectureId,
            round: data.round,
            studentId: data.studentId,
          },
        },
        update: {
          lectureDone: data.lectureDone,
          taskDone: data.taskDone,
        },
        create: {
          lectureDone: data.lectureDone,
          taskDone: data.taskDone,
          round: data.round,
          student: { connect: { id: data.studentId } },
          lecture: { connect: { id: data.lectureId } },
        },
      });
    });

    return Promise.all(updates);
  }

  findOne(id: number) {
    return `This action returns a #${id} studentAttend`;
  }

  update(id: number, updateStudentAttendDto: UpdateStudentAttendDto) {
    return `This action updates a #${id} studentAttend`;
  }

  remove(id: number) {
    return `This action removes a #${id} studentAttend`;
  }
}
