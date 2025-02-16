import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true, // ปฏิเสธข้อมูลที่มี properties ที่ไม่รู้จัก
      // whitelist: true, // ลบ properties ที่ไม่รู้จักออกจาก DTO
      transform: true, // แปลงข้อมูลให้ตรงกับประเภทที่กำหนดใน DTO
    }),
  );

  app.enableCors({
    origin: 'http://localhost:3000', // อนุญาตเฉพาะ Nuxt frontend
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
