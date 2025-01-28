import { Injectable } from "@nestjs/common";
import { CreateStudentAttendDto } from "./dto/create-student-attend.dto";
import { UpdateStudentAttendDto } from "./dto/update-student-attend.dto";
import { Lecture, Semester } from "@prisma/client";
import { StudentAttendRepository } from "./student-attend.repository";
import { LectureRepository } from "@/lecture/lecture.repository";

@Injectable()
export class StudentAttendService {
  constructor(
    private readonly studentAttendRepository: StudentAttendRepository,
    private readonly lectureRepository: LectureRepository // TODO: 환급정책 관련
  ) {}

  create(createStudentAttendDto: CreateStudentAttendDto) {
    return "This action adds a new studentAttend";
  }

  async findAllStudentsAttendLogsInLecture(
    semesterId: number,
    lectureLevel: Lecture["level"]
  ) {
    const lecture = await this.lectureRepository.getLecture({
      where: {
        semesterId_level: {
          semesterId,
          level: lectureLevel,
        },
      },
    });

    if (!lecture) {
      throw new Error(`Lecture not found for ${lectureLevel}`);
    }

    const studentsWithAttendLogs =
      await this.studentAttendRepository.getAllStudentsWithAttendLogInLecture(
        lecture.id
      );

    return studentsWithAttendLogs;
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
