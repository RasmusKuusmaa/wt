import database from '../config/database';
import { Category, Exercise } from '../types/exercise.types';
import { RowDataPacket } from 'mysql2';

export class ExerciseModel {
    async getAllCategories(): Promise<Category[]> {
        const pool = database.getPool();
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT category_id, name FROM categories ORDER BY name'
        );
        return rows as Category[];
    }

    async getExercisesByCategory(categoryId: number): Promise<Exercise[]> {
        const pool = database.getPool();
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT exercise_id, name, category_id FROM exercises WHERE category_id = ? ORDER BY name',
            [categoryId]
        );
        return rows as Exercise[];
    }

    async getAllExercises(): Promise<Exercise[]> {
        const pool = database.getPool();
        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT e.exercise_id, e.name, e.category_id, c.name as category_name
             FROM exercises e
             JOIN categories c ON e.category_id = c.category_id
             ORDER BY c.name, e.name`
        );
        return rows as Exercise[];
    }

    async getExerciseById(exerciseId: number): Promise<Exercise | null> {
        const pool = database.getPool();
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT exercise_id, name, category_id FROM exercises WHERE exercise_id = ?',
            [exerciseId]
        );
        return rows.length > 0 ? (rows[0] as Exercise) : null;
    }
}

export default new ExerciseModel();
