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
import type { Prisma } from "@prisma/client";

@Controller("task")
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get(":id")
  findTaskById(@Param("id", ParseIntPipe) id: number) {
    return this.taskService.findTaskById(id);
  }

  @Get()
  findTasksByLecture(
    @Query("lectureId", ParseIntPipe) lectureId: number,
  ) {
    return this.taskService.findTasksByLectureId(lectureId);
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto) {
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
  ) {
    this.taskService.updateTask(id, updateData);
  }

  @Delete(":id")
  removeTask(@Param("id", ParseIntPipe) id: number) {
    return this.taskService.removeTask(id);
  }
}
