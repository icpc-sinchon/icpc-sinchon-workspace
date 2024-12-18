import { ApiProperty } from "@nestjs/swagger";
import { Prisma, Season } from "@prisma/client";
import { IsInt, IsEnum, IsNotEmpty } from "class-validator";

export class CreateSemesterDto implements Prisma.SemesterCreateInput {
  @IsInt()
  @IsNotEmpty()
  year: number;

  @IsEnum(Season)
  @IsNotEmpty()
  @ApiProperty({ enum: Season })
  season: Season;
}
