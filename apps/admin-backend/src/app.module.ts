import { Module } from "@nestjs/common";
import { SemesterModule } from "./semester/semester.module";
import { LectureModule } from './lecture/lecture.module';

@Module({
  imports: [SemesterModule, LectureModule],
})
export class AppModule {}
