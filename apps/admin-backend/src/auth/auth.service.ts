import { PrismaService } from "@/prisma/prisma.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async allUsers() {
    return this.prisma.admin.findMany();
  }

  async login(
    username: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.prisma.admin.findUnique({
      where: { username },
    });
    const isMatch = bcrypt.compareSync(password, user?.password);
    if (!isMatch) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, username: user.username };
    const result = {
      access_token: await this.jwtService.signAsync(payload),
    };
    return result;
  }
}
