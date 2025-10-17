import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { WorkoutService } from '../services/workout.service';
import { WorkoutCreate } from '../types';

interface WorkoutParams {
  id: string;
}

export async function workoutRoutes(fastify: FastifyInstance) {
  const workoutService = new WorkoutService();

  // Get all workouts
  fastify.get('/workouts', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const workouts = await workoutService.getAllWorkouts();
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
  });

  // Get workout by ID
  fastify.get<{ Params: WorkoutParams }>('/workouts/:id', async (request, reply) => {
    try {
      const id = parseInt(request.params.id);
      const workout = await workoutService.getWorkoutById(id);
      
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
  });

  // Create workout
  fastify.post<{ Body: WorkoutCreate }>('/workouts', async (request, reply) => {
    try {
      const workout = await workoutService.createWorkout(request.body);
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
  });

  // Update workout
  fastify.patch<{ Params: WorkoutParams; Body: Partial<WorkoutCreate> }>(
    '/workouts/:id', 
    async (request, reply) => {
      try {
        const id = parseInt(request.params.id);
        const workout = await workoutService.updateWorkout(id, request.body);
        
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

  // Delete workout
  fastify.delete<{ Params: WorkoutParams }>('/workouts/:id', async (request, reply) => {
    try {
      const id = parseInt(request.params.id);
      const deleted = await workoutService.deleteWorkout(id);
      
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
  });

  fastify.get('/health', async () => {
    return { 
      status: 'healthy', 
      timestamp: new Date().toISOString() 
    };
  });
}