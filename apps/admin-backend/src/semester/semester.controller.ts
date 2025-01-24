import {
  Controller,
  Body,
  Param,
  Get,
  Post,
  Patch,
  Delete,
  ParseIntPipe,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from "@nestjs/swagger";
import { SemesterService } from "./semester.service";
import { CreateSemesterDto } from "./dto/create-semester.dto";
import { UpdateSemesterDto } from "./dto/update-semester.dto";
import { SemesterEntity } from "./entities/semester.entity";

@ApiTags("Semester")
@Controller("semester")
export class SemesterController {
  constructor(private readonly semesterService: SemesterService) {}

  @Get()
  @ApiOkResponse({
    type: [SemesterEntity],
    description: "모든 학기를 반환합니다.",
  })
  getAllSemester(): Promise<SemesterEntity[]> {
    return this.semesterService.getAllSemesters();
  }

  @Get(":id")
  @ApiOkResponse({
    type: SemesterEntity,
    description: "특정 ID를 가진 학기를 반환합니다.",
  })
  @ApiNotFoundResponse({
    description: "학기를 찾을 수 없습니다.",
  })
  findSemesterById(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<SemesterEntity> {
    return this.semesterService.getSemesterById(id);
  }

  @Post()
  @ApiCreatedResponse({
    type: SemesterEntity,
    description: "새로운 학기를 생성합니다.",
  })
  @ApiBadRequestResponse({
    description: "학기 생성에 실패했습니다.",
  })
  createSemester(
    @Body() createSemesterDto: CreateSemesterDto,
  ): Promise<SemesterEntity> {
    return this.semesterService.createSemester(createSemesterDto);
  }

  @Patch("/:id")
  @ApiOkResponse({
    type: SemesterEntity,
    description: "특정 ID를 가진 학기를 업데이트합니다.",
  })
  @ApiNotFoundResponse({
    description: "업데이트하려는 학기를 찾을 수 없습니다.",
  })
  @ApiBadRequestResponse({
    description: "학기 업데이트에 실패했습니다.",
  })
  updateSemester(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateSemesterDto: UpdateSemesterDto,
  ): Promise<SemesterEntity> {
    return this.semesterService.updateSemester(id, updateSemesterDto);
  }

  @Delete("/:id")
  @ApiOkResponse({
    type: SemesterEntity,
    description: "특정 ID를 가진 학기를 삭제합니다.",
  })
  @ApiNotFoundResponse({
    description: "삭제하려는 학기를 찾을 수 없습니다.",
  })
  @ApiBadRequestResponse({
    description: "학기 삭제에 실패했습니다.",
  })
  deleteSemester(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<SemesterEntity> {
    return this.semesterService.deleteSemester(id);
  }
}
