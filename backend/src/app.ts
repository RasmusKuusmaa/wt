import fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import { testConnection } from './config/database';
import { workoutRoutes } from './routes/workout.routes';

dotenv.config();

const app = fastify({
  logger: true
});

app.register(cors, { origin: true });

app.register(workoutRoutes, { prefix: '/api' });

const start = async () => {
  try {
    await testConnection();

    const host = process.env.HOST || 'localhost';
    const port = Number(process.env.PORT) || 3200;

    await app.listen({ host, port });
    
    console.log(`Server running at http://${host}:${port}`);
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