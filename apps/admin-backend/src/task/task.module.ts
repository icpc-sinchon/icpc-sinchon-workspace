import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { TaskRepository } from "./task.repository";
import { TaskService } from "./task.service";
import { TaskController } from "./task.controller";

@Module({
  imports: [PrismaModule],
  providers: [TaskRepository, TaskService],
  controllers: [TaskController],
})
export class TaskModule {}
