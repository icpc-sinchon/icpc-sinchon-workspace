import { ApiProperty } from "@nestjs/swagger";
import { Lecture, Level, Semester, Task } from "@prisma/client";

export class LectureEntity implements Lecture {
  @ApiProperty({ description: "고유 ID 값" })
  id: number;

  @ApiProperty({
    enum: Level,
    description: "강의 난이도. 초급, 중급, 고급 중 하나",
  })
  level: Level;

  @ApiProperty({ description: "강의의 총 회차수. 기본값은 10회차" })
  lectureNumber: number;

  @ApiProperty({
    description:
      "강의에 연계된 BOJ 그룹 ID. 학생의 과제 출석체크를 위한 크롤링에 쓰임",
  })
  bojGroupId: number;

  @ApiProperty({ description: "강의가 속한 학기의 ID" })
  semesterId: number;
}
