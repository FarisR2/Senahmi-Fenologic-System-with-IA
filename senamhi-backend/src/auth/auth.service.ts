import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { InvitationTokenService } from '../invitation-token/invitation-token.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private invitationTokenService: InvitationTokenService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { invitationToken, email, password, firstName, lastName } = registerDto;

    // Validar token de invitación
    const token = await this.invitationTokenService.validateToken(invitationToken);

    // Verificar si el usuario ya existe
    const existingUser = await this.userService.findOneByEmail(email);
    if (existingUser) {
      throw new BadRequestException('El correo electrónico ya está registrado.');
    }

    // Crear usuario
    const user = await this.userService.create({
      email,
      password,
      firstName,
      lastName,
    });

    // Marcar token como usado
    await this.invitationTokenService.markAsUsed(token.id, user.id);

    return this.generateAuthResponse(user);
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userService.findOneByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return this.generateAuthResponse(user);
  }

  private generateAuthResponse(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      backend_token: this.jwtService.sign(payload),
    };
  }
}

