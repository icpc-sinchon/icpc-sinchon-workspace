import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { TaskRepository } from "./task.repository";
import { TaskService } from "./task.service";
import { TaskController } from "./task.controller";
import { ProblemRepository } from "@/problem/problem.repository";

@Module({
  imports: [PrismaModule],
  providers: [TaskRepository, ProblemRepository, TaskService],
  controllers: [TaskController],
})
export class TaskModule {}
