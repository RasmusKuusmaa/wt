# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a wellness/health tracker application with:
- **Backend**: TypeScript/Node.js API using Fastify
- **Frontend**: .NET MAUI cross-platform mobile app (Android, iOS, macOS, Windows)
- **Database**: MySQL

## Backend (TypeScript/Fastify)

### Location
- `backend/` directory
- Source code in `backend/src/`

### Development Commands

```bash
# Install dependencies
cd backend && npm install

# Development mode (with auto-reload)
npm run dev

# Build TypeScript to JavaScript
npm run build

# Run production build
npm start

# Clean build artifacts
npm run clean
```

### Architecture

The backend follows a layered architecture with path aliases configured in `tsconfig.json`:

- **Routes** (`@routes/*`): Route definitions and registration
  - Main router: `src/routes/index.ts` registers all route modules
  - Routes prefixed under `/api/auth` for user authentication
  - Health check endpoint: `GET /health`

- **Controllers** (`@controllers/*`): Request/response handling
  - Controllers handle HTTP layer, return `ApiResponse` format
  - Error handling delegated to global error handler

- **Services** (`@services/*`): Business logic layer
  - `UserService`: User registration, login, authentication logic
  - Uses bcrypt for password hashing (10 salt rounds)
  - JWT token generation for authenticated sessions

- **Models** (`@models/*`): Database operations
  - Direct MySQL2 pool queries
  - User model handles CRUD operations for users table

- **Middleware** (`@middleware/*`):
  - `auth.ts`: JWT bearer token authentication middleware
  - `errorHandler.ts`: Global error handling
  - `cors.ts`: CORS configuration

- **Config** (`@config/*`):
  - `database.ts`: Singleton MySQL connection pool with keepalive
  - `env.ts`: Environment variable configuration

- **Utils** (`@utils/*`):
  - `jwt.ts`: Token generation and verification
  - `logger.ts`: Application logging

### Database Connection

- MySQL2 connection pool (singleton pattern)
- Configuration via environment variables (see `.env.example`)
- Default database: `wellnesstracker`
- Connection pool limit: 10 (configurable via `DB_CONNECTION_LIMIT`)
- Graceful shutdown on SIGINT/SIGTERM closes pool

### API Response Format

All API responses follow this structure:
```typescript
{
  success: boolean,
  data?: any,
  message?: string,
  error?: string
}
```

### Authentication Flow

1. Registration: `POST /api/auth/register` - creates user with hashed password
2. Login: `POST /api/auth/login` - returns JWT token
3. Protected routes use `authenticate` middleware expecting `Authorization: Bearer <token>`
4. User payload attached to `request.user` after authentication

## Frontend (.NET MAUI)

### Location
- `frontend/ht/` directory

### Development Commands

```bash
# Build the project
dotnet build frontend/ht/ht.sln

# Run on specific platform (from ht directory)
dotnet build -f net8.0-android
dotnet build -f net8.0-ios
dotnet build -f net8.0-windows10.0.19041.0

# Clean build artifacts
dotnet clean frontend/ht/ht.sln
```

### Architecture

The frontend follows MVVM pattern:

- **Views** (`Views/`): XAML pages
  - `LoginPage`: User login
  - `RegisterPage`: User registration
  - `WorkoutPage`, `NutritionPage`, `StatsPage`: Main tab pages

- **ViewModels** (`ViewModels/`):
  - `BaseViewModel`: Base class for ViewModels
  - `LoginViewModel`, `RegisterViewModel`: Handle auth logic

- **Models** (`Models/`):
  - `User.cs`: User data model

- **Navigation**:
  - Shell-based navigation defined in `AppShell.xaml`
  - Login/Register pages use standard Shell navigation
  - Main app uses TabBar with 3 tabs: Workout, Nutrition, Stats
  - Flyout disabled (`Shell.FlyoutBehavior="Disabled"`)

### Platform Configuration

- **Android**: Network security config at `Platforms/Android/Resources/values/xml/network_security_config.xml`
  - Required for cleartext HTTP traffic to localhost backend during development
- Minimum Android API: 21
- Minimum iOS: 11.0
- Minimum Windows: 10.0.17763.0

### Target Frameworks
- `net8.0-android`
- `net8.0-ios`
- `net8.0-maccatalyst`
- `net8.0-windows10.0.19041.0`

## Environment Setup

1. Create `backend/.env` file with database credentials:
   ```
   PORT=5020
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=wellnesstracker
   ```

2. Ensure MySQL is running with `wellnesstracker` database created

3. Backend runs on `0.0.0.0:5020` by default

## Git Workflow

- Main branch: `master`
- Recent work includes auth system implementation and Android network configuration
