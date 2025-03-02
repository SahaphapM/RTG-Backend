import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();

    // console.log('Cookies:', req.cookies); // ✅ Debugging
    // console.log('Raw Cookie Header:', req.headers.cookie); // ✅ Debugging

    // ✅ อ่าน JWT Token จาก Cookie
    const token = req.cookies?.access_token;

    if (!token) {
      throw new UnauthorizedException('Unauthorized: No token found');
    }

    try {
      // ✅ ตรวจสอบว่า Token ถูกต้องหรือไม่
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // ✅ เก็บ User ไว้ใน req.user
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
