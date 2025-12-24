export class ExceptionDetails {
    errorCode: string;
    data: any;
    constructor(errorCode: string, data: any) {
        (this.errorCode = errorCode), (this.data = data);
    }
}

export class ApiException extends Error {
    httpCode = -1;
    details: ExceptionDetails | null;
    innerError: any;
    constructor(
        httpCode: number,
        message: string,
        details?: ExceptionDetails | null,
        innerError?: any
    ) {
        super(message);
        this.httpCode = httpCode;
        this.details = details ?? null;
        this.innerError = innerError;
    }
}