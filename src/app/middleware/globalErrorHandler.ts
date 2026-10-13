import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

export type TErrorMessage = {
    path: string | number;
    message: string;
};

const globalErrorHandler: ErrorRequestHandler = (
    error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let statusCode = 500;
    let message = error.message || 'Something went wrong!';
    let errorMessages: TErrorMessage[] = [];


    if (error instanceof ZodError) {
        statusCode = 400;
        message = 'Validation Error';
        errorMessages = error.issues.map((issue) => ({
            path: issue.path[issue.path.length - 1] as string | number,
            message: issue.message,
        }));
    }

    else if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
            statusCode = 409;
            message = 'Duplicate Key Error';
            errorMessages = [
                {
                    path: '',
                    message: `${error.meta?.target} already exists!`,
                },
            ];
        } else if (error.code === 'P2025') {
            statusCode = 404;
            message = 'Record Not Found';
            errorMessages = [
                {
                    path: '',
                    message: (error.meta?.cause as string) || 'Record not found!',
                },
            ];
        } else if (error.code === 'P2003') {
            statusCode = 400;
            message = 'Foreign Key Constraint Violation';
            errorMessages = [
                {
                    path: '',
                    message: (error.meta?.field_name as string) || 'Invalid foreign reference!',
                },
            ];
        }
    }

    else if (error instanceof Prisma.PrismaClientValidationError) {
        statusCode = 400;
        message = 'Prisma Validation Error';
        errorMessages = [
            {
                path: '',
                message: error.message,
            },
        ];
    }

    else if (error instanceof Error) {
        message = error.message;
        errorMessages = error?.message
            ? [
                {
                    path: '',
                    message: error?.message,
                },
            ]
            : [];
    }


    return res.status(statusCode).json({
        success: false,
        message,
        errorMessages,
        stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined,
    });
};

export default globalErrorHandler;