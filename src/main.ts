import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import * as path from 'path';
const cookieParser = require('cookie-parser'); // ✅ ใช้ require() แทน import

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ เปิดใช้ Cookie Parser
  app.use(cookieParser());

  // Enable CORS for Frontend Access
  app.enableCors({
    origin: process.env.FRONTEND_PORT || 'http://localhost:3000', // ✅ เปลี่ยนเป็น Frontend ของคุณ
    credentials: true, // ✅ อนุญาตให้ส่ง Cookies ไปกับ Request
  });

  // Serve Static Files with CORS Headers
  const uploadsPath = path.join(__dirname, '..', 'uploads');
  app.use(
    '/uploads',
    (req, res, next) => {
      res.header(
        'Access-Control-Allow-Origin',
        process.env.FRONTEND_PORT || 'http://localhost:3000',
      ); // Allow all origins
      res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type');
      res.setHeader('Access-Control-Allow-Credentials', 'true'); // ✅ Required for `credentials: "include"`
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

  // await app.listen(process.env.PORT);
  await app.listen(process.env.PORT || 3001);
}

bootstrap();
