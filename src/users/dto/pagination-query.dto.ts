import { IsInt, IsString, Min } from 'class-validator';

export class PaginationQueryDto {
    @IsString()
    page: string;

    @IsString()
    limit: string;
}
