import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async findAll(page: string, limit: string): Promise<{ data: User[]; total: number }> {
        try {
            const [data, total] = await this.userRepository.findAndCount({
                skip: (+page - 1) * +limit,
                take: +limit,
            });

            return { data, total };
        } catch (err) {
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        }
    }

    async findOne(id: number): Promise<User> {
        try {
            await this.findValidation(id);
            return await this.userRepository.findOneBy({ id: id });
        } catch (err) {
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        }
    }

    async getByEmail(email: string) {
        const user = await this.userRepository.findOneBy({ email });
        if (user) {
            return user;
        }
        throw new NotFoundException('User with this email does not exist');
    }

    async create(user: CreateUserDto): Promise<User> {
        try {
            const create = this.userRepository.create(user);
            return this.userRepository.save(create);
        } catch (err) {
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        }
    }

    async update(id: number, user: UpdateUserDto): Promise<User> {
        await this.findValidation(id);

        try {
            await this.userRepository.update(id, user);
            return this.userRepository.findOneBy({ id });
        } catch (err) {
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        }
    }

    async updateHash(id: number, hashRt: string): Promise<User> {
        await this.findValidation(id);

        try {
            await this.userRepository.update(id, { hashRt });
            return this.userRepository.findOneBy({ id });
        } catch (err) {
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        }
    }

    async remove(id: number): Promise<void> {
        await this.findValidation(id);
        try {
            await this.userRepository.delete(id);
        } catch (err) {
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        }
    }

    async setTwoFactorAuthenticationSecret(secret: string, userId: number) {
        return await this.userRepository.update(userId, {
            twoFactorAuthenticationSecret: secret,
        });
    }

    async turnOnTwoFactorAuthentication(userId: number) {
        return await this.userRepository.update(userId, {
            isTwoFactorAuthenticationEnabled: true,
        });
    }

    private async findValidation(id: number) {
        const find = await this.userRepository.findOneBy({ id: id });

        if (!find) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
    }
}
