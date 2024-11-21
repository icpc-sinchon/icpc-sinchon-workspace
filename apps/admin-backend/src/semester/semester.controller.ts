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
import type { Semester } from "@prisma/client";
import type { CreateSemesterDto } from "./dto/create-semester.dto";
import type { UpdateSemesterDto } from "./dto/update-semester.dto";

@Controller("semester")
export class SemesterController {
  constructor(private semesterService: SemesterService) {}

  @Get()
  getAllSemester(): Promise<Semester[]> {
    return this.semesterService.getSemesters();
  }

  @Get("/:id")
  getSemesterById(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<Semester | null> {
    return this.semesterService.getSemesterById(id);
  }

  @Post()
  createSemester(
    @Body() createSemesterDto: CreateSemesterDto,
  ): Promise<Semester> {
    return this.semesterService.createSemester(createSemesterDto);
  }

  @Patch("/:id")
  updateSemester(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateSemesterDto: UpdateSemesterDto,
  ): Promise<Semester> {
    return this.semesterService.updateSemester(id, updateSemesterDto);
  }

  @Delete("/:id")
  deleteSemester(@Param("id", ParseIntPipe) id: number): Promise<Semester> {
    return this.semesterService.deleteSemester(id);
  }
}
