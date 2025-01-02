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
import { ApiTags } from "@nestjs/swagger";

@ApiTags("task")
@Controller("task")
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  findTasksByLecture(
    @Query("lectureId", ParseIntPipe) lectureId: number,
  ) {
    return this.taskService.findTasksByLecture(lectureId);
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
