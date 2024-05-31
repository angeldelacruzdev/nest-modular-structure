import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import { Public, GetCurrentUser, GetCurrentUserId } from '../decorator';
import { AtGuard, RtGuard } from '../guards';

@Controller({
    path: 'auth',
    version: '1',
})
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Public()
    @Post('/login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() dto: LoginDto) {
        return await this.authService.login(dto);
    }

    @Public()
    @Post('register')
    @HttpCode(HttpStatus.OK)
    async register(@Body() registrationData: RegisterDto) {
        return this.authService.register(registrationData);
    }

    @Public()
    @UseGuards(RtGuard)
    @Post('/refresh')
    @HttpCode(HttpStatus.OK)
    async refreshTokens(@GetCurrentUser('refreshToken') refreshToken: string, @GetCurrentUserId() userId: number) {
        return await this.authService.refreshTokens(userId, refreshToken);
    }
}
