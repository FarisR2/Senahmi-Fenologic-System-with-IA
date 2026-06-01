import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserService } from './user/user.service';
import { Role } from './common/enums/role.enum';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userService = app.get(UserService);
  const logger = new Logger('Seed');

  const userEmail = 'prueba@prueba.com';
  const userPassword = 'prueba123456';

  try {
    const existingUser = await userService.findOneByEmail(userEmail);

    if (existingUser) {
      logger.log(`El usuario de prueba (${userEmail}) ya existe.`);
    } else {
      await userService.create({
        email: userEmail,
        password: userPassword,
        firstName: 'Usuario',
        lastName: 'Prueba',
        role: Role.USER,
      });
      logger.log(`#################################################`);
      logger.log(`USUARIO DE PRUEBA CREADO EXITOSAMENTE`);
      logger.log(`Email: ${userEmail}`);
      logger.log(`Password: ${userPassword}`);
      logger.log(`#################################################`);
    }
  } catch (error) {
    logger.error('Error al crear el usuario de prueba:', error);
  } finally {
    await app.close();
  }
}

bootstrap();
