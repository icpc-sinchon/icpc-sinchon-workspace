import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { StudentLectureLogService } from "./student-lecture-log.service";
import { CreateStudentLectureLogDto } from "./dto/create-student-lecture-log.dto";
import { UpdateStudentLectureLogDto } from "./dto/update-student-lecture-log.dto";

@Controller("student-lecture-log")
export class StudentLectureLogController {
  constructor(
    private readonly studentLectureLogService: StudentLectureLogService
  ) {}

  @Post()
  create(@Body() createStudentLectureLogDto: CreateStudentLectureLogDto) {
    console.log(createStudentLectureLogDto);
    // return this.studentLectureLogService.create(createStudentLectureLogDto);
  }

  @Post("multiple")
  createMultiple(
    @Body() createStudentLectureLogDto: CreateStudentLectureLogDto[]
  ) {
    console.log(createStudentLectureLogDto);
    return this.studentLectureLogService.createMultiple(
      createStudentLectureLogDto
    );
  }

  @Get()
  findAll() {
    return this.studentLectureLogService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.studentLectureLogService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateStudentLectureLogDto: UpdateStudentLectureLogDto
  ) {
    return this.studentLectureLogService.update(
      +id,
      updateStudentLectureLogDto
    );
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.studentLectureLogService.remove(+id);
  }
}
