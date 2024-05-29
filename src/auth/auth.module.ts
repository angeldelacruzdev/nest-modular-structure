import { Module } from '@nestjs/common';

import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwtConstants } from '../utils/constants';
import { RtStrategiest } from '../strategies/rt.strategies';
import { AtStrategiest } from '../strategies/at.strategies';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
    controllers: [AuthController],
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '60s' },
        }),
        UsersModule,
    ],
    providers: [AuthService, AtStrategiest, RtStrategiest],
})
export class AuthModule {}
