import { ApiProperty } from "@nestjs/swagger";
import { RefundPolicy, RefundType } from "@prisma/client";

export class RefundPolicyEntity implements RefundPolicy {
  @ApiProperty({ description: "고유 ID 값" })
  id: number;

  @ApiProperty({ description: "환급 유형 (LECTURE 또는 TASK)", enum: RefundType })
  type: RefundType;

  @ApiProperty({ description: "해당 환급조건의 최소 출석 횟수" })
  minAttend: number;

  @ApiProperty({ description: "해당 환급조건의 최대 출석 횟수" })
  maxAttend: number;

  @ApiProperty({ description: "환급되는 금액의 비율" })
  refundAmount: number;

  @ApiProperty({ description: "해당 환급 정책이 적용되는 학기의 ID" })
  semesterId: number;
}
