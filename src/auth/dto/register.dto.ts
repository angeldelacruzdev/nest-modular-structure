import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class RegisterDto {
    @ApiProperty({
        required: true,
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    password: string;

    hashRt?: string;
}
