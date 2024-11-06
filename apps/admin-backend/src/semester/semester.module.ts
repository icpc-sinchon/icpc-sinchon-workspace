import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SemesterRepository } from './semester.repository';
import { SemesterController } from './semester.controller';
import { SemesterService } from './semester.service';

@Module({
  imports: [PrismaModule],
  providers: [SemesterRepository, SemesterService],
  controllers: [SemesterController],
 })
export class SemesterModule {}