import { FastifyInstance } from 'fastify';
import weightController from '../controllers/weight.controller';
import { authenticate } from '../middleware/auth';
import { UpdateWeightDTO, UpdateGoalDTO } from '../types/weight.types';

async function weightRoutes(fastify: FastifyInstance) {
    fastify.post<{ Body: UpdateWeightDTO }>('/weight', {
        preHandler: authenticate
    }, async (request, reply) => {
        return weightController.addWeight(request, reply);
    });

    fastify.get('/weight/history', {
        preHandler: authenticate
    }, async (request, reply) => {
        return weightController.getWeightHistory(request, reply);
    });

    fastify.post<{ Body: UpdateGoalDTO }>('/weight/goal', {
        preHandler: authenticate
    }, async (request, reply) => {
        return weightController.setGoal(request, reply);
    });

    fastify.get('/weight/stats', {
        preHandler: authenticate
    }, async (request, reply) => {
        return weightController.getWeightStats(request, reply);
    });
}

export default weightRoutes;
