import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  UseGuards,
  UnauthorizedException,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Request, Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  // ✅ Login แล้วเก็บ Token ใน Cookie
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request, @Res() res: Response) {
    const token = await this.authService.login(req.user);

    res.cookie('access_token', token.access_token, {
      httpOnly: true, // ❌ ป้องกัน XSS
      secure: true, // ✅ ใช้ HTTPS เท่านั้น
      sameSite: 'strict', // ✅ ป้องกัน CSRF
      maxAge: 1000 * 60 * 60 * 24 * 365, // ✅ Token หมดอายุใน 365 วัน
    });

    return res.send({ message: 'Login successful' });
  }

  // ✅ Logout (ลบ Cookie)
  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('access_token');
    return res.send({ message: 'Logout successful' });
  }

  @UseGuards(JwtAuthGuard) // ✅ Protect this route with JWT Authentication
  @Get('me')
  async getUser(@Req() req: any) {
    if (req.user) {
      // const user = await this.userService.findByEmail(req.user.email);
      console.log(req.user);
      const user = await this.userService.findById(req.user.sub);
      delete user.password;
      delete user.createdAt;
      delete user.updatedAt;
      return user;
    } else {
      throw new UnauthorizedException('Unauthorized: No user found');
    }
  }
}
