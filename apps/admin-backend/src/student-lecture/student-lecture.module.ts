import { Module } from "@nestjs/common";
import { StudentLectureService } from "./student-lecture.service";
import { StudentLectureController } from "./student-lecture.controller";
import { PrismaModule } from "@/prisma/prisma.module";
import { StudentLectureRepository } from "./student-lecture.repository";
import { StudentRepository } from "@/student/student.repository";
import { StudentLectureLogRepository } from "@/student-lecture-log/student-lecture-log.repository";
import { SemesterRepository } from "@/semester/semester.repository";
import { LectureRepository } from "@/lecture/lecture.repository";
import { TaskRepository } from "@/task/task.repository";

@Module({
  imports: [PrismaModule],
  controllers: [StudentLectureController],
  providers: [
    SemesterRepository,
    LectureRepository,
    TaskRepository,
    StudentLectureService,
    StudentRepository,
    StudentLectureRepository,
    StudentLectureLogRepository,
  ],
})
export class StudentLectureModule {}
