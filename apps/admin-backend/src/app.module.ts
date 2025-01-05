import { Module } from "@nestjs/common";
import { SemesterModule } from "./semester/semester.module";
import { LectureModule } from "./lecture/lecture.module";
import { TaskModule } from "./task/task.module";

@Module({
  imports: [SemesterModule, LectureModule, TaskModule],
})
export class AppModule {}
