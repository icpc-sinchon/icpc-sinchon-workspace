import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
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
import { ProblemService } from "./problem.service";
import { CreateProblemDto } from "./dto/create-problem.dto";
import { UpdateProblemDto } from "./dto/update-problem.dto";
import { ProblemEntity } from "./entities/problem.entity";

@ApiTags("Problem")
@Controller("problem")
export class ProblemController {
  constructor(private readonly problemService: ProblemService) {}

  @Get()
  @ApiQuery({
    name: "taskId",
    type: Number,
    description: "조회할 문제가 속한 과제의 ID입니다.",
  })
  @ApiOkResponse({
    type: [ProblemEntity],
    description: "특정 과제에 속한 모든 문제를 반환합니다.",
  })
  @ApiBadRequestResponse({
    description: "잘못된 요청입니다.",
  })
  findProblemsByTask(
    @Query("taskId", ParseIntPipe) taskId: number,
  ): Promise<ProblemEntity[]> {
    return this.problemService.findProblemsByTaskId(taskId);
  }

  @Post()
  @ApiCreatedResponse({
    type: ProblemEntity,
    description: "새로운 문제를 생성합니다.",
  })
  @ApiBadRequestResponse({
    description: "문제 생성에 실패했습니다.",
  })
  createProblem(
    @Body() createProblemDto: CreateProblemDto,
  ): Promise<ProblemEntity> {
    return this.problemService.createProblem(createProblemDto);
  }

  @Patch(":id")
  @ApiOkResponse({
    type: ProblemEntity,
    description: "특정 ID를 가진 문제를 업데이트합니다.",
  })
  @ApiNotFoundResponse({
    description: "업데이트하려는 문제를 찾을 수 없습니다.",
  })
  @ApiBadRequestResponse({
    description: "문제 업데이트에 실패했습니다.",
  })
  updateProblem(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateProblemDto: UpdateProblemDto,
  ): Promise<ProblemEntity> {
    return this.problemService.updateProblem(id, updateProblemDto);
  }

  @Delete(":id")
  @ApiOkResponse({
    type: ProblemEntity,
    description: "특정 ID를 가진 문제를 삭제합니다.",
  })
  @ApiNotFoundResponse({
    description: "삭제하려는 문제를 찾을 수 없습니다.",
  })
  @ApiBadRequestResponse({
    description: "문제 삭제에 실패했습니다.",
  })
  removeProblem(@Param("id", ParseIntPipe) id: number): Promise<ProblemEntity> {
    return this.problemService.removeProblem(id);
  }
}
