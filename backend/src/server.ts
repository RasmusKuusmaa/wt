import dotenv from 'dotenv';

dotenv.config();

import { buildApp } from './app';
import config from './config/env';
import { logger } from './utils/logger';

async function start() {
    try {
        const app = await buildApp();

        await app.listen({
            port: config.port,
            host: '0.0.0.0'
        });

        logger.info(`Server is running on port ${config.port}`);
        logger.info(`Environment: ${config.nodeEnv}`);
        logger.info(`Database: ${config.db.name}`);
    } catch (error) {
        logger.error('Error starting server:', error);
        process.exit(1);
    }
}

start();
