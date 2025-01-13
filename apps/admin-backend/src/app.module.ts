import { Module } from "@nestjs/common";
import { SemesterModule } from "./semester/semester.module";
import { LectureModule } from "./lecture/lecture.module";
import { TaskModule } from "./task/task.module";
import { ProblemModule } from "./problem/problem.module";

@Module({
  imports: [SemesterModule, LectureModule, TaskModule, ProblemModule],
})
export class AppModule {}
