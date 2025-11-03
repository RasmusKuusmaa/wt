import exerciseModel from '../models/exercise.model';
import { Category, Exercise } from '../types/exercise.types';

export class ExerciseService {
    async getAllCategories(): Promise<Category[]> {
        return await exerciseModel.getAllCategories();
    }

    async getExercisesByCategory(categoryId: number): Promise<Exercise[]> {
        return await exerciseModel.getExercisesByCategory(categoryId);
    }

    async getAllExercises(): Promise<Exercise[]> {
        return await exerciseModel.getAllExercises();
    }
}

export default new ExerciseService();
