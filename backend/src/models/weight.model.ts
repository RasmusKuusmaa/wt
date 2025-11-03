import database from '../config/database';
import { UserWeight, UserGoal, WeightStats } from '../types/weight.types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class WeightModel {
    async addWeight(userId: number, weight: number, date: string): Promise<number> {
        const pool = database.getPool();
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO user_weights (user_id, weight, date) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE weight = ?',
            [userId, weight, date, weight]
        );
        return result.insertId;
    }

    async getWeightHistory(userId: number, limit: number = 100): Promise<UserWeight[]> {
        const pool = database.getPool();
        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT weight_id, user_id, weight, DATE_FORMAT(date, '%Y-%m-%d') as date
             FROM user_weights
             WHERE user_id = ?
             ORDER BY date DESC
             LIMIT ?`,
            [userId, limit]
        );
        return rows.map(row => ({
            ...row,
            weight: parseFloat(row.weight)
        })) as UserWeight[];
    }

    async setGoal(userId: number, goalWeight: number): Promise<number> {
        const pool = database.getPool();
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO user_goals (user_id, goal_weight) VALUES (?, ?) ON DUPLICATE KEY UPDATE goal_weight = ?, created_at = CURRENT_TIMESTAMP',
            [userId, goalWeight, goalWeight]
        );
        return result.insertId;
    }

    async getGoal(userId: number): Promise<UserGoal | null> {
        const pool = database.getPool();
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT goal_id, user_id, goal_weight FROM user_goals WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
            [userId]
        );
        return rows.length > 0 ? ({ ...rows[0], goal_weight: parseFloat(rows[0].goal_weight) } as UserGoal) : null;
    }

    async getWeightStats(userId: number): Promise<WeightStats | null> {
        const pool = database.getPool();

        const [currentWeightRows] = await pool.query<RowDataPacket[]>(
            'SELECT weight FROM user_weights WHERE user_id = ? ORDER BY date DESC LIMIT 1',
            [userId]
        );

        if (currentWeightRows.length === 0) {
            return null;
        }

        const goal = await this.getGoal(userId);
        if (!goal) {
            return null;
        }

        const currentWeight = parseFloat(currentWeightRows[0].weight);
        const goalWeight = goal.goal_weight;
        const weightToLose = currentWeight - goalWeight;

        const [avgLossRows] = await pool.query<RowDataPacket[]>(
            `SELECT
                (MAX(weight) - MIN(weight)) / (DATEDIFF(MAX(date), MIN(date)) / 7) as avg_weekly_loss
             FROM user_weights
             WHERE user_id = ?
             AND date >= DATE_SUB(CURDATE(), INTERVAL 8 WEEK)`,
            [userId]
        );

        const avgWeeklyLoss = avgLossRows[0]?.avg_weekly_loss || 0;
        const weeksToGoal = avgWeeklyLoss > 0 ? Math.ceil(weightToLose / avgWeeklyLoss) : 0;

        const estimatedDate = new Date();
        estimatedDate.setDate(estimatedDate.getDate() + (weeksToGoal * 7));

        return {
            current_weight: currentWeight,
            goal_weight: goalWeight,
            weight_to_lose: Math.round(weightToLose * 10) / 10,
            average_weekly_loss: Math.round(avgWeeklyLoss * 10) / 10,
            weeks_to_goal: weeksToGoal,
            estimated_completion_date: estimatedDate.toISOString().split('T')[0]
        };
    }
}

export default new WeightModel();
