import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CultiveModule } from './cultive/cultive.module';
import { StationModule } from './station/station.module';
import { FenologicModule } from './fenologic/fenologic.module';
import { AnalyticModule } from './analytic/analytic.module';
import { TemperatureDataModule } from './temperature-data/temperature-data.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ActivityLogModule } from './activity-log/activity-log.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot({
      // set this to `true` to use wildcards
      wildcard: true,
      // the delimiter used to segment namespaces
      delimiter: '.',
      // set this to `true` if you want to emit the nextTick event
      verboseMemoryLeak: false,
      // maximum amount of listeners that can be assigned to an event
      maxListeners: 20,
      // show event name in memory leak message when maximum amount of listeners is exceeded
      ignoreErrors: false,
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
    ActivityLogModule,
  ],
  providers: [],
})
export class AppModule {}
