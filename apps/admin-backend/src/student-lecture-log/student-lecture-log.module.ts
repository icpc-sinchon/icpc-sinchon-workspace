import { Module } from "@nestjs/common";
import { StudentLectureLogService } from "./student-lecture-log.service";
import { StudentLectureLogController } from "./student-lecture-log.controller";
import { StudentLectureLogRepository } from "./student-lecture-log.repository";
import { PrismaModule } from "@/prisma/prisma.module";
import { StudentRepository } from "@/student/student.repository";

@Module({
  imports: [PrismaModule],
  controllers: [StudentLectureLogController],
  providers: [
    StudentLectureLogService,
    StudentLectureLogRepository,
    StudentRepository,
  ],
})
export class StudentLectureLogModule {}
