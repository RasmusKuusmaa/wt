import mysql from 'mysql2/promise';
import config from './env';
import { logger } from '../utils/logger';

class Database {
    private static instance: Database;
    private pool: mysql.Pool;

    private constructor() {
        this.pool = mysql.createPool({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'qwerty',
            database: process.env.DB_NAME || 'wellnesstracker',
            waitForConnections: true,
            connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10,
            queueLimit: 0,
            enableKeepAlive: true,
            keepAliveInitialDelay: 0
        });

        this.pool.on('connection', () => {
            logger.info('Database connection established');
        });
    }

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    public getPool(): mysql.Pool {
        return this.pool;
    }

    public async testConnection(): Promise<boolean> {
        try {
            const connection = await this.pool.getConnection();
            await connection.ping();
            connection.release();
            logger.info('Database connection test successful');
            return true;
        } catch (error) {
            logger.error('Database connection test failed:', error);
            return false;
        }
    }

    public async close(): Promise<void> {
        await this.pool.end();
        logger.info('Database connection pool closed');
    }
}

export default Database.getInstance();
