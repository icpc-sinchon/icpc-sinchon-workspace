import { Module } from "@nestjs/common";
import { SemesterModule } from "./semester/semester.module";
import { LectureModule } from "./lecture/lecture.module";
import { TaskModule } from "./task/task.module";
import { ProblemModule } from "./problem/problem.module";
import { StudentModule } from "./student/student.module";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [
    SemesterModule,
    LectureModule,
    TaskModule,
    ProblemModule,
    StudentModule,
    AuthModule,
  ],
})
export class AppModule {}
