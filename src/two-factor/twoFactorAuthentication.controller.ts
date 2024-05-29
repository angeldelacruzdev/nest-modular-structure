//Implementando OTP: https://wanago.io/2020/05/25/api-nestjs-authenticating-users-bcrypt-passport-jwt-cookies/

import {
    ClassSerializerInterceptor,
    Controller,
    Header,
    Post,
    UseInterceptors,
    Res,
    UseGuards,
    Req,
} from '@nestjs/common';
import { TwoFactorAuthenticationService } from './twoFactorAuthentication.service';
import { Response } from 'express';
import { AtGuard } from '../guards';
import { RequestWithUser } from '../interfaces';

@Controller('2fa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthenticationController {
    constructor(private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService) {}

    @Post('generate')
    @UseGuards(AtGuard)
    async register(@Res() response: Response, @Req() request: RequestWithUser) {
        const { otpauthUrl } = await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(
            request.user,
        );

        return this.twoFactorAuthenticationService.pipeQrCodeStream(response, otpauthUrl);
    }
}
