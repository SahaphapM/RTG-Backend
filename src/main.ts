import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true, // Reject requests with unknown properties
    }),
  );
  app.enableCors({
    origin: 'http://localhost:3000', // Allow Nuxt frontend
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
