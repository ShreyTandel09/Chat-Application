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
import { AuthService } from './auth.service';
import { SignUpDto } from './validator/authValidator/sign-up.dto';
import { SignInDto } from './validator/authValidator/sign-in.dto';
import { EmailVerifyDto } from './validator/authValidator/email-verify.dto';
import { join } from 'path';
import { ForgotPasswordDto } from './validator/authValidator/forgot-password.dto';
import { ResetPasswordDto } from './validator/authValidator/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    const resData = await this.authService.signUp(signUpDto);
    return resData;
  }

  @Post('signin')
  @HttpCode(200)
  async signIn(@Body() signInDto: SignInDto) {
    const resData = await this.authService.signIn(signInDto);
    return resData;
  }

  @Get('refresh-token')
  @HttpCode(200)
  async refreshToken(@Req() req: Request) {
    const refreshToken = req.headers['x-refresh-token'] as string;
    // console.log(refreshToken);
    const resData = await this.authService.refreshToken(refreshToken);
    return resData;
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
  async resendEmailVerify(@Body() emailVerifyDto: EmailVerifyDto) {
    await this.authService.resendEmailVerify(emailVerifyDto);
    return { message: 'Email verification resent successfully' };
  }

  @Post('forgot-password')
  @HttpCode(200)
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    await this.authService.forgotPassword(forgotPasswordDto);
    return { message: 'Password reset email sent successfully' };
  }

  @Post('reset-password')
  @HttpCode(200)
  async resetPassword(
    @Query('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    await this.authService.resetPassword(token, resetPasswordDto);
    return { message: 'Password reset successfully' };
  }
}
