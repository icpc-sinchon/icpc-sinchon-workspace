import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SemesterModule } from './semester/semester.module';

@Module({
  imports: [
    SemesterModule
  ]
})
export class AppModule {}