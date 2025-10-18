import prisma from '../config/prisma.js';
import type { WorkoutCreate } from '../types/index.js';

export class WorkoutService {
  async getAllWorkouts(userId: number) {
    return prisma.workout.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getWorkoutById(id: number, userId: number) {
    return prisma.workout.findFirst({
      where: { id, userId },
    });
  }

  async createWorkout(data: WorkoutCreate, userId: number) {
    return prisma.workout.create({
      data: {
        userId,
        exerciseName: data.exercise_name,
        sets: data.sets,
        reps: data.reps,
        weight: data.weight,
        durationMinutes: data.duration_minutes,
      },
    });
  }

  async updateWorkout(id: number, userId: number, data: Partial<WorkoutCreate>) {
    const workout = await this.getWorkoutById(id, userId);
    if (!workout) {
      return null;
    }

    const updateData: any = {};

    if (data.exercise_name !== undefined) updateData.exerciseName = data.exercise_name;
    if (data.sets !== undefined) updateData.sets = data.sets;
    if (data.reps !== undefined) updateData.reps = data.reps;
    if (data.weight !== undefined) updateData.weight = data.weight;
    if (data.duration_minutes !== undefined) updateData.durationMinutes = data.duration_minutes;

    if (Object.keys(updateData).length === 0) {
      return workout;
    }

    return prisma.workout.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteWorkout(id: number, userId: number): Promise<boolean> {
    try {
      const result = await prisma.workout.deleteMany({
        where: { id, userId },
      });

      return result.count > 0;
    } catch (error) {
      return false;
    }
  }
}