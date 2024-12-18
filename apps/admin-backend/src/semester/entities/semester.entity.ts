import { ApiProperty } from "@nestjs/swagger";
import { Season, Semester } from "@prisma/client";

export class SemesterEntity implements Semester {
  id: number;
  year: number;

  @ApiProperty({ enum: Season })
  season: Season;
}
