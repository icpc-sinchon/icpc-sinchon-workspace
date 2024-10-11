import { Module } from '@nestjs/common';
import { TestController } from './test/test.controller';

@Module({

  controllers: [TestController]
})
export class AppModule {}
