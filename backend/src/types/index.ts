export interface Workout {
  id: number;
  user_id: number;
  exercise_name: string;
  sets: number;
  reps: number;
  weight: number;
  duration_minutes: number;
  created_at: Date;
  updated_at: Date;
}

export interface WorkoutCreate {
  user_id: number;
  exercise_name: string;
  sets: number;
  reps: number;
  weight: number;
  duration_minutes: number;
}