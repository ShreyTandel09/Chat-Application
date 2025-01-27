import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Token } from './token.entity';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  public async getTokens(userId: number, email: string) {
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

  async createToken(
    userId: number,
    accessToken: string,
    refreshToken: string,
    expiresAt: Date,
  ): Promise<Token> {
    const token = this.tokenRepository.create({
      user_id: userId,
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: expiresAt,
    });
    return this.tokenRepository.save(token);
  }

  async findValidTokenByUserId(userId: number): Promise<Token | null> {
    return this.tokenRepository.findOne({
      where: {
        user_id: userId,
        is_revoked: false,
        expires_at: MoreThan(new Date()),
      },
    });
  }

  async revokeToken(id: number): Promise<void> {
    await this.tokenRepository.update(id, { is_revoked: true });
  }

  async updateAccessTokenByRefreshToken(
    refreshToken: string,
    accessToken: string,
  ): Promise<void> {
    await this.tokenRepository.update(
      { refresh_token: refreshToken },
      { access_token: accessToken },
    );
  }

  async generateEmailVerifyToken(email: string): Promise<string> {
    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    const token = await this.jwtService.signAsync(
      { email },
      { secret: jwtSecret, expiresIn: '24h' },
    );
    return token;
  }
}
