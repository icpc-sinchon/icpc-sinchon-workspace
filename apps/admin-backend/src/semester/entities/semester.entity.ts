import { ApiProperty } from "@nestjs/swagger";
import { Semester, Season } from "@prisma/client";

export class SemesterEntity implements Semester {
  @ApiProperty({ description: "고유 ID 값" })
  id: number;

  @ApiProperty({ description: "해당 학기가 속한 연도. ex) 2024" })
  year: number;

  @ApiProperty({
    enum: Season,
    description: "해당 학기가 속한 계절. ex) Summer",
  })
  season: Season;
}
