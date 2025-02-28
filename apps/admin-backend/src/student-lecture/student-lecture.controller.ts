import {
  Controller,
  Get,
  ParseIntPipe,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiOperation,
} from "@nestjs/swagger";
import { Season } from "@prisma/client";
import { StudentLectureService } from "./student-lecture.service";
import { StudentEntity } from "@/student/entities/student.entity";
import { AuthGuard } from "@/auth/auth.guard";

@ApiTags("StudentLecture")
@Controller("student-lecture")
@UseGuards(AuthGuard)
export class StudentLectureController {
  constructor(private readonly studentLectureService: StudentLectureService) {}

  @Get()
  @ApiOperation({ summary: "특정 학기의 수강생 목록 조회" })
  @ApiOkResponse({
    type: [StudentEntity],
    description: "해당 학기에 수강 중인 학생 목록을 반환합니다.",
  })
  @ApiBadRequestResponse({
    description: "학생을 조회하는 데 실패했습니다.",
  })
  getStudentsWithLectureLevelsBySemester(
    @Query("year", ParseIntPipe) year: number,
    @Query("season") season: Season
  ): Promise<StudentEntity[]> {
    return this.studentLectureService.getStudentsWithLectureLevelsBySemester(
      year,
      season
    );
  }
}
