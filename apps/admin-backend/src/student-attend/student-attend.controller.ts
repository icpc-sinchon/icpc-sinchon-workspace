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
import { StudentAttendService } from "./student-attend.service";
import { CreateStudentAttendDto } from "./dto/create-student-attend.dto";
import { UpdateStudentAttendDto } from "./dto/update-student-attend.dto";
import { Lecture } from "@prisma/client";

@Controller("student-attend")
export class StudentAttendController {
  constructor(private readonly studentAttendService: StudentAttendService) {}

  @Post()
  create(@Body() createStudentAttendDto: CreateStudentAttendDto) {
    return this.studentAttendService.create(createStudentAttendDto);
  }

  @Get()
  findAllStudent(
    @Query("semesterId", ParseIntPipe) semesterId: number,
    @Query("lectureLevel") lectureLevel: Lecture["level"]
  ) {
    return this.studentAttendService.findAllStudentsAttendLogsInLecture(
      semesterId,
      lectureLevel
    );
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.studentAttendService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateStudentAttendDto: UpdateStudentAttendDto
  ) {
    return this.studentAttendService.update(+id, updateStudentAttendDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.studentAttendService.remove(+id);
  }
}
