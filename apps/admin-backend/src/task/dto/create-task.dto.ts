import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty } from "class-validator";

export class CreateTaskDto {
  @ApiProperty({ description: "강의 회차 (round)" })
  @IsInt()
  @IsNotEmpty()
  round: number;

  @ApiProperty({ description: "BOJ 그룹 내 연습 ID (practiceId)" })
  @IsInt()
  @IsNotEmpty()
  practiceId: number;

  @ApiProperty({ description: "연결된 강의 ID (Lecture의 id 값)" })
  @IsInt()
  @IsNotEmpty()
  lectureId: number;

  @ApiProperty({ description: "출석 여부를 판단하는 최소 문제 해결 수" })
  @IsInt()
  @IsNotEmpty()
  minSolveCount: number;
}
