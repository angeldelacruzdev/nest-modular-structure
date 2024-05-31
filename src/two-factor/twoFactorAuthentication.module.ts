import { Module } from '@nestjs/common';
import { TwoFactorAuthenticationController } from './twoFactorAuthentication.controller';
import { TwoFactorAuthenticationService } from './twoFactorAuthentication.service';
import { UsersModule } from '../users/users.module';

@Module({
    imports:[UsersModule],
    controllers: [TwoFactorAuthenticationController],
    providers: [TwoFactorAuthenticationService],
    exports: [TwoFactorAuthenticationService],
})
export class TwoFactorAuthentication {}
