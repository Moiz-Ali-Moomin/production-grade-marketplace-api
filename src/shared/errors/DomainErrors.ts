export enum ErrorCode {
    BAD_REQUEST = 'BAD_REQUEST',
    UNAUTHORIZED = 'UNAUTHORIZED',
    FORBIDDEN = 'FORBIDDEN',
    NOT_FOUND = 'NOT_FOUND',
    CONFLICT = 'CONFLICT',
    INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
    VALIDATION_ERROR = 'VALIDATION_ERROR',
}

export class AppError extends Error {
    public readonly statusCode: number;
    public readonly code: ErrorCode;
    public readonly isOperational: boolean;

    constructor(message: string, statusCode: number, code: ErrorCode, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class NotFoundError extends AppError {
    constructor(resource = 'Resource') {
        super(`${resource} not found`, 404, ErrorCode.NOT_FOUND);
    }
}

export class BadRequestError extends AppError {
    constructor(message = 'Bad request') {
        super(message, 400, ErrorCode.BAD_REQUEST);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized') {
        super(message, 401, ErrorCode.UNAUTHORIZED);
    }
}

export class ForbiddenError extends AppError {
    constructor(message = 'Forbidden') {
        super(message, 403, ErrorCode.FORBIDDEN);
    }
}

export class ConflictError extends AppError {
    constructor(message = 'Conflict') {
        super(message, 409, ErrorCode.CONFLICT);
    }
}

export class ValidationError extends AppError {
    constructor(message = 'Validation failed') {
        super(message, 422, ErrorCode.VALIDATION_ERROR);
    }
}
