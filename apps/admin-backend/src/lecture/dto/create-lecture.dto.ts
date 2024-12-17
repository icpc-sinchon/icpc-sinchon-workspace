import { ApiProperty } from "@nestjs/swagger";
import { Level } from "@prisma/client";
import { IsInt, IsOptional, IsEnum, IsPositive } from "class-validator";

export class CreateLectureDto {
  @ApiProperty({
    enum: Level,
    description: "강의 난이도 (Novice, Intermediate, Advanced)",
  })
  @IsEnum(Level)
  level: Level;

  @ApiProperty({ description: "강의 회차수 (기본값: 10)", required: false })
  @IsOptional()
  @IsInt()
  @IsPositive()
  lectureNumber?: number;

  @ApiProperty({ description: "BOJ 그룹 ID" })
  @IsInt()
  bojGroupId: number;

  @ApiProperty({ description: "학기 ID (Semester의 id 값)" })
  @IsInt()
  @IsPositive()
  semesterId: number;
}
