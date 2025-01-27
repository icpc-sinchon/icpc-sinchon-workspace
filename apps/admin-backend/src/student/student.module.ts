import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { StudentRepository } from "./student.repository";
import { StudentService } from "./student.service";
import { StudentController } from "./student.controller";

@Module({
  imports: [PrismaModule],
  providers: [StudentRepository, StudentService],
  controllers: [StudentController],
})
export class StudentModule {}
