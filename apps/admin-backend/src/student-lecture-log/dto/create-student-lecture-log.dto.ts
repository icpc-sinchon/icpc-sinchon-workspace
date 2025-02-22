// src/student-lecture-log/dto/create-student-lecture-log.dto.ts
import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
} from "class-validator";
import { Level, RefundOption } from "@prisma/client";
import { Optional } from "@nestjs/common";

export class CreateStudentLectureLogDto {
  @ApiProperty({ example: "city", description: "학생의 boj 핸들" })
  @IsString()
  @IsNotEmpty()
  bojHandle: string;

  @ApiProperty({ example: 2, description: "강의가 소속된 학기의 ID" })
  @IsInt()
  @Min(1)
  semesterId: number;

  @ApiProperty({
    example: "Novice",
    enum: ["Novice", "Advanced", "Expert"],
    description: "강의 레벨",
  })
  @IsEnum(["Novice", "Advanced", "Expert"])
  @IsNotEmpty()
  level: Level;

  @ApiProperty({
    example: "Refund",
    enum: RefundOption,
    description: "환급 옵션 (Refund, NonRefund)",
  })
  @IsEnum(RefundOption)
  refundOption: RefundOption;

  @ApiProperty({ example: "123-4567-8901", description: "환급 계좌 정보" })
  @IsString()
  @IsNotEmpty()
  refundAccount: string;

  @ApiProperty({ example: false, description: "BOJ 그룹 초대 여부" })
  @IsBoolean()
  @Optional()
  isInvited?: boolean;

  @ApiProperty({ example: false, description: "수강신청 취소 여부" })
  @IsBoolean()
  @Optional()
  isCancelled?: boolean;
}
