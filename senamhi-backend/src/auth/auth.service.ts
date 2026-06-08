import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
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

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    const user = await this.userService.findOneByEmail(email);

    // Por seguridad, no informamos si el correo existe o no
    if (user) {
      // TODO: Generar código de verificación
      // TODO: Guardar código en BD (o Redis) con expiración
      // TODO: Enviar correo electrónico con el código
      console.log(`Simulación: Enviando código de recuperación a ${email}`);
    }

    return { message: 'Si el correo electrónico está registrado, recibirás un código de recuperación en breve.' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { email, code, newPassword } = resetPasswordDto;
    
    // TODO: Validar código de verificación
    // const isValid = await this.validateResetCode(email, code);
    // if (!isValid) throw new BadRequestException('Código inválido o expirado');

    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    // TODO: Actualizar contraseña en el servicio de usuario
    // await this.userService.updatePassword(user.id, newPassword);

    return { message: 'Contraseña actualizada exitosamente.' };
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

