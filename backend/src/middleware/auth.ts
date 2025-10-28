import { FastifyRequest, FastifyReply } from 'fastify';
import { verifyToken, JwtPayload } from '../utils/jwt';
import { logger } from '../utils/logger';

declare module 'fastify' {
    interface FastifyRequest {
        user?: JwtPayload;
    }
}

export const authenticate = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<void> => {
    try {
        const authHeader = request.headers.authorization;

        if (!authHeader) {
            return reply.code(401).send({
                success: false,
                error: 'Authorization header is required'
            });
        }

        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return reply.code(401).send({
                success: false,
                error: 'Authorization header must be in format: Bearer <token>'
            });
        }

        const token = parts[1];

        const payload = verifyToken(token);

        request.user = payload;
    } catch (error: any) {
        logger.error('Authentication error:', error);
        return reply.code(error.statusCode || 401).send({
            success: false,
            error: error.message || 'Authentication failed'
        });
    }
};
