import { IsString, IsIn, IsOptional, IsInt, MinLength, IsNumber, IsEmail } from 'class-validator';
import { Trim } from '../utils/trimmer';
import { RoleName } from '../entities/Role';

export class IdDto {
    @IsString()
    id: string;
}

export class CreateUserDto {
    @Trim()
    @IsString()
    @MinLength(3, { message: 'Username must be at least 3 characters' })
    username: string;

    @Trim()
    @IsEmail({}, { message: 'Email must be a valid email address' })
    email: string;

    @Trim()
    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters' })
    password: string;

    @IsString()
    @IsIn(Object.values(RoleName), { message: 'Role must be one of: ' + Object.values(RoleName).join(', ') })
    role: string;

    @IsOptional()
    @IsInt({ message: 'Company ID must be an integer' })
    companyId?: number;
}

export class UpdateUserDto {
    @IsOptional()
    @Trim()
    @IsString()
    @MinLength(3, { message: 'Username must be at least 3 characters' })
    username?: string;

    @IsOptional()
    @Trim()
    @IsEmail({}, { message: 'Email must be a valid email address' })
    email?: string;

    @IsOptional()
    @Trim()
    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters' })
    password?: string;

    @IsOptional()
    @IsString()
    @IsIn(['SUPER_ADMIN', 'COMPANY_USER', 'CUSTOMER'], { message: 'Invalid role' })
    role?: string;

    @IsOptional()
    @IsInt({ message: 'Company ID must be an integer' })
    companyId?: number;
}