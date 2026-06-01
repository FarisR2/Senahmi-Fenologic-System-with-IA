import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Email no válido' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsString()
  @MinLength(2, { message: 'El nombre es obligatorio' })
  firstName: string;

  @IsString()
  @MinLength(2, { message: 'El apellido es obligatorio' })
  lastName: string;

  @IsString()
  @MinLength(8, { message: 'El token de invitación es obligatorio' })
  invitationToken: string;
}
