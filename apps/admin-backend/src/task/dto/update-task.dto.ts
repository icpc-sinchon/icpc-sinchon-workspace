import { PartialType } from "@nestjs/swagger";
import { CreateTaskDto } from "./create-task.dto";
import { CreateProblemDto } from "../../problem/dto/create-problem.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiProperty({
    description: "문제 배열 (BOJ 문제 정보)",
    type: [CreateProblemDto],
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProblemDto)
  problems?: CreateProblemDto[];
}
