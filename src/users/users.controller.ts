import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, PaginationQueryDto, UpdateUserDto, UserResponseDto } from './dto';
import { ApiBody } from '@nestjs/swagger';

@Controller({
    path: 'users',
    version: '1',
})
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    @Get()
    async findAll(@Query() paginationQuery: PaginationQueryDto): Promise<{ data: UserResponseDto[]; total: number }> {
        const { page, limit } = paginationQuery;
        return await this.userService.findAll(page, limit);
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<UserResponseDto> {
        return await this.userService.findOne(id);
    }

    @ApiBody({
        type: CreateUserDto,
    })
    @Post()
    create(@Body() user: CreateUserDto): Promise<UserResponseDto> {
        return this.userService.create(user);
    }

    @ApiBody({
        type: UpdateUserDto,
    })
    @Put(':id')
    update(@Param('id') id: number, @Body() user: UpdateUserDto): Promise<UserResponseDto> {
        return this.userService.update(id, user);
    }

    @Delete(':id')
    remove(@Param('id') id: number): Promise<void> {
        return this.userService.remove(id);
    }
}
