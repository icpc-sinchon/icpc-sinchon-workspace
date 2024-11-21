import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { SemesterRepository } from "./semester.repository";
import { SemesterService } from "./semester.service";
import { SemesterController } from "./semester.controller";

@Module({
  imports: [PrismaModule],
  providers: [SemesterRepository, SemesterService],
  controllers: [SemesterController],
})
export class SemesterModule {}
