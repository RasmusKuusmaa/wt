import fastify, { FastifyInstance } from 'fastify';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';
import database from './config/database';

export async function buildApp(): Promise<FastifyInstance> {
    const app = fastify({
        logger: {
            level: process.env.NODE_ENV === 'production' ? 'error' : 'info'
        }
    });

    app.setErrorHandler(errorHandler);

    app.addHook('onRequest', async (request, reply) => {
        reply.header('Access-Control-Allow-Origin', '*');
        reply.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        reply.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    });

    app.addHook('onRequest', async (request, reply) => {
        if (request.method === 'OPTIONS') {
            reply.status(200).send();
        }
    });

    const dbConnected = await database.testConnection();
    if (!dbConnected) {
        logger.error('Failed to connect to database');
        throw new Error('Database connection failed');
    }

    await app.register(routes);

    const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM'];
    signals.forEach((signal) => {
        process.on(signal, async () => {
            logger.info(`Received ${signal}, closing server gracefully...`);
            await app.close();
            await database.close();
            process.exit(0);
        });
    });

    return app;
}
