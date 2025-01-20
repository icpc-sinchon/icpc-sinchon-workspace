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
import {
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiQuery,
} from "@nestjs/swagger";
import { TaskService } from "./task.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { TaskEntity } from "./entities/task.entity";
import type { Prisma } from "@prisma/client";

@ApiTags("Task")
@Controller("task")
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get(":id")
  @ApiOkResponse({
    type: TaskEntity,
    description: "특정 ID를 가진 과제를 반환합니다.",
  })
  @ApiNotFoundResponse({
    description: "과제를 찾을 수 없습니다.",
  })
  @ApiBadRequestResponse({
    description: "잘못된 요청입니다.",
  })
  findTaskById(@Param("id", ParseIntPipe) id: number): Promise<TaskEntity> {
    return this.taskService.findTaskById(id);
  }

  @Get()
  @ApiQuery({
    name: "lectureId",
    type: Number,
    description: "조회할 과제가 속한 강의의 ID입니다.",
  })
  @ApiOkResponse({
    type: [TaskEntity],
    description: "특정 강의에 속한 모든 과제를 반환합니다.",
  })
  @ApiBadRequestResponse({
    description: "잘못된 요청입니다.",
  })
  findTasksByLecture(
    @Query("lectureId", ParseIntPipe) lectureId: number,
  ): Promise<TaskEntity[]> {
    return this.taskService.findTasksByLectureId(lectureId);
  }

  @Post()
  @ApiCreatedResponse({
    type: TaskEntity,
    description: "새로운 과제를 생성합니다.",
  })
  @ApiBadRequestResponse({
    description: "과제 생성에 실패했습니다.",
  })
  createTask(@Body() createTaskDto: CreateTaskDto): Promise<TaskEntity> {
    return this.taskService.createTask(createTaskDto);
  }

  @Patch(":id")
  @ApiOkResponse({
    type: TaskEntity,
    description: "특정 ID를 가진 과제를 업데이트합니다.",
  })
  @ApiNotFoundResponse({
    description: "업데이트하려는 과제를 찾을 수 없습니다.",
  })
  @ApiBadRequestResponse({
    description: "과제 업데이트에 실패했습니다.",
  })
  updateTask(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<TaskEntity> {
    return this.taskService.updateTask(id, updateTaskDto);
  }

  @Delete(":id")
  @ApiOkResponse({
    type: TaskEntity,
    description: "특정 ID를 가진 과제를 삭제합니다.",
  })
  @ApiNotFoundResponse({
    description: "삭제하려는 과제를 찾을 수 없습니다.",
  })
  @ApiBadRequestResponse({
    description: "과제 삭제에 실패했습니다.",
  })
  removeTask(@Param("id", ParseIntPipe) id: number): Promise<TaskEntity> {
    return this.taskService.removeTask(id);
  }
}
