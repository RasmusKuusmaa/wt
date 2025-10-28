import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { AppError } from '../types/common.types';
import { logger } from '../utils/logger';

export async function errorHandler(
    error: FastifyError | AppError,
    request: FastifyRequest,
    reply: FastifyReply
) {
    logger.error('Error occurred:', {
        error: error.message,
        stack: error.stack,
        url: request.url,
        method: request.method
    });

    if (error instanceof AppError) {
        return reply.status(error.statusCode).send({
            success: false,
            error: error.message,
            statusCode: error.statusCode
        });
    }

    if (error.validation) {
        return reply.status(400).send({
            success: false,
            error: 'Validation error',
            details: error.validation
        });
    }

    const statusCode = error.statusCode || 500;
    const message = statusCode === 500
        ? 'Internal server error'
        : error.message;

    return reply.status(statusCode).send({
        success: false,
        error: message,
        statusCode
    });
}
