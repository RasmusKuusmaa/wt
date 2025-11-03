import database from '../config/database';
import { Workout, WorkoutExercise, WorkoutSet, ExerciseProgression } from '../types/exercise.types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class WorkoutModel {
    async createWorkout(userId: number, date: string): Promise<number> {
        const pool = database.getPool();
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO workouts (user_id, date) VALUES (?, ?)',
            [userId, date]
        );
        return result.insertId;
    }

    async addWorkoutExercise(
        workoutId: number,
        exerciseId: number,
        setNumber: number,
        weight: number,
        reps: number
    ): Promise<number> {
        const pool = database.getPool();
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO workout_exercises (workout_id, exercise_id, set_number, weight, reps) VALUES (?, ?, ?, ?, ?)',
            [workoutId, exerciseId, setNumber, weight, reps]
        );
        return result.insertId;
    }

    async getWorkoutsByUser(userId: number, limit: number = 50): Promise<Workout[]> {
        const pool = database.getPool();
        const [workoutRows] = await pool.query<RowDataPacket[]>(
            `SELECT w.workout_id, w.user_id, DATE_FORMAT(w.date, '%Y-%m-%d') as date
             FROM workouts w
             WHERE w.user_id = ?
             ORDER BY w.date DESC
             LIMIT ?`,
            [userId, limit]
        );

        const workouts: Workout[] = [];

        for (const workout of workoutRows) {
            const [exerciseRows] = await pool.query<RowDataPacket[]>(
                `SELECT we.exercise_id, e.name as exercise_name, we.set_number, we.weight, we.reps
                 FROM workout_exercises we
                 JOIN exercises e ON we.exercise_id = e.exercise_id
                 WHERE we.workout_id = ?
                 ORDER BY we.exercise_id, we.set_number`,
                [workout.workout_id]
            );

            const exercisesMap = new Map<number, WorkoutExercise>();

            for (const row of exerciseRows) {
                if (!exercisesMap.has(row.exercise_id)) {
                    exercisesMap.set(row.exercise_id, {
                        exercise_id: row.exercise_id,
                        exercise_name: row.exercise_name,
                        sets: []
                    });
                }

                const exercise = exercisesMap.get(row.exercise_id)!;
                exercise.sets.push({
                    set_number: row.set_number,
                    weight: parseFloat(row.weight),
                    reps: row.reps
                });
            }

            workouts.push({
                workout_id: workout.workout_id,
                user_id: workout.user_id,
                date: workout.date,
                exercises: Array.from(exercisesMap.values())
            });
        }

        return workouts;
    }

    async getExerciseProgression(userId: number): Promise<ExerciseProgression[]> {
        const pool = database.getPool();
        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT
                e.exercise_id,
                e.name as exercise_name,
                c.name as category_name,
                MIN(w.date) as first_date,
                MAX(w.date) as last_date,
                (
                    SELECT AVG(we1.weight * we1.reps)
                    FROM workout_exercises we1
                    JOIN workouts w1 ON we1.workout_id = w1.workout_id
                    WHERE we1.exercise_id = e.exercise_id
                    AND w1.user_id = ?
                    AND w1.date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
                ) as recent_avg_volume,
                (
                    SELECT AVG(we2.weight * we2.reps)
                    FROM workout_exercises we2
                    JOIN workouts w2 ON we2.workout_id = w2.workout_id
                    WHERE we2.exercise_id = e.exercise_id
                    AND w2.user_id = ?
                    AND w2.date >= DATE_SUB(CURDATE(), INTERVAL 14 DAY)
                    AND w2.date < DATE_SUB(CURDATE(), INTERVAL 7 DAY)
                ) as previous_avg_volume
            FROM exercises e
            JOIN categories c ON e.category_id = c.category_id
            JOIN workout_exercises we ON e.exercise_id = we.exercise_id
            JOIN workouts w ON we.workout_id = w.workout_id
            WHERE w.user_id = ?
            GROUP BY e.exercise_id, e.name, c.name
            HAVING recent_avg_volume IS NOT NULL
            ORDER BY c.name, e.name`,
            [userId, userId, userId]
        );

        return rows.map(row => {
            const recentVolume = row.recent_avg_volume || 0;
            const previousVolume = row.previous_avg_volume || recentVolume;
            const weeklyProgression = previousVolume > 0
                ? ((recentVolume - previousVolume) / previousVolume) * 100
                : 0;

            return {
                exercise_id: row.exercise_id,
                exercise_name: row.exercise_name,
                category_name: row.category_name,
                weekly_progression: Math.round(weeklyProgression * 10) / 10,
                total_volume_change: Math.round((recentVolume - previousVolume) * 10) / 10
            };
        });
    }
}

export default new WorkoutModel();
