import { FastifyRequest, FastifyReply } from 'fastify';
import weightService from '../services/weight.service';
import { UpdateWeightDTO, UpdateGoalDTO } from '../types/weight.types';
import { ApiResponse } from '../types/common.types';
import { logger } from '../utils/logger';

export class WeightController {
    async addWeight(
        request: FastifyRequest<{ Body: UpdateWeightDTO }>,
        reply: FastifyReply
    ): Promise<void> {
        try {
            const userId = request.user!.user_id;
            const weightData = request.body;

            const weight = await weightService.addWeight(userId, weightData);

            const response: ApiResponse = {
                success: true,
                data: weight,
                message: 'Weight added successfully'
            };

            reply.code(201).send(response);
        } catch (error: any) {
            logger.error('Error in addWeight controller:', error);
            reply.code(error.statusCode || 500).send({
                success: false,
                error: error.message || 'Internal server error'
            });
        }
    }

    async getWeightHistory(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        try {
            const userId = request.user!.user_id;
            const history = await weightService.getWeightHistory(userId);

            const response: ApiResponse = {
                success: true,
                data: history,
                message: 'Weight history retrieved successfully'
            };

            reply.code(200).send(response);
        } catch (error: any) {
            logger.error('Error in getWeightHistory controller:', error);
            reply.code(error.statusCode || 500).send({
                success: false,
                error: error.message || 'Internal server error'
            });
        }
    }

    async setGoal(
        request: FastifyRequest<{ Body: UpdateGoalDTO }>,
        reply: FastifyReply
    ): Promise<void> {
        try {
            const userId = request.user!.user_id;
            const goalData = request.body;

            await weightService.setGoal(userId, goalData);

            const response: ApiResponse = {
                success: true,
                message: 'Goal set successfully'
            };

            reply.code(200).send(response);
        } catch (error: any) {
            logger.error('Error in setGoal controller:', error);
            reply.code(error.statusCode || 500).send({
                success: false,
                error: error.message || 'Internal server error'
            });
        }
    }

    async getWeightStats(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        try {
            const userId = request.user!.user_id;
            const stats = await weightService.getWeightStats(userId);

            const response: ApiResponse = {
                success: true,
                data: stats,
                message: 'Weight stats retrieved successfully'
            };

            reply.code(200).send(response);
        } catch (error: any) {
            logger.error('Error in getWeightStats controller:', error);
            reply.code(error.statusCode || 500).send({
                success: false,
                error: error.message || 'Internal server error'
            });
        }
    }
}

export default new WeightController();
