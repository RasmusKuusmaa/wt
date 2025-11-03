import workoutModel from '../models/workout.model';
import { CreateWorkoutDTO, Workout, ExerciseProgression } from '../types/exercise.types';
import { AppError } from '../types/common.types';

export class WorkoutService {
    async createWorkout(userId: number, workoutData: CreateWorkoutDTO): Promise<Workout> {
        if (!workoutData.exercises || workoutData.exercises.length === 0) {
            throw new AppError(400, 'Workout must contain at least one exercise');
        }

        const workoutId = await workoutModel.createWorkout(userId, workoutData.date);

        for (const exercise of workoutData.exercises) {
            if (!exercise.sets || exercise.sets.length === 0) {
                throw new AppError(400, 'Each exercise must have at least one set');
            }

            let setNumber = 1;
            for (const set of exercise.sets) {
                if (set.weight < 0 || set.reps <= 0) {
                    throw new AppError(400, 'Invalid weight or reps value');
                }

                await workoutModel.addWorkoutExercise(
                    workoutId,
                    exercise.exercise_id,
                    setNumber,
                    set.weight,
                    set.reps
                );
                setNumber++;
            }
        }

        const workouts = await workoutModel.getWorkoutsByUser(userId, 1);
        return workouts[0];
    }

    async getWorkoutsByUser(userId: number, limit: number = 50): Promise<Workout[]> {
        return await workoutModel.getWorkoutsByUser(userId, limit);
    }

    async getExerciseProgression(userId: number): Promise<ExerciseProgression[]> {
        return await workoutModel.getExerciseProgression(userId);
    }
}

export default new WorkoutService();
