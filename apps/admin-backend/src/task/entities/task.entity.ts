import { ApiProperty } from "@nestjs/swagger";
import { Task } from "@prisma/client";
import { ProblemEntity } from "../../problem/entities/problem.entity";

export class TaskEntity implements Task {
  @ApiProperty({ description: "고유 ID 값" })
  id: number;

  @ApiProperty({ description: "과제가 속한 강의의 회차" })
  round: number;

  @ApiProperty({
    description:
      "해당 강의의 BOJ 그룹 내에서 과제를 나타내는 연습의 ID (BOJ 크롤링 시 사용)",
  })
  practiceId: number;

  @ApiProperty({
    description: "과제에 속한 BOJ 문제 목록",
    type: () => [ProblemEntity],
  })
  problems: ProblemEntity[];

  @ApiProperty({ description: "과제 출석 여부를 판단하기 위한 기준 문제 수" })
  minSolveCount: number;

  @ApiProperty({ description: "과제가 속한 강의의 ID" })
  lectureId: number;
}
