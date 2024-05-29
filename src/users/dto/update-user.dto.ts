import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    id?: number;
    @ApiProperty({
        required: false,
    })
    @IsString()
    @IsOptional()
    name: string;
}
