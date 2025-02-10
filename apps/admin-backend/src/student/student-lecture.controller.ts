import {
  Controller,
  Body,
  Param,
  Get,
  Post,
  ParseIntPipe,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiOperation,
} from "@nestjs/swagger";
import { Season } from "@prisma/client";
import { CreateStudentLectureDto } from "./dto/create-student-lecture.dto";
import { StudentEntity } from "./entities/student.entity";
import { StudentLectureLogEntity } from "../student-lecture-log/entities/student-lecture-log.entity";
import { StudentLectureService } from "./student-lecture.service";

@ApiTags("StudentLecture")
@Controller("student-lecture")
export class StudentLectureController {
  constructor(private readonly studentLectureService: StudentLectureService) {}

  @Get("semester/:year/:season")
  @ApiOperation({ summary: "특정 학기의 수강생 목록 조회" })
  @ApiOkResponse({
    type: [StudentEntity],
    description: "해당 학기에 수강 중인 학생 목록을 반환합니다.",
  })
  @ApiBadRequestResponse({
    description: "학생울 조회하는 데 실패했습니다.",
  })
  getStudentsWithLectureLevelsBySemester(
    @Param("year", ParseIntPipe) year: number,
    @Param("season") season: Season,
  ): Promise<StudentEntity[]> {
    return this.studentLectureService.getStudentsWithLectureLevelsBySemester(
      year,
      season,
    );
  }

  @Post()
  @ApiOperation({ summary: "새로운 학생과 강의 로그 생성" })
  @ApiCreatedResponse({
    description: "새로운 학생과 강의 로그를 생성합니다.",
  })
  @ApiBadRequestResponse({
    description: "학생 생성에 실패했습니다.",
  })
  createStudentWithLectureLog(
    @Body() createStudentLectureDto: CreateStudentLectureDto,
  ): Promise<StudentEntity | StudentLectureLogEntity> {
    const { lectureInfo, studentLectureLogInfo, ...studentData } =
      createStudentLectureDto;
    return this.studentLectureService.createStudentWithLectureLog(
      studentData,
      lectureInfo,
      studentLectureLogInfo,
    );
  }

  @Post("/multiple")
  @ApiOperation({ summary: "새로운 여러 학생과 강의 로그 생성" })
  @ApiCreatedResponse({
    description: "새로운 여러 학생과 강의 로그를 생성합니다.",
  })
  @ApiBadRequestResponse({
    description: "학생 생성에 실패했습니다.",
  })
  async createMultipleStudents(
    @Body() createStudentLectureDto: CreateStudentLectureDto[],
  ): Promise<void> {
    const formattedStudents = createStudentLectureDto.map((student) => {
      const { lectureInfo, studentLectureLogInfo, ...rest } = student;
      return {
        student: rest,
        lectureInfo,
        studentLectureLogInfo,
      };
    });
    await this.studentLectureService.createStudentsWithLectureLog(
      formattedStudents,
    );
  }
}
