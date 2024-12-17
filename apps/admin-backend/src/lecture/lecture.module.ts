import { Module } from "@nestjs/common";
import { LectureService } from "./lecture.service";
import { LectureController } from "./lecture.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { LectureRepository } from "./lecture.repository";

@Module({
  imports: [PrismaModule],
  controllers: [LectureController],
  providers: [LectureRepository, LectureService],
})
export class LectureModule {}
