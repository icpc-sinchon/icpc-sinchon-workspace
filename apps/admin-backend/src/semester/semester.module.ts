import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SemesterRepository } from './semester.repository';

@Module({
  imports: [PrismaModule],
  providers: [SemesterRepository],
 })
export class SemesterModule {}