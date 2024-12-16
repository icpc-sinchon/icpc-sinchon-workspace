import { ApiProperty } from "@nestjs/swagger";
import { Level } from "@prisma/client";
import { IsInt, IsOptional, IsEnum, IsPositive } from "class-validator";

export class CreateLectureDto {
  @ApiProperty({ enum: Level })
  @IsEnum(Level)
  level: Level;

  @IsOptional()
  @IsInt()
  @IsPositive()
  lectureNumber?: number;

  @IsInt()
  bojGroupId: number;

  @IsInt()
  @IsPositive()
  semesterId: number;
}
