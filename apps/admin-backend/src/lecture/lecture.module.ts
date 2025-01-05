import { Module } from "@nestjs/common";
import { LectureService } from "./lecture.service";
import { LectureController } from "./lecture.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { LectureRepository } from "./lecture.repository";
import { TaskRepository } from "@/task/task.repository";
import { SemesterRepository } from "@/semester/semester.repository";

@Module({
  imports: [PrismaModule],
  providers: [
    LectureRepository,
    TaskRepository,
    SemesterRepository,
    LectureService,
  ],
  controllers: [LectureController],
})
export class LectureModule {}
