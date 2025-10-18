import fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import redis from '@fastify/redis';
import dotenv from 'dotenv';
import { testConnection } from './config/database.js';
import { workoutRoutes } from './routes/workout.routes.js';
import { authRoutes } from './routes/auth.routes.js';
import { authenticate } from './middleware/auth.middleware.js';

dotenv.config();

const app = fastify({
  logger: true
});

app.register(cors, {
  origin: (origin, cb) => {
    if (!origin) {
      cb(null, true);
      return;
    }

    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5000',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5000',
    ];

    if (allowedOrigins.includes(origin)) {
      cb(null, true);
    } else {
      cb(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true
});

app.register(jwt, {
  secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production'
});

const redisOptions: any = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: Number(process.env.REDIS_PORT) || 6379,
};

if (process.env.REDIS_PASSWORD) {
  redisOptions.password = process.env.REDIS_PASSWORD;
}

app.register(redis, redisOptions);

app.decorate('authenticate', authenticate);

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: typeof authenticate;
  }
}

app.register(authRoutes, { prefix: '/api' });
app.register(workoutRoutes, { prefix: '/api' });

const start = async () => {
  try {
    await testConnection();

    const host = process.env.HOST || 'localhost';
    const port = Number(process.env.PORT) || 3200;

    await app.listen({ host, port });

    console.log(`Server running at http://${host}:${port}`);
    console.log(`Authentication enabled with JWT`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

process.on('SIGINT', async () => {
  await app.close();
  process.exit(0);
});

start();