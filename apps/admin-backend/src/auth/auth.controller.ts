import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get("users")
  allUsers() {
    return this.authService.allUsers();
  }

  @HttpCode(HttpStatus.OK)
  @Post("login")
  signIn(@Body() signInDto: Record<string, string>) {
    console.log(signInDto);
    return this.authService.login(signInDto.username, signInDto.password);
  }
}
