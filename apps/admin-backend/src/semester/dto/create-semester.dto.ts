import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsEnum, IsNotEmpty, IsPositive } from "class-validator";
import { Season } from "@prisma/client";

export class CreateSemesterDto {
  @ApiProperty({
    description: "해당 학기가 속한 연도 (예: 2024)",
    example: 2024,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  year: number;

  @ApiProperty({
    description: "해당 학기가 속한 계절 (Spring, Summer, Fall, Winter 중 하나)",
    enum: Season,
    example: Season.Summer,
  })
  @IsEnum(Season)
  @IsNotEmpty()
  season: Season;
}
