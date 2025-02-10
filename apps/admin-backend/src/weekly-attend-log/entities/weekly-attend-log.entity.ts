import { ApiProperty } from "@nestjs/swagger";
import { WeeklyAttendLog } from "@prisma/client";

export class WeeklyAttendLogEntity implements WeeklyAttendLog {
  @ApiProperty({ description: "고유 ID 값" })
  id: number;

  @ApiProperty({ description: "강의가 몇 번째 회차인지" })
  round: number;

  @ApiProperty({ description: "학생이 해당 회차의 강의에 출석했는지 여부. 기본값은 false" })
  lectureDone: boolean;

  @ApiProperty({ description: "학생이 해당 회차의 과제를 했는지 여부. 기본값은 false" })
  taskDone: boolean;

  @ApiProperty({ description: "학생 ID" })
  studentId: number;

  @ApiProperty({ description: "강의 ID" })
  lectureId: number;
}
