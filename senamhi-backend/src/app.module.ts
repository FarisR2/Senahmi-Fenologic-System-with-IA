import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CultiveModule } from './cultive/cultive.module';
import { StationModule } from './station/station.module';
import { FenologicModule } from './fenologic/fenologic.module';
import { AnalyticModule } from './analytic/analytic.module';
import { TemperatureDataModule } from './temperature-data/temperature-data.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'senamhi_user'),
        password: configService.get<string>('DB_PASSWORD', 'senamhi_password'),
        database: configService.get<string>('DB_NAME', 'senamhi_fenologic'),
        autoLoadEntities: true,
        synchronize: true, // Solo para desarrollo
      }),
    }),
    CultiveModule,
    StationModule,
    FenologicModule,
    AnalyticModule,
    TemperatureDataModule,
    DashboardModule,
  ],
  providers: [],
})
export class AppModule { }
