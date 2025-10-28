import fastify from 'fastify';
import pool from './db';
import { RowDataPacket } from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

interface User extends RowDataPacket {
    user_id: number;
    username: string;
    password: string;
}

const server = fastify({ logger: true });
const PORT = Number(process.env.PORT) || 5020;

server.get('/items', async (req, reply) => {
    return { test: 'Hello' };
});

server.get('/users', async (req, reply) => {
    try {
        const [rows] = await pool.query<User[]>('SELECT * FROM users');
        return rows;
    } catch (error) {
        server.log.error(error);
        reply.status(500).send({ error: 'Database error' });
    }
});

const start = async () => {
    try {
        await server.listen({ port: PORT, host: '0.0.0.0' });
        console.log(`Server listening on port ${PORT}`);
    } catch (error) {
        server.log.error(error);
        process.exit(1);
    }
};

start();
