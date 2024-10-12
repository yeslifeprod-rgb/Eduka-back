import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
//  app.enableCors();
  app.enableCors({
    origin: "http://localhost:5173", // Autoriser seulement cette origine
    methods: ['GET', 'POST', 'PUT', 'DELETE','OPTIONS'],
    allowedHeaders: "*",
    credentials: true, // Activer les cookies CORS (si nécessaire)
  });

  const config = new DocumentBuilder()
    .setTitle('alt-bootcamp')
    .setDescription('The alt-bootcamp API description')
    .setVersion('0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('apiDoc', app, document);

  await app.listen(3001);
}

bootstrap();
