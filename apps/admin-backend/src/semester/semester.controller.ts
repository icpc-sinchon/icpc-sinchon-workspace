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
import { SemesterService } from "./semester.service";
import { CreateSemesterDto } from "./dto/create-semester.dto";
import { UpdateSemesterDto } from "./dto/update-semester.dto";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { SemesterEntity } from "./entities/semester.entity";

@ApiTags("semester")
@Controller("semester")
export class SemesterController {
  constructor(private semesterService: SemesterService) {}

  @Get()
  @ApiOkResponse({
    type: [SemesterEntity],
    description: "모든 학기를 반환합니다.",
  })
  getAllSemester(): Promise<SemesterEntity[]> {
    return this.semesterService.getAllSemesters();
  }

  @Get(":id")
  getSemesterById(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<SemesterEntity | null> {
    return this.semesterService.getSemesterById(id);
  }

  @Post()
  createSemester(
    @Body() createSemesterDto: CreateSemesterDto,
  ): Promise<SemesterEntity> {
    return this.semesterService.createSemester(createSemesterDto);
  }

  @Patch("/:id")
  updateSemester(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateSemesterDto: UpdateSemesterDto,
  ): Promise<SemesterEntity> {
    return this.semesterService.updateSemester(id, updateSemesterDto);
  }

  @Delete("/:id")
  deleteSemester(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<SemesterEntity> {
    return this.semesterService.deleteSemester(id);
  }
}
