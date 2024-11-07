import { Body, Controller, Get, Post } from '@nestjs/common';
import type { Semester } from '@prisma/client';
import type { SemesterService } from './semester.service';
import type { CreateSemesterDto } from './dto/create-semester.dto';

@Controller('semester')
export class SemesterController {
  constructor(private semesterService: SemesterService) {}

  @Get()
  getAllSemester(): Promise<Semester[]> {
    return this.semesterService.getSemesters();
  }

  @Post()
  createSemester(
    @Body() createSemesterDto: CreateSemesterDto
  ): Promise<Semester> {
    return this.semesterService.createSemester(createSemesterDto)
  }
}