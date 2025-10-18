import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { WorkoutService } from '../services/workout.service.js';
import type { WorkoutCreate } from '../types/index.js';

interface WorkoutParams {
  id: string;
}

export async function workoutRoutes(fastify: FastifyInstance) {
  const workoutService = new WorkoutService();

  fastify.get(
    '/workouts',
    { onRequest: [fastify.authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = request.user!.userId;
        const workouts = await workoutService.getAllWorkouts(userId);
        return {
          success: true,
          data: workouts,
          count: workouts.length
        };
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({
          success: false,
          error: 'Failed to fetch workouts'
        });
      }
    }
  );

  fastify.get<{ Params: WorkoutParams }>(
    '/workouts/:id',
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      try {
        const id = parseInt(request.params.id);
        const userId = request.user!.userId;
        const workout = await workoutService.getWorkoutById(id, userId);

        if (!workout) {
          return reply.status(404).send({
            success: false,
            error: 'Workout not found'
          });
        }

        return { success: true, data: workout };
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({
          success: false,
          error: 'Failed to fetch workout'
        });
      }
    }
  );

  fastify.post<{ Body: WorkoutCreate }>(
    '/workouts',
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      try {
        const userId = request.user!.userId;
        const workout = await workoutService.createWorkout(request.body, userId);
        return reply.status(201).send({
          success: true,
          data: workout
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({
          success: false,
          error: 'Failed to create workout'
        });
      }
    }
  );

  fastify.patch<{ Params: WorkoutParams; Body: Partial<WorkoutCreate> }>(
    '/workouts/:id',
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      try {
        const id = parseInt(request.params.id);
        const userId = request.user!.userId;
        const workout = await workoutService.updateWorkout(id, userId, request.body);

        if (!workout) {
          return reply.status(404).send({
            success: false,
            error: 'Workout not found'
          });
        }

        return { success: true, data: workout };
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({
          success: false,
          error: 'Failed to update workout'
        });
      }
    }
  );

  fastify.delete<{ Params: WorkoutParams }>(
    '/workouts/:id',
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      try {
        const id = parseInt(request.params.id);
        const userId = request.user!.userId;
        const deleted = await workoutService.deleteWorkout(id, userId);

        if (!deleted) {
          return reply.status(404).send({
            success: false,
            error: 'Workout not found'
          });
        }

        return { success: true, message: 'Workout deleted' };
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({
          success: false,
          error: 'Failed to delete workout'
        });
      }
    }
  );

  fastify.get('/health', async () => {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString()
    };
  });
}