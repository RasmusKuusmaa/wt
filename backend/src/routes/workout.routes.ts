import { FastifyInstance } from 'fastify';
import workoutController from '../controllers/workout.controller';
import { authenticate } from '../middleware/auth';
import { CreateWorkoutDTO } from '../types/exercise.types';

async function workoutRoutes(fastify: FastifyInstance) {
    fastify.post<{ Body: CreateWorkoutDTO }>('/workouts', {
        preHandler: authenticate
    }, async (request, reply) => {
        return workoutController.createWorkout(request, reply);
    });

    fastify.get('/workouts', {
        preHandler: authenticate
    }, async (request, reply) => {
        return workoutController.getWorkouts(request, reply);
    });

    fastify.get('/workouts/progression', {
        preHandler: authenticate
    }, async (request, reply) => {
        return workoutController.getExerciseProgression(request, reply);
    });
}

export default workoutRoutes;
