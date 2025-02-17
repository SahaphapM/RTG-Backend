import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for Frontend Access
  app.enableCors({
    origin: 'http://localhost:3000', // Allow Nuxt frontend
    credentials: true,
  });

  // Serve Static Files with CORS Headers
  const uploadsPath = path.join(__dirname, '..', 'uploads');
  app.use(
    '/uploads',
    (req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*'); // Allow all origins
      res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type');
      next();
    },
    express.static(uploadsPath),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 5000);
}

bootstrap();
