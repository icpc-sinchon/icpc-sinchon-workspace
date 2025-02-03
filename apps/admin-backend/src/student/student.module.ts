import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { StudentRepository } from "./student.repository";
import { StudentService } from "./student.service";
import { StudentController } from "./student.controller";
import { StudentLectureRepository } from "./student-lecture.repository";
import { StudentLectureService } from "./student-lecture.service";
import { SemesterRepository } from "@/semester/semester.repository";
import { LectureRepository } from "@/lecture/lecture.repository";
import { StudentLectureLogRepository } from "@/student-lecture-log/student-lecture-log.repository";
import { TaskRepository } from "@/task/task.repository";
import { StudentLectureController } from "./student-lecture.controller";

@Module({
  imports: [PrismaModule],
  providers: [
    StudentRepository,
    StudentLectureRepository,
    StudentService,
    StudentLectureService,
    SemesterRepository,
    LectureRepository,
    StudentLectureLogRepository,
    TaskRepository,
  ],
  controllers: [StudentController, StudentLectureController],
})
export class StudentModule {}
