import { Season } from "@icpc-sinchon/shared";
import { IsInt, IsEnum, IsNotEmpty } from "class-validator";

export class CreateSemesterDto {
  @IsInt()
  @IsNotEmpty()
  year: number;

  @IsEnum(Season)
  @IsNotEmpty()
  season: Season;
}
