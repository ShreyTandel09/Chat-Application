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

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
  ) {}
  private async getTokens(userId: number, email: string) {
    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    const jwtRefreshSecret =
      this.configService.get<string>('JWT_REFRESH_SECRET');
    const accessTokenExpiresIn = '24h';
    const refreshTokenExpiresIn = '7d';

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email },
        { secret: jwtSecret, expiresIn: accessTokenExpiresIn },
      ),
      this.jwtService.signAsync(
        { sub: userId, email },
        { secret: jwtRefreshSecret, expiresIn: refreshTokenExpiresIn },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  async signUp(user: User) {
    const existingUser = await this.usersService.findUserByEmail(user.email);
    if (existingUser) {
      throw new UnprocessableEntityException('User already exists');
    }
    const userData = await this.usersService.createUser(user);
    return userData;
  }

  async signIn(user: User) {
    const existingUser = await this.usersService.findUserByEmail(user.email);
    if (!existingUser) {
      throw new UnprocessableEntityException('User does not exist');
    }
    const tokens = await this.getTokens(existingUser.id, existingUser.email);

    await this.tokenService.createToken(
      existingUser.id,
      tokens.accessToken,
      tokens.refreshToken,
      new Date(Date.now() + 24 * 60 * 60 * 1000),
    );
    return { ...tokens, user: existingUser };
  }

  async refreshToken(refreshToken: string) {
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
    const tokens = await this.getTokens(user.id, user.email);
    await this.tokenService.updateAccessTokenByRefreshToken(
      refreshToken,
      tokens.accessToken,
    );
    return { ...tokens, user };
  }
}
