import { validate, ValidationError as CVError } from 'class-validator';
import { plainToClass } from 'class-transformer';

export interface ValidationErrorItem {
    field: string;
    message: string;
}

export interface ValidationException {
    status: number;
    code: string;
    message: string;
    errors: ValidationErrorItem[];
}

export async function validateDto<T extends object>(dtoClass: new () => T, plain: any): Promise<T> {
    const dto = plainToClass(dtoClass, plain);
    const errors = await validate(dto);
    if (errors.length > 0) {
        const items: ValidationErrorItem[] = flattenErrors(errors);
        const ex: ValidationException = {
            status: 400,
            code: 'VALIDATION_ERROR',
            message: 'Validation failed',
            errors: items
        };
        throw ex as any;
    }
    return dto;
}

function flattenErrors(errors: CVError[], parentPath = ''): ValidationErrorItem[] {
    const items: ValidationErrorItem[] = [];
    for (const err of errors) {
        const propertyPath = parentPath ? `${parentPath}.${err.property}` : err.property;
        if (err.constraints) {
            for (const msg of Object.values(err.constraints)) {
                items.push({ field: propertyPath, message: msg });
            }
        }
        if (err.children && err.children.length) {
            items.push(...flattenErrors(err.children, propertyPath));
        }
    }
    return items;
}
