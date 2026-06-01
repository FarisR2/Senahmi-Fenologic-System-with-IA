import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvitationTokenService } from './invitation-token.service';
import { InvitationTokenController } from './invitation-token.controller';
import { InvitationToken } from './entities/invitation-token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InvitationToken])],
  providers: [InvitationTokenService],
  controllers: [InvitationTokenController],
  exports: [InvitationTokenService],
})
export class InvitationTokenModule {}
