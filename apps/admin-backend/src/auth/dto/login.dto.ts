import { IsString, IsNotEmpty } from "class-validator";

export class SignInDto {
  @IsString()
  @IsNotEmpty({ message: "Username is required" })
  username: string;

  @IsString()
  @IsNotEmpty({ message: "Password is required" })
  password: string;
}
