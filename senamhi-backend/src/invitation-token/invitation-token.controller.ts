import { Controller, Post, Get, UseGuards } from '@nestjs/common';
import { InvitationTokenService } from './invitation-token.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('invitation-tokens')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('invitation-token')
export class InvitationTokenController {
  constructor(private readonly tokenService: InvitationTokenService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Generar un nuevo token de invitación (Solo ADMIN)' })
  create() {
    return this.tokenService.generateToken();
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Listar todos los tokens y su estado (Solo ADMIN)' })
  findAll() {
    return this.tokenService.findAll();
  }
}

