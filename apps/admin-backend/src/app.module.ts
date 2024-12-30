import { Module } from "@nestjs/common";
import { SemesterModule } from "./semester/semester.module";
import { LectureModule } from './lecture/lecture.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [SemesterModule, LectureModule, AuthModule],
})
export class AppModule {}
