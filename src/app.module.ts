import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppConfiguration } from './core/config/app.config';
import { JoiValidationSchema } from './core/config/joi.validations';

import { CoreModule } from './core/core.module';
import { ClientModule } from './client/client.module';

@Module({
  imports: [
    // Environment Configuration
    ConfigModule.forRoot({
      load: [AppConfiguration],
      validationSchema: JoiValidationSchema,
    }),

    // Database Configuration
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('db.host'),
        port: configService.get<number>('db.port'),
        database: configService.get<string>('db.name'),
        username: configService.get<string>('db.user'),
        password: configService.get<string>('db.password'),
        autoLoadEntities: true,
        synchronize: configService.get<string>('environment') === 'development',
      }),
    }),

    // Module Imports
    CoreModule,
    ClientModule,
  ],
})
export class AppModule {}
