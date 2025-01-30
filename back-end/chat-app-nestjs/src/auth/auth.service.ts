import {
  Injectable,
  UnprocessableEntityException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { TokenService } from './token.service';
import { EmailService } from 'src/email/email.service';
import { SignUpDto } from './validator/authValidator/sign-up.dto';
import { SignInDto } from './validator/authValidator/sign-in.dto';
import { EmailVerifyDto } from './validator/authValidator/email-verify.dto';
import { ForgotPasswordDto } from './validator/authValidator/forgot-password.dto';
import { ResetPasswordDto } from './validator/authValidator/reset-password.dto';
import { AuthResponse } from './interfaces/auth.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
    private readonly emailService: EmailService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<AuthResponse> {
    const existingUser = await this.usersService.findUserByEmail(
      signUpDto.email,
    );
    if (existingUser) {
      throw new UnprocessableEntityException('User already exists');
    }

    const user = new User();
    user.email = signUpDto.email;
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(signUpDto.password, salt);
    user.first_name = signUpDto.first_name;
    user.last_name = signUpDto.last_name;

    const userData = await this.usersService.createUser(user);
    const emailVerifyToken = await this.tokenService.generateEmailVerifyToken(
      signUpDto.email,
    );
    await this.emailService.sendUserConfirmation(
      userData.email,
      emailVerifyToken,
    );

    return { message: 'User created successfully', user: userData };
  }

  async signIn(signInDto: SignInDto): Promise<AuthResponse> {
    const user = await this.usersService.findUserByEmail(signInDto.email);
    if (!user) {
      throw new UnprocessableEntityException('User does not exist');
    }
    if (!user.is_verified) {
      throw new UnauthorizedException({
        is_verified: false,
        message: 'Email not verified',
      });
    }

    const isPasswordValid = await bcrypt.compare(signInDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.tokenService.getTokens(user.id, user.email);
    return { message: 'Login successful', ...tokens, user };
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const decoded = this.jwtService.verify<{ sub: number; email: string }>(
      refreshToken,
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      },
    );
    const user = await this.usersService.findUserById(decoded.sub);
    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const tokens = await this.tokenService.getTokens(user.id, user.email);
    await this.tokenService.updateAccessTokenByRefreshToken(
      refreshToken,
      tokens.accessToken,
    );
    return { message: 'Token refreshed successfully', ...tokens, user };
  }

  async emailVerify(token: string): Promise<AuthResponse> {
    const decoded = this.jwtService.verify<{ email: string }>(token, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });
    const user = await this.usersService.findUserByEmail(decoded.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email verification token');
    }

    user.is_verified = true;
    await this.usersService.updateUser(user);
    return { message: 'Email verified successfully' };
  }

  async resendEmailVerify(
    emailVerifyDto: EmailVerifyDto,
  ): Promise<AuthResponse> {
    const user = await this.usersService.findUserByEmail(emailVerifyDto.email);
    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }
    if (user.is_verified) {
      throw new UnauthorizedException('Email already verified');
    }
    const emailVerifyToken = await this.tokenService.generateEmailVerifyToken(
      user.email,
    );
    await this.emailService.sendUserConfirmation(user.email, emailVerifyToken);
    return { message: 'Email verification resent successfully' };
  }

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<AuthResponse> {
    const existingUser = await this.usersService.findUserByEmail(
      forgotPasswordDto.email,
    );
    if (!existingUser) {
      throw new UnauthorizedException('User does not exist');
    }
    const passwordResetToken =
      await this.tokenService.generatePasswordResetToken(existingUser.email);
    await this.emailService.sendPasswordReset(
      existingUser.email,
      passwordResetToken,
    );
    return { message: 'Password reset email sent successfully' };
  }

  async resetPassword(
    token: string,
    resetPasswordDto: ResetPasswordDto,
  ): Promise<AuthResponse> {
    const decoded = this.jwtService.verify<{ email: string }>(token, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });
    const existingUser = await this.usersService.findUserByEmail(decoded.email);
    if (!existingUser) {
      throw new UnauthorizedException('Invalid password reset token');
    }

    const salt = await bcrypt.genSalt();
    existingUser.password = await bcrypt.hash(resetPasswordDto.password, salt);
    await this.usersService.updateUser(existingUser);
    return { message: 'Password reset successfully' };
  }
}
