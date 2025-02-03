import { ApiProperty } from "@nestjs/swagger";
import {
  IsInt,
  IsEnum,
  IsNotEmpty,
  IsEmail,
  IsString,
  IsPositive,
} from "class-validator";
import { School, PaymentStatus } from "@prisma/client";
import type { LectureIdentifier } from "../../types";

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
    enum: PaymentStatus,
    description: "학생 납부 상태 (PAID_30000, PAID_60000 중 하나)",
  })
  @IsNotEmpty()
  @IsEnum(PaymentStatus)
  paymentStatus: PaymentStatus;

  @ApiProperty({ description: "환불 계좌" })
  @IsNotEmpty()
  @IsString()
  refundAccount: string;

  @ApiProperty({
    description: "강의 정보",
    type: Object,
    example: {
      year: 2025,
      season: "Winter",
      level: "Novice"
    }
  })
  lectureInfo: LectureIdentifier;
}
