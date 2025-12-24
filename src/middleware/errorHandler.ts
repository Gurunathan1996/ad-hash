import { Request, Response, NextFunction } from 'express';
import { QueryFailedError } from 'typeorm';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    // Server-side logging
    console.error(err && err.stack ? err.stack : err);

    // Structured validation errors thrown by validateDto
    if (err && (err.code === 'VALIDATION_ERROR' || (err.details && err.details.errorCode === 'INVALID_REQUEST_BODY') || (err.innerError && err.innerError.details && err.innerError.details.errorCode === 'INVALID_REQUEST_BODY')) && Array.isArray(err.errors || err.details?.data || err.innerError?.details?.data)) {
        const errors = err.errors || err.details?.data || err.innerError.details.data;
        return res.status(err.status || err.httpCode || err.innerError?.httpCode || 400).json({
            status: err.status || err.httpCode || err.innerError?.httpCode || 400,
            code: err.code || err.details?.errorCode || err.innerError.details.errorCode,
            message: err.message || err.innerError?.message || 'Validation failed',
            errors: errors
        });
    }

    // Handle duplicate key / constraint errors from TypeORM / MySQL
    if (err instanceof QueryFailedError || (err && err.code === 'ER_DUP_ENTRY') || (err && err.innerError && err.innerError instanceof QueryFailedError)) {
        const driverErr: any = (err.driverError || err.innerError?.driverError || err);
        if (driverErr && (driverErr.errno === 1062 || driverErr.code === 'ER_DUP_ENTRY')) {
            const msg: string = driverErr.message || driverErr.sqlMessage || String(driverErr);
            let field = undefined;
            const m = msg.match(/for key '(.+)'/i);
            if (m && m[1]) {
                field = m[1];
            }
            return res.status(409).json({
                status: 409,
                code: 'CONFLICT',
                message: 'Duplicate entry',
                field: field,
                detail: msg
            });
        }
    }

    // Default structured error
    const status = err && (err.status || err.httpCode) ? (err.status || err.httpCode) : 500;
    const code = err && (err.code || (err.details && err.details.errorCode)) ? (err.code || err.details.errorCode) : (status === 500 ? 'INTERNAL_ERROR' : 'ERROR');
    const message = err && err.message ? err.message : 'Internal Server Error';
    const payload: any = { status, code, message };
    if (process.env.NODE_ENV === 'development' && err && err.stack) payload.stack = err.stack;
    res.status(status).json(payload);
};