import { FastifyRequest, FastifyReply } from 'fastify';
import workoutService from '../services/workout.service';
import { CreateWorkoutDTO } from '../types/exercise.types';
import { ApiResponse } from '../types/common.types';
import { logger } from '../utils/logger';

export class WorkoutController {
    async createWorkout(
        request: FastifyRequest<{ Body: CreateWorkoutDTO }>,
        reply: FastifyReply
    ): Promise<void> {
        try {
            const userId = request.user!.user_id;
            const workoutData = request.body;

            const workout = await workoutService.createWorkout(userId, workoutData);

            const response: ApiResponse = {
                success: true,
                data: workout,
                message: 'Workout created successfully'
            };

            reply.code(201).send(response);
        } catch (error: any) {
            logger.error('Error in createWorkout controller:', error);
            reply.code(error.statusCode || 500).send({
                success: false,
                error: error.message || 'Internal server error'
            });
        }
    }

    async getWorkouts(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        try {
            const userId = request.user!.user_id;
            const workouts = await workoutService.getWorkoutsByUser(userId);

            const response: ApiResponse = {
                success: true,
                data: workouts,
                message: 'Workouts retrieved successfully'
            };

            reply.code(200).send(response);
        } catch (error: any) {
            logger.error('Error in getWorkouts controller:', error);
            reply.code(error.statusCode || 500).send({
                success: false,
                error: error.message || 'Internal server error'
            });
        }
    }

    async getExerciseProgression(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        try {
            const userId = request.user!.user_id;
            const progression = await workoutService.getExerciseProgression(userId);

            const response: ApiResponse = {
                success: true,
                data: progression,
                message: 'Exercise progression retrieved successfully'
            };

            reply.code(200).send(response);
        } catch (error: any) {
            logger.error('Error in getExerciseProgression controller:', error);
            reply.code(error.statusCode || 500).send({
                success: false,
                error: error.message || 'Internal server error'
            });
        }
    }
}

export default new WorkoutController();
