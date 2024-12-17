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
import { LectureService } from "./lecture.service";
import { CreateLectureDto } from "./dto/create-lecture.dto";
import { UpdateLectureDto } from "./dto/update-lecture.dto";
import { Season } from "@prisma/client";

@Controller("lecture")
export class LectureController {
  constructor(private readonly lectureService: LectureService) {}

  @Get()
  findLectures(
    @Query("year", ParseIntPipe) year: number,
    @Query("season") season: Season,
  ) {
    return this.lectureService.findLecturesWithTasksBySemester(year, season);
  }

  @Post()
  createLecture(@Body() createLectureDto: CreateLectureDto) {
    return this.lectureService.createLecture(createLectureDto);
  }

  @Patch(":id")
  updateLecture(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateLectureDto: UpdateLectureDto,
  ) {
    return this.lectureService.updateLecture(id, updateLectureDto);
  }

  @Delete(":id")
  removeLecture(@Param("id", ParseIntPipe) id: number) {
    return this.lectureService.removeLecture(id);
  }
}
