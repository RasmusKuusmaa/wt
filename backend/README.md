# Workout Tracker Backend

A secure Fastify backend with JWT authentication for the Workout Tracker MAUI app.

## Features

- **JWT Authentication**: Access tokens (15min) + Refresh tokens (7 days)
- **Secure Password Hashing**: bcrypt with 12 salt rounds
- **Redis Session Management**: Refresh tokens stored in Redis
- **Prisma ORM**: Type-safe database queries
- **User Ownership**: Users can only access their own workouts
- **CORS Protection**: Restricted to allowed origins

## Tech Stack

- **Fastify** - Fast web framework
- **Prisma** - Modern ORM for MySQL
- **JWT** - Token-based authentication
- **Redis** - Session/refresh token storage
- **bcrypt** - Password hashing
- **TypeScript** - Type safety

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Update `.env` with your settings:

```env
PORT=3200
HOST=127.0.0.1

# Database Configuration
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=workouttracker

# Prisma Database URL
DATABASE_URL="mysql://root:your_password@localhost:3306/workouttracker"

# Redis Configuration
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT Configuration (CHANGE THESE IN PRODUCTION!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key-change-this-in-production
```

### 3. Run Prisma Migration

```bash
cd backend
npx prisma migrate reset --force
npx prisma migrate dev --name init_auth_system
npx prisma generate
```

This will:
- Drop all existing tables
- Create `users` and `workouts` tables
- Generate Prisma Client

### 4. Start Redis

Make sure Redis is running:

```bash
# On Windows with Redis installed:
redis-server

# On Linux/Mac:
redis-server
```

### 5. Start Development Server

```bash
npm run dev
```

The server will start at `http://127.0.0.1:3200`

## API Endpoints

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe" // optional
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** Same as register

#### Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc...",
    "user": { ... }
  }
}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <access_token>
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <access_token>
```

### Workout Endpoints (All Require Authentication)

#### Get All Workouts
```http
GET /api/workouts
Authorization: Bearer <access_token>
```

#### Get Workout by ID
```http
GET /api/workouts/:id
Authorization: Bearer <access_token>
```

#### Create Workout
```http
POST /api/workouts
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "exercise_name": "Bench Press",
  "sets": 3,
  "reps": 10,
  "weight": 185.5,
  "duration_minutes": 15
}
```

#### Update Workout
```http
PATCH /api/workouts/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "weight": 190,
  "reps": 12
}
```

#### Delete Workout
```http
DELETE /api/workouts/:id
Authorization: Bearer <access_token>
```

### Health Check
```http
GET /api/health
```

## Security Features

### Password Requirements
- Minimum 8 characters
- Hashed with bcrypt (12 rounds)

### Token Expiry
- **Access Token**: 15 minutes
- **Refresh Token**: 7 days (stored in Redis)

### User Ownership
- Users can only access their own workouts
- All workout endpoints enforce user ownership checks

### CORS
- Restricted to allowed origins (configure in `app.ts`)
- Mobile apps without origin are allowed

## Database Schema

### User Table
```prisma
model User {
  id        Int       @id @default(autoincrement())
  email     String    @unique
  password  String    // bcrypt hashed
  name      String?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  workouts  Workout[]
}
```

### Workout Table
```prisma
model Workout {
  id              Int      @id @default(autoincrement())
  userId          Int
  exerciseName    String
  sets            Int
  reps            Int
  weight          Float
  durationMinutes Int
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  user            User     @relation(fields: [userId], references: [id])
}
```

## Development

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

## Troubleshooting

### Database Connection Issues
- Ensure MySQL is running
- Check `DATABASE_URL` in `.env`
- Verify database exists

### Redis Connection Issues
- Ensure Redis is running on port 6379
- Check `REDIS_HOST` and `REDIS_PORT` in `.env`

### JWT Issues
- Ensure `JWT_SECRET` is set in `.env`
- Check token expiry times
- Verify Authorization header format: `Bearer <token>`

## Production Considerations

1. **Change JWT Secrets**: Generate strong random secrets
2. **Update CORS Origins**: Add your actual frontend/mobile app URLs
3. **Enable HTTPS**: Use TLS/SSL certificates
4. **Rate Limiting**: Add rate limiting middleware
5. **Logging**: Configure production logging
6. **Database**: Use connection pooling and read replicas
7. **Redis**: Configure Redis persistence and clustering

## License

ISC
