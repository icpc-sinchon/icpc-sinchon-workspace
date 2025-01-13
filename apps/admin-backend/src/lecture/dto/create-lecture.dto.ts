import { ApiProperty } from "@nestjs/swagger";
import { Level } from "@prisma/client";
import { IsInt, IsNotEmpty, IsEnum, IsPositive } from "class-validator";

export class CreateLectureDto {
  @ApiProperty({
    enum: Level,
    description: "강의 난이도 (Novice, Intermediate, Advanced)",
  })
  @IsNotEmpty()
  @IsEnum(Level)
  level: Level;

  @ApiProperty({ description: "강의 회차수 (기본값: 10)" })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  lectureNumber: number;

  @ApiProperty({ description: "BOJ 그룹 ID" })
  @IsInt()
  @IsNotEmpty()
  bojGroupId: number;

  @ApiProperty({ description: "학기 ID (Semester의 id 값)" })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  semesterId: number;
}
