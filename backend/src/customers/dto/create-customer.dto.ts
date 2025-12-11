import { IsString, IsOptional, IsEnum, IsNotEmpty } from 'class-validator';
import { CustomerStatus } from '../entities/customer.entity';

export class CreateCustomerDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsString()
    package?: string;

    @IsOptional()
    @IsString()
    ipAddress?: string;

    @IsOptional()
    @IsString()
    location?: string;

    @IsOptional()
    @IsEnum(CustomerStatus)
    status?: CustomerStatus;
}
