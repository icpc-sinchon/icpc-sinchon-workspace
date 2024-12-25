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
import { UpdateTaskDto } from "./dto/update-task.dto";
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
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.taskService.updateTask(id, updateTaskDto);
  }

  @Delete(":id")
  removeTask(@Param("id", ParseIntPipe) id: number) {
    return this.taskService.removeTask(id);
  }
}
