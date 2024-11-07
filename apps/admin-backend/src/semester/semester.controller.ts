import { Controller, Get, Post } from '@nestjs/common';
import type { Semester } from "@prisma/client";
import type { SemesterService } from './semester.service';

@Controller('semester')
export class SemesterController {
  constructor(private semesterService: SemesterService) {}

  @Get()
  getAllSemester(): Promise<Semester[]> {
    return this.semesterService.getSemesters();
  }
}
