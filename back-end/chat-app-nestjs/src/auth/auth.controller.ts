import {
  Controller,
  Post,
  Body,
  HttpCode,
  Get,
  Req,
  Query,
  Res,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import {
  SignUpDto,
  SignInDto,
  EmailVerifyDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from './validator/authValidator/auth.dto';
import { join } from 'path';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
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
      loginUrl: `${process.env.FRONTEND_URL}/signin`,
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
