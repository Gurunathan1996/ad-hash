import { IsString, IsIn, IsOptional, IsInt, MinLength, IsNumber, IsEmail } from 'class-validator';
import { Trim } from '../utils/trimmer';

export class SignupDto {
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

    @IsNumber()
    roleId: number;

    @IsOptional()
    @IsInt({ message: 'Company ID must be an integer' })
    companyId?: number;
}

export class LoginDto {
    @Trim()
    @IsString({ message: 'Username is required' })
    username: string;

    @Trim()
    @IsString({ message: 'Password is required' })
    password: string;
}