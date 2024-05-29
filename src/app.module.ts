import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { DatabaseModule } from './database';
import { UsersModule } from './users';
import { AuthModule } from './auth/auth.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './guards';

@Module({
    imports: [
        ConfigModule.forRoot({
            validationSchema: Joi.object({
                POSTGRES_HOST: Joi.string().required(),
                POSTGRES_PORT: Joi.number().required(),
                POSTGRES_USER: Joi.string().required(),
                POSTGRES_PASSWORD: Joi.string().required(),
                POSTGRES_DB: Joi.string().required(),
                PORT: Joi.number(),
            }),
        }),
        DatabaseModule,
        ThrottlerModule.forRoot([
            {
                name: 'short',
                ttl: 1000,
                limit: 3,
            },
            {
                name: 'medium',
                ttl: 10000,
                limit: 20,
            },
            {
                name: 'long',
                ttl: 60000,
                limit: 100,
            },
        ]),
        UsersModule,
        AuthModule,
    ],
    controllers: [AppController],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
        {
            provide: APP_GUARD,
            useClass: AtGuard,
        },
        AppService,
    ],
})
export class AppModule {}
