import { ApiProperty } from "@nestjs/swagger";
import { Lecture, Level } from "@prisma/client";

export class LectureEntity implements Lecture {
  id: number;
  @ApiProperty({ enum: Level })
  level: Level;
  lectureNumber: number;
  bojGroupId: number;
  semesterId: number;
}
