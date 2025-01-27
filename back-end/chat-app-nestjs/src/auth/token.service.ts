import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Token } from './token.entity';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
  ) {}

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
}
