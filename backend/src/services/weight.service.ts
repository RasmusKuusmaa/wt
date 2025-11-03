import weightModel from '../models/weight.model';
import { UpdateWeightDTO, UpdateGoalDTO, UserWeight, WeightStats } from '../types/weight.types';
import { AppError } from '../types/common.types';

export class WeightService {
    async addWeight(userId: number, weightData: UpdateWeightDTO): Promise<UserWeight> {
        if (weightData.weight <= 0) {
            throw new AppError(400, 'Weight must be a positive number');
        }

        const date = weightData.date || new Date().toISOString().split('T')[0];
        await weightModel.addWeight(userId, weightData.weight, date);

        return {
            user_id: userId,
            weight: weightData.weight,
            date
        };
    }

    async getWeightHistory(userId: number): Promise<UserWeight[]> {
        return await weightModel.getWeightHistory(userId);
    }

    async setGoal(userId: number, goalData: UpdateGoalDTO): Promise<void> {
        if (goalData.goal_weight <= 0) {
            throw new AppError(400, 'Goal weight must be a positive number');
        }

        await weightModel.setGoal(userId, goalData.goal_weight);
    }

    async getWeightStats(userId: number): Promise<WeightStats | null> {
        return await weightModel.getWeightStats(userId);
    }
}

export default new WeightService();
