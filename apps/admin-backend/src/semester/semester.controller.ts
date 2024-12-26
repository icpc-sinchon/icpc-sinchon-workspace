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

@Controller("semester")
export class SemesterController {
  constructor(private semesterService: SemesterService) {}

  @Get()
  getAllSemester() {
    return this.semesterService.getAllSemesters();
  }

  @Get(":id")
  findSemesterById(@Param("id", ParseIntPipe) id: number) {
    return this.semesterService.findSemesterById(id);
  }

  @Post()
  createSemester(@Body() createSemesterDto: CreateSemesterDto) {
    return this.semesterService.createSemester(createSemesterDto);
  }

  @Patch("/:id")
  updateSemester(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateSemesterDto: UpdateSemesterDto,
  ) {
    return this.semesterService.updateSemester(id, updateSemesterDto);
  }

  @Delete("/:id")
  deleteSemester(@Param("id", ParseIntPipe) id: number) {
    return this.semesterService.removeSemester(id);
  }
}
