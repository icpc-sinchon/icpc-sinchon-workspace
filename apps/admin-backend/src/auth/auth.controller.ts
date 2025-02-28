import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignInDto } from "./dto/login.dto";
import { Response } from "express";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get("users")
  allUsers() {
    return this.authService.allUsers();
  }

  @HttpCode(HttpStatus.OK)
  @Post("login")
  async login(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response
  ) {
    console.log(signInDto);
    const { username, password } = signInDto;
    const loginResult = await this.authService.login(username, password);
    const token = loginResult.accessToken;
    // 쿠키 설정
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      // 1일
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });
    res.json({ success: true, message: "Login successful", token });
  }

  @HttpCode(HttpStatus.OK)
  @Post("logout")
  async logout(@Res({ passthrough: true }) res: Response) {
    // 쿠키 제거
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.json({ success: true, message: "Logout successful" });
  }
}
