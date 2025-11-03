import { FastifyInstance } from 'fastify';
import userRoutes from './user.routes';
import exerciseRoutes from './exercise.routes';
import workoutRoutes from './workout.routes';
import weightRoutes from './weight.routes';

async function routes(fastify: FastifyInstance) {
    fastify.get('/health', async (request, reply) => {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime()
        };
    });

    await fastify.register(userRoutes, { prefix: '/api/auth' });
    await fastify.register(exerciseRoutes, { prefix: '/api' });
    await fastify.register(workoutRoutes, { prefix: '/api' });
    await fastify.register(weightRoutes, { prefix: '/api' });
}

export default routes;
