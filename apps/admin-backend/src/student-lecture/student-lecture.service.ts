import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Season } from "@prisma/client";
import { StudentLectureRepository } from "./student-lecture.repository";
import { SemesterRepository } from "@/semester/semester.repository";
import { StudentRepository } from "@/student/student.repository";
import { StudentLectureLogRepository } from "@/student-lecture-log/student-lecture-log.repository";
import { LectureRepository } from "@/lecture/lecture.repository";
import { LectureIdentifier } from "@/types";

@Injectable()
export class StudentLectureService {
  constructor(
    private readonly semesterRepository: SemesterRepository,
    private readonly studentRepository: StudentRepository,
    private readonly lectureRepository: LectureRepository,
    private readonly studentLectureRepository: StudentLectureRepository,
    private readonly studentLectureLogRepository: StudentLectureLogRepository
  ) {}

  // 현재 학기에 수강하고 있는 강의의 난이도를 배열로 가지는 학생 목록을 반환
  // TODO: 환급 관련 정보를 적절히 추가
  async getStudentsWithLectureLevelsBySemester(year: number, season: Season) {
    try {
      const studentsWithLectureLogs =
        await this.studentLectureRepository.getStudentsWithLectureLogBySemester(
          year,
          season
        );

      // console.log(JSON.stringify(studentsWithLectureLogs, null, 2));

      return studentsWithLectureLogs.map((student) => {
        return {
          id: student.id,
          name: student.name,
          school: student.school,
          bojHandle: student.bojHandle,
          email: student.email,
          phone: student.phone,
          studentNumber: student.studentNumber,
          lectureLogs: student.studentLectureLog.map((log) => ({
            id: log.id,
            refundOption: log.refundOption,
            refundAccount: log.refundAccount,
            level: log.lecture.level,
          })),
        };
      });
    } catch (error) {
      throw new BadRequestException(
        `Failed to retrieve students with lecture levels: ${error.message}`
      );
    }
  }

  // 현재 미사용
  async getStudentLectureLogByStudentId(
    studentId: number,
    query: LectureIdentifier
  ) {
    try {
      const { year, season, level } = query;

      const semester = await this.semesterRepository.getSemesterByYearAndSeason(
        year,
        season
      );
      if (!semester) {
        throw new NotFoundException(
          `Semester not found for year: ${year}, season: ${season}`
        );
      }

      const lecture = await this.lectureRepository.getLectureBySemesterAndLevel(
        semester.id,
        level
      );
      if (!lecture) {
        throw new NotFoundException("Lecture not found");
      }

      return this.studentLectureLogRepository.getStudentLectureLogByLectureId(
        studentId,
        lecture.id
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to find student lecture log: ${error.message}`
      );
    }
  }
}
