import { Module } from "@nestjs/common";
import { StudentAttendService } from "./student-attend.service";
import { StudentAttendController } from "./student-attend.controller";
import { PrismaModule } from "@/prisma/prisma.module";
import { StudentAttendRepository } from "./student-attend.repository";
import { LectureRepository } from "@/lecture/lecture.repository";
import { WeeklyAttendLogRepository } from "@/weekly-attend-log/weekly-attend-log.repository";

@Module({
  imports: [PrismaModule],
  controllers: [StudentAttendController],
  providers: [
    StudentAttendRepository,
    LectureRepository,
    WeeklyAttendLogRepository,
    StudentAttendService,
  ],
})
export class StudentAttendModule {}
