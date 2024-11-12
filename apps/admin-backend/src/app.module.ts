import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SemesterModule } from './semester/semester.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'src/.env',
      isGlobal: true,
    }),
    SemesterModule
  ]
})
export class AppModule {}