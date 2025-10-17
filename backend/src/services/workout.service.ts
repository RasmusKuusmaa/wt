import db from '../config/database';
import { Workout, WorkoutCreate } from '../types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class WorkoutService {
  async getAllWorkouts(): Promise<Workout[]> {
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT * FROM workouts ORDER BY created_at DESC'
    );
    
    return rows as Workout[];
  }

  async getWorkoutById(id: number): Promise<Workout | null> {
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT * FROM workouts WHERE id = ?',
      [id]
    );
    
    return rows.length > 0 ? (rows[0] as Workout) : null;
  }

  async createWorkout(data: WorkoutCreate): Promise<Workout> {
    const [result] = await db.query<ResultSetHeader>(
      `INSERT INTO workouts (user_id, exercise_name, sets, reps, weight, duration_minutes) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [data.user_id, data.exercise_name, data.sets, data.reps, data.weight, data.duration_minutes]
    );

    const workout = await this.getWorkoutById(result.insertId);
    if (!workout) {
      throw new Error('Failed to retrieve created workout');
    }
    
    return workout;
  }

  async updateWorkout(id: number, data: Partial<WorkoutCreate>): Promise<Workout | null> {
    const updates: string[] = [];
    const values: any[] = [];

    if (data.exercise_name !== undefined) {
      updates.push('exercise_name = ?');
      values.push(data.exercise_name);
    }
    if (data.sets !== undefined) {
      updates.push('sets = ?');
      values.push(data.sets);
    }
    if (data.reps !== undefined) {
      updates.push('reps = ?');
      values.push(data.reps);
    }
    if (data.weight !== undefined) {
      updates.push('weight = ?');
      values.push(data.weight);
    }
    if (data.duration_minutes !== undefined) {
      updates.push('duration_minutes = ?');
      values.push(data.duration_minutes);
    }

    if (updates.length === 0) {
      return this.getWorkoutById(id);
    }

    values.push(id);

    await db.query(
      `UPDATE workouts SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    return this.getWorkoutById(id);
  }

  async deleteWorkout(id: number): Promise<boolean> {
    const [result] = await db.query<ResultSetHeader>(
      'DELETE FROM workouts WHERE id = ?',
      [id]
    );

    return result.affectedRows > 0;
  }
}