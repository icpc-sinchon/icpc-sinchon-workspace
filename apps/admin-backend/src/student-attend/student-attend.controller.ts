import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Query,
  ParseIntPipe,
  UseGuards,
} from "@nestjs/common";
import { StudentAttendService } from "./student-attend.service";
import { UpdateAttendanceDto } from "./dto/update-student-attend.dto";
import { Lecture } from "@prisma/client";
import { AuthGuard } from "@/auth/auth.guard";

@Controller("student-attend")
@UseGuards(AuthGuard)
export class StudentAttendController {
  constructor(private readonly studentAttendService: StudentAttendService) {}

  @Get()
  findAllStudent(
    @Query("semesterId", ParseIntPipe) semesterId: number,
    @Query("lectureLevel") lectureLevel: Lecture["level"]
  ) {
    console.log("semesterId", semesterId);
    console.log("lectureLevel", lectureLevel);
    return this.studentAttendService.findAllStudentsAttendLogsInLecture(
      semesterId,
      lectureLevel
    );
  }

  @Patch("multiple")
  async bulkUpdateAttendance(@Body("updates") dto: UpdateAttendanceDto[]) {
    console.log("bulk update attendance", dto);
    return this.studentAttendService.updateMultipleAttendance(dto);
  }

  @Post("boj")
  async scrapBoj(
    @Body("taskId", ParseIntPipe) taskId: number,
    @Body("bojGroupId", ParseIntPipe) bojGroupId: number,
    @Body("practiceId", ParseIntPipe) practiceId: number
  ) {
    // const bojUrl = `https://www.acmicpc.net/group/practice/view/${bojGroupId}/${practiceId}`;
    const result = await this.studentAttendService.getStudentAttendances(
      taskId,
      bojGroupId,
      practiceId
    );
    return result;
  }
}
