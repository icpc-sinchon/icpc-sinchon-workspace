import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { ProblemRepository } from "./problem.repository";
import { ProblemService } from "./problem.service";
import { ProblemController } from "./problem.controller";

@Module({
  imports: [PrismaModule],
  providers: [ProblemRepository, ProblemService],
  controllers: [ProblemController],
})
export class ProblemModule {}
