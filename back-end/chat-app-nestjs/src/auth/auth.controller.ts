import {
  Controller,
  Post,
  Body,
  HttpCode,
  Get,
  Req,
  Query,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { User } from 'src/users/user.entity';
import { AuthService } from './auth.service';
import { join } from 'path';

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

  @Get('email-verify')
  async emailVerify(@Query('token') token: string, @Res() res: Response) {
    await this.authService.emailVerify(token);
    // Read and send the success template
    const template = join(
      __dirname,
      '..',
      'email',
      'templates',
      'verify-success.hbs',
    );
    return res.render(template, {
      loginUrl: `${process.env.FRONTEND_URL}/auth/login`,
    });
  }

  @Post('resend-email-verify')
  @HttpCode(200)
  async resendEmailVerify(@Body() user: User) {
    await this.authService.resendEmailVerify(user);
    return { message: 'Email verification resent successfully' };
  }

  @Post('forgot-password')
  @HttpCode(200)
  async forgotPassword(@Body() user: User) {
    await this.authService.forgotPassword(user);
    return { message: 'Password reset email sent successfully' };
  }

  @Post('reset-password')
  @HttpCode(200)
  async resetPassword(@Query('token') token: string, @Body() user: User) {
    await this.authService.resetPassword(token, user);
    return { message: 'Password reset successfully' };
  }
}
