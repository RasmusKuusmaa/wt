import { FastifyInstance } from 'fastify';
import exerciseController from '../controllers/exercise.controller';
import { authenticate } from '../middleware/auth';

async function exerciseRoutes(fastify: FastifyInstance) {
    fastify.get('/categories', {
        preHandler: authenticate
    }, async (request, reply) => {
        return exerciseController.getAllCategories(request, reply);
    });

    fastify.get<{ Params: { categoryId: string } }>('/categories/:categoryId/exercises', {
        preHandler: authenticate
    }, async (request, reply) => {
        return exerciseController.getExercisesByCategory(request, reply);
    });

    fastify.get('/exercises', {
        preHandler: authenticate
    }, async (request, reply) => {
        return exerciseController.getAllExercises(request, reply);
    });
}

export default exerciseRoutes;
