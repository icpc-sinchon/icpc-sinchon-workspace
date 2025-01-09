import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from "@nestjs/common";
import { TaskService } from "./task.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskEntity } from "./entities/task.entity";
import type { Prisma } from "@prisma/client";

@Controller("task")
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get(":id")
  findTaskById(@Param("id", ParseIntPipe) id: number): Promise<TaskEntity> {
    return this.taskService.findTaskById(id);
  }

  @Get()
  findTasksByLecture(
    @Query("lectureId", ParseIntPipe) lectureId: number,
  ): Promise<TaskEntity[]> {
    return this.taskService.findTasksByLectureId(lectureId);
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Promise<TaskEntity> {
    return this.taskService.createTask(createTaskDto);
  }

  @Patch(":id")
  updateTask(
    @Param("id", ParseIntPipe) id: number,
    @Body()
    updateData: {
      minSolveCount: number;
      practiceId: number;
      problems: Prisma.ProblemCreateManyInput[];
    },
  ): Promise<TaskEntity> {
    return this.taskService.updateTask(id, updateData);
  }

  @Delete(":id")
  removeTask(@Param("id", ParseIntPipe) id: number): Promise<TaskEntity> {
    return this.taskService.removeTask(id);
  }
}
