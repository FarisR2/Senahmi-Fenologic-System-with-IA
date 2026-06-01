import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvitationToken } from './entities/invitation-token.entity';

@Injectable()
export class InvitationTokenService {
  constructor(
    @InjectRepository(InvitationToken)
    private tokenRepository: Repository<InvitationToken>,
  ) {}

  async generateToken(): Promise<InvitationToken> {
    const rawToken = this.generateRandomString(8);
    const token = this.tokenRepository.create({ token: rawToken });
    return this.tokenRepository.save(token);
  }

  async validateToken(tokenString: string): Promise<InvitationToken> {
    const token = await this.tokenRepository.findOne({ where: { token: tokenString } });

    if (!token) {
      throw new BadRequestException('El token de invitación no es válido.');
    }

    if (token.isUsed) {
      throw new BadRequestException('Este token ya ha sido utilizado.');
    }

    return token;
  }

  async markAsUsed(tokenId: number, userId: any): Promise<void> {
    await this.tokenRepository.update(tokenId, {
      isUsed: true,
      usedBy: userId,
    });
  }

  async findAll(): Promise<InvitationToken[]> {
    return this.tokenRepository.find({ relations: ['usedBy'] });
  }

  private generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      if (i === 4) result += '-';
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}
