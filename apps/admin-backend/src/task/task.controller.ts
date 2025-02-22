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
  ApiOperation,
} from "@nestjs/swagger";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { TaskEntity } from "./entities/task.entity";
import { TaskService } from "./task.service";

@ApiTags("Task")
@Controller("task")
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiOperation({ summary: "새로운 과제 생성" })
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

  @Get()
  @ApiOperation({ summary: "특정 강의의 과제 목록 조회" })
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
    description: "과제를 조회하는 데 실패했습니다.",
  })
  getTasksByLecture(
    @Query("lectureId", ParseIntPipe) lectureId: number,
  ): Promise<TaskEntity[]> {
    return this.taskService.getTasksByLectureId(lectureId);
  }

  @Get(":id")
  @ApiOperation({ summary: "특정 과제 조회" })
  @ApiOkResponse({
    type: TaskEntity,
    description: "특정 ID를 가진 과제를 반환합니다.",
  })
  @ApiNotFoundResponse({
    description: "과제를 찾을 수 없습니다.",
  })
  @ApiBadRequestResponse({
    description: "과제를 조회하는 데 실패했습니다.",
  })
  getTaskById(@Param("id", ParseIntPipe) id: number): Promise<TaskEntity> {
    return this.taskService.getTaskById(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "특정 과제 수정" })
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
  @ApiOperation({ summary: "특정 과제 삭제" })
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
  deleteTask(@Param("id", ParseIntPipe) id: number): Promise<TaskEntity> {
    return this.taskService.deleteTask(id);
  }
}
