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
import { SemesterEntity } from "./entities/semester.entity";

@Controller("semester")
export class SemesterController {
  constructor(private semesterService: SemesterService) {}

  @Get()
  getAllSemester(): Promise<SemesterEntity[]> {
    return this.semesterService.getAllSemesters();
  }

  @Get(":id")
  findSemesterById(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<SemesterEntity> {
    return this.semesterService.findSemesterById(id);
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
    return this.semesterService.removeSemester(id);
  }
}
