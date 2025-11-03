export interface Category {
    category_id: number;
    name: string;
}

export interface Exercise {
    exercise_id: number;
    name: string;
    category_id: number;
    category_name?: string;
}

export interface WorkoutExercise {
    exercise_id: number;
    exercise_name: string;
    sets: WorkoutSet[];
}

export interface WorkoutSet {
    set_number: number;
    weight: number;
    reps: number;
}

export interface Workout {
    workout_id?: number;
    user_id: number;
    date: string;
    exercises: WorkoutExercise[];
}

export interface CreateWorkoutDTO {
    date: string;
    exercises: {
        exercise_id: number;
        sets: {
            weight: number;
            reps: number;
        }[];
    }[];
}

export interface ExerciseProgression {
    exercise_id: number;
    exercise_name: string;
    category_name: string;
    weekly_progression: number;
    total_volume_change: number;
}
