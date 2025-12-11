import { IsString, IsNotEmpty, MinLength, IsOptional } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @MinLength(6, { message: 'Password minimal 6 karakter' })
    password: string;

    @IsString()
    @IsOptional()
    name?: string;
}
