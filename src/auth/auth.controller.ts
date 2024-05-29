import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import { Public } from '../decorator';

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
    async register(@Body() registrationData: RegisterDto) {
        console.log(registrationData);
        return this.authService.register(registrationData);
    }
}
