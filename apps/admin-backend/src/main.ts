import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { writeFileSync } from "node:fs";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle("Sinchon Admin Backend")
    .setDescription("신촌연합 관리자 페이지 API 문서")
    .setVersion("1.0")
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  writeFileSync("swagger.json", JSON.stringify(documentFactory(), null, 2));
  SwaggerModule.setup("api-docs", app, documentFactory);

  await app.listen(3000);
}
bootstrap();
