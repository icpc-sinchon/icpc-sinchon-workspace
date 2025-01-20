import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsBoolean, IsNotEmpty, IsPositive } from "class-validator";

export class CreateProblemDto {
  @ApiProperty({ description: "BOJ 문제 번호" })
  @IsInt()
  @IsNotEmpty()
  bojProblemNumber: number;

  @ApiProperty({ description: "필수 문제 여부" })
  @IsBoolean()
  @IsNotEmpty()
  essential: boolean;

  @ApiProperty({ description: "과제 ID (Task의 id 값)" })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  taskId: number;
}
