import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { jwtConstants } from "./constants";
import { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromCookie(request);
    console.log("token", token);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      console.log("payload", payload);
      request.user = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  // 쿠키에서 토큰 추출하는 메서드
  private extractTokenFromCookie(request: Request): string | undefined {
    return request.cookies?.accessToken;
  }
}
