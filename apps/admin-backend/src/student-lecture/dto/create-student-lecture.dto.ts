import { ApiProperty } from "@nestjs/swagger";
import {
  IsInt,
  IsEnum,
  IsNotEmpty,
  IsEmail,
  IsString,
  IsPositive,
} from "class-validator";
import { Prisma, School } from "@prisma/client";

export class CreateStudentLectureDto {
  @ApiProperty({ description: "학생 이름 (최대 50자)" })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: "BOJ 핸들 (최대 50자, 고유값)" })
  @IsNotEmpty()
  @IsString()
  bojHandle: string;

  @ApiProperty({ description: "학생 이메일" })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: "학생 전화번호 (최대 20자)" })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({
    enum: School,
    description: "학생 학교 (YONSEI, SOGANG, HONGIK, EWHA, SOOKMYUNG 중 하나)",
  })
  @IsNotEmpty()
  @IsEnum(School)
  school: School;

  @ApiProperty({ description: "학생 학번 (최대 20자)" })
  @IsNotEmpty()
  @IsString()
  studentNumber: string;

  @ApiProperty({
    description: "강의 정보",
    type: Object,
    example: {
      year: 2025,
      season: "Winter",
      level: "Novice",
    },
  })
  lectureInfo: Prisma.StudentLectureLogCreateInput;
}
