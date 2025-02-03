import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { LectureRepository } from "@/lecture/lecture.repository";
import { TaskRepository } from "./task.repository";
import { TaskService } from "./task.service";
import { TaskController } from "./task.controller";
import { ProblemRepository } from "@/problem/problem.repository";

@Module({
  imports: [PrismaModule],
  providers: [TaskRepository, ProblemRepository, TaskService, LectureRepository],
  controllers: [TaskController],
})
export class TaskModule {}
