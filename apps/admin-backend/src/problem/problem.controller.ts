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
import { ProblemService } from "./problem.service";
import { CreateProblemDto } from "./dto/create-problem.dto";
import { UpdateProblemDto } from "./dto/update-problem.dto";
import { ProblemEntity } from "./entities/problem.entity";

@Controller("problem")
export class ProblemController {
  constructor(private readonly problemService: ProblemService) {}

  @Get()
  findProblemsByTask(
    @Query("taskId", ParseIntPipe) taskId: number,
  ): Promise<ProblemEntity[]> {
    return this.problemService.findProblemsByTaskId(taskId);
  }

  @Post()
  createProblem(
    @Body() createProblemDto: CreateProblemDto,
  ): Promise<ProblemEntity> {
    return this.problemService.createProblem(createProblemDto);
  }

  @Patch(":id")
  updateProblem(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateProblemDto: UpdateProblemDto,
  ): Promise<ProblemEntity> {
    return this.problemService.updateProblem(id, updateProblemDto);
  }

  @Delete(":id")
  removeProblem(@Param("id", ParseIntPipe) id: number): Promise<ProblemEntity> {
    return this.problemService.removeProblem(id);
  }
}
