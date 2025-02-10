import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { TaskRepository } from "@/task/task.repository";
import { ProblemRepository } from "./problem.repository";
import { ProblemService } from "./problem.service";
import { ProblemController } from "./problem.controller";

@Module({
  imports: [PrismaModule],
  providers: [ProblemRepository, ProblemService, TaskRepository],
  controllers: [ProblemController],
})
export class ProblemModule {}
