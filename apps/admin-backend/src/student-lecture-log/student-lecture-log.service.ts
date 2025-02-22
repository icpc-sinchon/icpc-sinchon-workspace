import { Injectable } from "@nestjs/common";
import { CreateStudentLectureLogDto } from "./dto/create-student-lecture-log.dto";
import { UpdateStudentLectureLogDto } from "./dto/update-student-lecture-log.dto";
import { StudentRepository } from "@/student/student.repository";
import { StudentLectureLogRepository } from "./student-lecture-log.repository";

@Injectable()
export class StudentLectureLogService {
  constructor(
    private readonly studentRepository: StudentRepository,
    private readonly studentLectureLogRepository: StudentLectureLogRepository
  ) {}

  create(createStudentLectureLogDto: CreateStudentLectureLogDto) {
    try {
      return this.studentLectureLogRepository.createStudentLectureLog({
        student: {
          connect: {
            bojHandle: createStudentLectureLogDto.bojHandle,
          },
        },
        lecture: {
          connect: {
            semesterId_level: {
              semesterId: createStudentLectureLogDto.semesterId,
              level: createStudentLectureLogDto.level,
            },
          },
        },
        refundAccount: createStudentLectureLogDto.refundAccount,
        refundOption: createStudentLectureLogDto.refundOption,
      });
    } catch (e) {
      console.log(e);
    }
  }

  createMultiple(createStudentLectureLogDto: CreateStudentLectureLogDto[]) {
    try {
      return createStudentLectureLogDto.map((data) => {
        return this.studentLectureLogRepository.createStudentLectureLog({
          student: {
            connect: {
              bojHandle: data.bojHandle,
            },
          },
          lecture: {
            connect: {
              semesterId_level: {
                semesterId: data.semesterId,
                level: data.level,
              },
            },
          },
          refundAccount: data.refundAccount,
          refundOption: data.refundOption,
        });
      });
    } catch (e) {
      console.log(e);
    }
  }

  update(id: number, updateStudentLectureLogDto: UpdateStudentLectureLogDto) {
    return this.studentLectureLogRepository.updateStudentLectureLog(
      id,
      updateStudentLectureLogDto
    );
  }

  remove(id: number) {
    return this.studentLectureLogRepository.deleteStudentLectureLog(id);
  }
}
