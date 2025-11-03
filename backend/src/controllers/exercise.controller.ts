import { FastifyRequest, FastifyReply } from 'fastify';
import exerciseService from '../services/exercise.service';
import { ApiResponse } from '../types/common.types';
import { logger } from '../utils/logger';

export class ExerciseController {
    async getAllCategories(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        try {
            const categories = await exerciseService.getAllCategories();

            const response: ApiResponse = {
                success: true,
                data: categories,
                message: 'Categories retrieved successfully'
            };

            reply.code(200).send(response);
        } catch (error: any) {
            logger.error('Error in getAllCategories controller:', error);
            reply.code(error.statusCode || 500).send({
                success: false,
                error: error.message || 'Internal server error'
            });
        }
    }

    async getExercisesByCategory(
        request: FastifyRequest<{ Params: { categoryId: string } }>,
        reply: FastifyReply
    ): Promise<void> {
        try {
            const categoryId = parseInt(request.params.categoryId);
            const exercises = await exerciseService.getExercisesByCategory(categoryId);

            const response: ApiResponse = {
                success: true,
                data: exercises,
                message: 'Exercises retrieved successfully'
            };

            reply.code(200).send(response);
        } catch (error: any) {
            logger.error('Error in getExercisesByCategory controller:', error);
            reply.code(error.statusCode || 500).send({
                success: false,
                error: error.message || 'Internal server error'
            });
        }
    }

    async getAllExercises(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        try {
            const exercises = await exerciseService.getAllExercises();

            const response: ApiResponse = {
                success: true,
                data: exercises,
                message: 'Exercises retrieved successfully'
            };

            reply.code(200).send(response);
        } catch (error: any) {
            logger.error('Error in getAllExercises controller:', error);
            reply.code(error.statusCode || 500).send({
                success: false,
                error: error.message || 'Internal server error'
            });
        }
    }
}

export default new ExerciseController();
