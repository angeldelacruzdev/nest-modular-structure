import { Injectable, HttpException, HttpStatus, ForbiddenException } from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto, RegisterDto } from './dto';
import { PostgresErrorCode } from '../database';
import { AuthTokens } from './../types/tokens.type';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async login(dto: LoginDto): Promise<AuthTokens> {
        try {
            const user = await this.usersService.getByEmail(dto.email);

            if (!user) throw new ForbiddenException('Access Denied.');

            const passwordMatches = await bcrypt.compare(dto.password, user.password);

            if (!passwordMatches) throw new ForbiddenException('Access Denied.');

            const tokens = await this.getTokens(user.id, user);

            const hashdRt = await this.hashPassword(tokens.refresh_token);

            await this.usersService.updateHash(user.id, hashdRt);
            return tokens;
        } catch (error) {
            throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async register(registrationData: RegisterDto) {
        const hashedPassword = await bcrypt.hash(registrationData.password, 10);
        try {
            const createdUser = await this.usersService.create({
                ...registrationData,
                password: hashedPassword,
            });
            createdUser.password = undefined;
            createdUser.hashRt = undefined;
            return createdUser;
        } catch (error) {
            if (error?.code === PostgresErrorCode.UniqueViolation) {
                throw new HttpException('User with that email already exists', HttpStatus.BAD_REQUEST);
            }

            if (error?.code === PostgresErrorCode.ExecConstraints) {
                throw new HttpException('Null Value Exist', HttpStatus.BAD_REQUEST);
            }

            throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async refreshTokens(userId: number, rt: string) {
        try {
            const user = await this.usersService.findOne(userId);

            if (!user || !user.hashRt) throw new ForbiddenException('Access Denied.');

            const rtMatches = await bcrypt.compare(rt, user.hashRt);

            if (!rtMatches) throw new ForbiddenException('Access Denied.');

            const tokens = await this.getTokens(user.id, user);

            const hashRt = await this.hashPassword(tokens.refresh_token);

            await this.usersService.updateHash(user.id, hashRt);
            return tokens;
        } catch (error) {
            throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getTokens(userId: number, user: any) {
        const [at, rt] = await Promise.all([
            this.jwtService.signAsync(
                {
                    sub: userId,
                    email: user.email,
                },
                {
                    secret: process.env.JWT_SECRET,
                    expiresIn: '24h',
                },
            ),
            this.jwtService.signAsync(
                {
                    sub: userId,
                    email: user.email,
                },
                {
                    secret: process.env.JWT_REFRESH_SECRET,
                    expiresIn: '30d',
                },
            ),
        ]);

        return {
            name: user.name,
            access_token: at,
            refresh_token: rt,
        };
    }

    async hashPassword(data: string) {
        return bcrypt.hash(data, 10);
    }
}
