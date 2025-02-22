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
import {
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiQuery,
  ApiOperation,
} from "@nestjs/swagger";
import { Season } from "@prisma/client";
import { CreateLectureDto } from "./dto/create-lecture.dto";
import { UpdateLectureDto } from "./dto/update-lecture.dto";
import { LectureEntity } from "./entities/lecture.entity";
import { LectureService } from "./lecture.service";

@ApiTags("Lecture")
@Controller("lecture")
export class LectureController {
  constructor(private readonly lectureService: LectureService) {}

  @Post()
  @ApiOperation({ summary: "새로운 강의 생성" })
  @ApiCreatedResponse({
    type: LectureEntity,
    description: "새로운 강의를 생성합니다.",
  })
  @ApiBadRequestResponse({
    description: "강의 생성에 실패했습니다.",
  })
  createLecture(
    @Body() createLectureDto: CreateLectureDto,
  ): Promise<LectureEntity> {
    return this.lectureService.createLectureWithTasks(createLectureDto);
  }

  @Get()
  @ApiOperation({ summary: "특정 학기의 강의 목록 조회" })
  @ApiQuery({
    name: "year",
    type: Number,
    description: "조회할 강의가 속한 학기의 연도입니다.",
  })
  @ApiQuery({
    name: "season",
    enum: Season,
    description: "조회할 강의가 속한 학기의 학기(예: Summer, Winter)입니다.",
  })
  @ApiOkResponse({
    type: [LectureEntity],
    description: "특정 학기와 학기에 속한 강의를 반환합니다.",
  })
  @ApiBadRequestResponse({
    description: "강의를 조회하는 데 실패했습니다.",
  })
  getLectures(
    @Query("year", ParseIntPipe) year: number,
    @Query("season") season: Season,
  ): Promise<LectureEntity[]> {
    return this.lectureService.getLecturesWithTasksBySemester(year, season);
  }

  @Patch(":id")
  @ApiOperation({ summary: "특정 강의 수정" })
  @ApiOkResponse({
    type: LectureEntity,
    description: "특정 ID를 가진 강의를 업데이트합니다.",
  })
  @ApiNotFoundResponse({
    description: "업데이트하려는 강의를 찾을 수 없습니다.",
  })
  @ApiBadRequestResponse({
    description: "강의 업데이트에 실패했습니다.",
  })
  updateLecture(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateLectureDto: UpdateLectureDto,
  ): Promise<LectureEntity> {
    return this.lectureService.updateLecture(id, updateLectureDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "특정 강의 삭제" })
  @ApiOkResponse({
    type: LectureEntity,
    description: "특정 ID를 가진 강의를 삭제합니다.",
  })
  @ApiNotFoundResponse({
    description: "삭제하려는 강의를 찾을 수 없습니다.",
  })
  @ApiBadRequestResponse({
    description: "강의 삭제에 실패했습니다.",
  })
  deleteLecture(@Param("id", ParseIntPipe) id: number): Promise<LectureEntity> {
    return this.lectureService.deleteLecture(id);
  }
}
