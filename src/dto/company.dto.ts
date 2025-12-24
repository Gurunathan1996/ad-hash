import { IsString, MinLength, IsInt } from 'class-validator';
import { Trim } from '../utils/trimmer';

export class IdDto {
    @IsString()
    id: string;
}

export class CreateCompanyDto {
    @Trim()
    @IsString()
    @MinLength(1, { message: 'Company name is required' })
    name: string;
}