import { Controller, Post, Body, HttpCode, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { User } from 'src/users/user.entity';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async signUp(@Body() user: User) {
    const resData = await this.authService.signUp(user);
    return { message: 'User created successfully', user: resData };
  }

  @Post('login')
  @HttpCode(200)
  async signIn(@Body() user: User) {
    const resData = await this.authService.signIn(user);
    return { message: 'User logged in successfully', user: resData };
  }

  @Get('refresh-token')
  @HttpCode(200)
  async refreshToken(@Req() req: Request) {
    const refreshToken = req.headers['x-refresh-token'] as string;
    // console.log(refreshToken);
    const resData = await this.authService.refreshToken(refreshToken);
    return { message: 'Token refreshed successfully', user: resData };
  }
}
