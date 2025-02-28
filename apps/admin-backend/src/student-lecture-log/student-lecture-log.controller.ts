import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from "@nestjs/common";
import { StudentLectureLogService } from "./student-lecture-log.service";
import { CreateStudentLectureLogDto } from "./dto/create-student-lecture-log.dto";
import { UpdateStudentLectureLogDto } from "./dto/update-student-lecture-log.dto";
import { AuthGuard } from "@/auth/auth.guard";

@Controller("student-lecture-log")
@UseGuards(AuthGuard)
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

  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateStudentLectureLogDto: UpdateStudentLectureLogDto
  ) {
    return this.studentLectureLogService.update(
      +id,
      updateStudentLectureLogDto
    );
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.studentLectureLogService.remove(+id);
  }
}
