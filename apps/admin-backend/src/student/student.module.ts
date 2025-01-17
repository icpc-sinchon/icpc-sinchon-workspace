import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { StudentRepository } from "./student.repository";
import { StudentService } from "./student.service";

@Module({
  imports: [PrismaModule],
  providers: [StudentRepository, StudentService],
  controllers: [],
})
export class StudentModule {}
