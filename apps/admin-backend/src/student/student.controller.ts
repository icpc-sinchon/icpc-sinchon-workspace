import {
  Controller,
  Body,
  Param,
  Get,
  Post,
  Patch,
  Delete,
  ParseIntPipe,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiOperation,
  ApiBody,
} from "@nestjs/swagger";
import { CreateStudentDto } from "./dto/create-student.dto";
import { UpdateStudentDto } from "./dto/update-student.dto";
import { StudentEntity } from "./entities/student.entity";
import { StudentService } from "./student.service";
import { AuthGuard } from "@/auth/auth.guard";

@ApiTags("Student")
@Controller("student")
@UseGuards(AuthGuard)
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  @ApiOperation({ summary: "모든 학생 목록 조회" })
  @ApiOkResponse({
    type: [StudentEntity],
    description: "모든 학생을 반환합니다.",
  })
  @ApiBadRequestResponse({
    description: "학생을 조회하는 데 실패했습니다.",
  })
  getAllStudents(): Promise<StudentEntity[]> {
    return this.studentService.getAllStudents();
  }

  @Get(":id")
  @ApiOperation({ summary: "특정 학생 조회" })
  @ApiOkResponse({
    type: StudentEntity,
    description: "특정 ID를 가진 학생을 반환합니다.",
  })
  @ApiNotFoundResponse({
    description: "학생을 찾을 수 없습니다.",
  })
  @ApiBadRequestResponse({
    description: "학생을 조회하는 데 실패했습니다.",
  })
  findStudentById(
    @Param("id", ParseIntPipe) id: number
  ): Promise<StudentEntity> {
    return this.studentService.getStudentById(id);
  }

  @Post()
  @ApiOperation({ summary: "새로운 학생 생성" })
  @ApiCreatedResponse({
    type: StudentEntity,
    description: "새로운 학생을 생성합니다.",
  })
  @ApiBadRequestResponse({
    description: "학생 생성에 실패했습니다.",
  })
  createStudent(
    @Body() createStudentDto: CreateStudentDto
  ): Promise<StudentEntity> {
    return this.studentService.createStudent(createStudentDto);
  }

  @Post("/multiple")
  @ApiOperation({ summary: "여러 학생 생성" })
  @ApiBody({ type: [CreateStudentDto] })
  // createMany는 생성된 레코드의 숫자를 담는 BatchPayload를 반환한다.
  @ApiCreatedResponse({
    schema: {
      type: "object",
      properties: {
        count: { type: "number", example: 10 },
      },
    },
    description: "여러 학생을 생성합니다.",
  })
  @ApiBadRequestResponse({
    description: "학생 생성에 실패했습니다.",
  })
  createManyStudents(@Body() createStudentDtos: CreateStudentDto[]) {
    return this.studentService.createManyStudents(createStudentDtos);
  }

  @Patch("/:id")
  @ApiOperation({ summary: "특정 학생 수정" })
  @ApiOkResponse({
    type: StudentEntity,
    description: "특정 ID를 가진 학생을 업데이트합니다.",
  })
  @ApiNotFoundResponse({
    description: "업데이트하려는 학생을 찾을 수 없습니다.",
  })
  @ApiBadRequestResponse({
    description: "학생 업데이트에 실패했습니다.",
  })
  updateStudent(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateStudentDto: UpdateStudentDto
  ): Promise<StudentEntity> {
    return this.studentService.updateStudent(id, updateStudentDto);
  }

  @Delete("/:id")
  @ApiOperation({ summary: "특정 학생 삭제" })
  @ApiOkResponse({
    type: StudentEntity,
    description: "특정 ID를 가진 학생을 삭제합니다.",
  })
  @ApiNotFoundResponse({
    description: "삭제하려는 학생을 찾을 수 없습니다.",
  })
  @ApiBadRequestResponse({
    description: "학생 삭제에 실패했습니다.",
  })
  deleteStudent(@Param("id", ParseIntPipe) id: number): Promise<StudentEntity> {
    return this.studentService.deleteStudent(id);
  }
}
