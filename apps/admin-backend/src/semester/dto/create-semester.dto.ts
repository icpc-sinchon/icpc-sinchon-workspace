import { Season } from "@prisma/client";
import { IsInt, IsEnum, IsNotEmpty } from "class-validator";

export class CreateSemesterDto {
  @IsInt()
  @IsNotEmpty()
  year: number;

  @IsEnum(Season)
  @IsNotEmpty()
  season: Season;
}
