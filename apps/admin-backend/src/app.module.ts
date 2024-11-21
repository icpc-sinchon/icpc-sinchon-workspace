import { Module } from "@nestjs/common";
import { SemesterModule } from "./semester/semester.module";

@Module({
  imports: [SemesterModule],
})
export class AppModule {}
