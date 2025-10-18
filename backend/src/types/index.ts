export type Workout = {
  id: number;
  user_id: number;
  exercise_name: string;
  sets: number;
  reps: number;
  weight: number;
  duration_minutes: number;
  created_at: Date;
  updated_at: Date;
};

export type WorkoutCreate = {
  exercise_name: string;
  sets: number;
  reps: number;
  weight: number;
  duration_minutes: number;
};

// Auth Types
export type RegisterDTO = {
  email: string;
  password: string;
  name?: string;
};

export type LoginDTO = {
  email: string;
  password: string;
};

export type TokenResponse = {
  accessToken: string;
  refreshToken: string;
  user: UserResponse;
};

export type UserResponse = {
  id: number;
  email: string;
  name: string | null;
  createdAt: Date;
};

export type RefreshTokenDTO = {
  refreshToken: string;
};

// JWT Payload
export type JWTPayload = {
  userId: number;
  email: string;
};

// Augment Fastify Request with JWT user
declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: JWTPayload;
    user: JWTPayload;
  }
}