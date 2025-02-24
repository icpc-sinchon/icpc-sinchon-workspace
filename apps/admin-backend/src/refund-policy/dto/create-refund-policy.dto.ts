import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsEnum, IsNotEmpty, IsPositive } from "class-validator";
import { RefundType } from "@prisma/client";

export class CreateRefundPolicyDto {
  @ApiProperty({ description: "환급 유형 (LECTURE 또는 TASK)", enum: RefundType })
  @IsEnum(RefundType)
  @IsNotEmpty()
  type: RefundType;

  @ApiProperty({ description: "환급을 받기 위한 최소 출석(또는 과제 수행) 횟수" })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  minAttend: number;

  @ApiProperty({ description: "해당 조건이 적용되는 최대 출석(또는 과제 수행) 횟수" })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  maxAttend: number;

  @ApiProperty({ description: "환급되는 금액의 비율 (예: 50은 50% 환급)" })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  refundAmount: number;

  @ApiProperty({ description: "해당 환급 정책이 적용되는 학기의 ID" })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  semesterId: number;
}
