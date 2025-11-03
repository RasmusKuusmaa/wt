export interface UserWeight {
    weight_id?: number;
    user_id: number;
    weight: number;
    date: string;
}

export interface UserGoal {
    goal_id?: number;
    user_id: number;
    goal_weight: number;
}

export interface WeightStats {
    current_weight: number;
    goal_weight: number;
    weight_to_lose: number;
    average_weekly_loss: number;
    weeks_to_goal: number;
    estimated_completion_date: string;
}

export interface UpdateWeightDTO {
    weight: number;
    date?: string;
}

export interface UpdateGoalDTO {
    goal_weight: number;
}
