import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { StudentRepository } from "./student.repository";
import { StudentService } from "./student.service";
import { StudentController } from "./student.controller";

import { SemesterRepository } from "@/semester/semester.repository";
import { LectureRepository } from "@/lecture/lecture.repository";
import { StudentLectureLogRepository } from "@/student-lecture-log/student-lecture-log.repository";
import { TaskRepository } from "@/task/task.repository";

@Module({
  imports: [PrismaModule],
  providers: [
    StudentRepository,
    StudentService,
    SemesterRepository,
    LectureRepository,
    StudentLectureLogRepository,
    TaskRepository,
  ],
  controllers: [StudentController],
})
export class StudentModule {}
