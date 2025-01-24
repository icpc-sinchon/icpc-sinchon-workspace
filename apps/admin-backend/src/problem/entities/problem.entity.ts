import { ApiProperty } from "@nestjs/swagger";
import { Problem } from "@prisma/client";

export class ProblemEntity implements Problem {
  @ApiProperty({ description: "고유 ID 값" })
  id: number;

  @ApiProperty({ description: "문제의 BOJ 번호" })
  bojProblemNumber: number;

  @ApiProperty({
    description: "해당 문제가 과제의 필수 문제인지 여부. 기본값은 true",
  })
  essential: boolean;

  @ApiProperty({ description: "해당 문제가 속한 과제의 ID" })
  taskId: number;
}
