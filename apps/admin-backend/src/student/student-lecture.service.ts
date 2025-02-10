import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import type { Prisma, Season } from "@prisma/client";
import { StudentLectureLogRepository } from "../student-lecture-log/student-lecture-log.repository";
import { StudentLectureRepository } from "./student-lecture.repository";
import { SemesterRepository } from "../semester/semester.repository";
import { StudentRepository } from "./student.repository";
import { LectureRepository } from "../lecture/lecture.repository";
import type { LectureIdentifier, StudentLectureLogInfo } from "../types";

@Injectable()
export class StudentLectureService {
  constructor(
    private readonly semesterRepository: SemesterRepository,
    private readonly studentRepository: StudentRepository,
    private readonly lectureRepository: LectureRepository,
    private readonly studentLectureLogRepository: StudentLectureLogRepository,
    private readonly studentLectureRepository: StudentLectureRepository,
  ) {}

  async createStudentWithLectureLog(
    studentData: Prisma.StudentCreateInput,
    lectureInfo: LectureIdentifier,
    studentLectureLogInfo: StudentLectureLogInfo,
  ) {
    try {
      // 학생이 이미 존재하는지 확인
      const student = await this.studentRepository.getStudentByBojHandle(
        studentData.bojHandle,
      );

      const { year, season, level } = lectureInfo;

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

      // 학생이 존재하지 않으면 새로 생성하고 수강 로그 추가
      if (!student) {
        return this.studentLectureRepository.createStudentWithLectureLog(
          studentData,
          lecture.id,
          studentLectureLogInfo.refundOption,
          studentLectureLogInfo.refundAccount,
        );
      }

      // 학생이 존재하면 수강 로그만 추가
      return this.studentLectureLogRepository.createStudentLectureLog({
        refundOption: studentLectureLogInfo.refundOption,
        refundAccount: studentLectureLogInfo.refundAccount,
        isCancelled: false,
        isInvited: false,
        student: {
          connect: { id: student.id },
        },
        lecture: {
          connect: { id: lecture.id },
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to create student with lecture log: ${error.message}`,
      );
    }
  }

  async createStudentsWithLectureLog(
    studentsData: Array<{
      student: Prisma.StudentCreateInput;
      lectureInfo: LectureIdentifier;
      studentLectureLogInfo: StudentLectureLogInfo;
    }>,
  ) {
    try {
      const studentsQuery = studentsData.map(
        ({ student, lectureInfo, studentLectureLogInfo }) => {
          return this.createStudentWithLectureLog(
            student,
            lectureInfo,
            studentLectureLogInfo,
          );
        },
      );

      return await Promise.all(studentsQuery);
    } catch (error) {
      throw new BadRequestException(
        `Failed to create students with lecture log: ${error.message}`,
      );
    }
  }

  // 현재 학기에 수강하고 있는 강의의 난이도를 배열로 가지는 학생 목록을 반환
  async getStudentsWithLectureLevelsBySemester(year: number, season: Season) {
    try {
      const studentsWithLectureLogs =
        await this.studentLectureRepository.getStudentsWithLectureLogBySemester(
          year,
          season,
        );

      return studentsWithLectureLogs.map((student) => {
        return {
          id: student.id,
          name: student.name,
          school: student.school,
          bojHandle: student.bojHandle,
          email: student.email,
          phone: student.phone,
          studentNumber: student.studentNumber,
          lectureLevels: student.studentLectureLog.map((log) => log.lectureId),
        };
      });
    } catch (error) {
      throw new BadRequestException(
        `Failed to retrieve students with lecture levels: ${error.message}`,
      );
    }
  }

  async getStudentLectureLogByStudentId(
    studentId: number,
    query: LectureIdentifier,
  ) {
    try {
      const { year, season, level } = query;

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
        throw new NotFoundException("Lecture not found");
      }

      return this.studentLectureLogRepository.getStudentLectureLogByLectureId(
        studentId,
        lecture.id,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to find student lecture log: ${error.message}`,
      );
    }
  }

  // studentID의 학생의 강의 로그를 업데이트
  // content에는 isInvited, isCancelled 등 log 데이터가 들어갈 수 있음
  async updateStudentLectureLogByStudentId(
    studentId: number,
    lectureData: LectureIdentifier,
    updateContent: Prisma.StudentLectureLogUpdateInput,
  ) {
    try {
      const { year, season, level } = lectureData;

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
        throw new NotFoundException("Lecture not found");
      }

      const studentLectureLog =
        await this.studentLectureLogRepository.getStudentLectureLogByLectureId(
          studentId,
          lecture.id,
        );

      if (!studentLectureLog) {
        throw new NotFoundException(
          `Student lecture log not found for student ${studentId} and lecture ${lecture.id}`,
        );
      }

      return this.studentLectureLogRepository.updateStudentLectureLog(
        studentLectureLog.id,
        updateContent,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to update student lecture log: ${error.message}`,
      );
    }
  }

  // 학생 강의를 취소하는 거고 로그를 삭제하는 건 아니니까 이름을 바꿔주는 게 좋을지도?
  async deleteStudentLectureLogByStudentId(
    studentId: number,
    props: LectureIdentifier,
  ) {
    try {
      const { year, season, level } = props;

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
        throw new NotFoundException("Lecture not found");
      }

      const studentLectureLog =
        await this.studentLectureLogRepository.getStudentLectureLogByLectureId(
          studentId,
          lecture.id,
        );

      if (!studentLectureLog) {
        throw new NotFoundException(
          `Student lecture log not found for student ${studentId} and lecture ${lecture.id}`,
        );
      }

      return this.studentLectureLogRepository.updateStudentLectureLog(
        studentLectureLog.id,
        { isCancelled: true },
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to delete student lecture log: ${error.message}`,
      );
    }
  }
}
