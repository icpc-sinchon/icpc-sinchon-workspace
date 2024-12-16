import { Module } from "@nestjs/common";
import { LectureService } from "./lecture.service";
import { LectureController } from "./lecture.controller";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [LectureController],
  providers: [LectureService],
})
export class LectureModule {}
