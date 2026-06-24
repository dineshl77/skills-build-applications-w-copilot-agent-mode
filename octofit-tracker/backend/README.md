# OctoFit Tracker Backend

TypeScript Node.js Express API for the OctoFit Tracker multi-tier application.

## Setup

```bash
npm --prefix octofit-tracker/backend install
```

## Scripts

- `npm --prefix octofit-tracker/backend run dev` - Start dev server with hot reload (ts-node-dev)
- `npm --prefix octofit-tracker/backend run build` - Build TypeScript to `dist/`
- `npm --prefix octofit-tracker/backend run start` - Run compiled server
- `npm --prefix octofit-tracker/backend run seed` - Populate MongoDB with sample data
- `npm --prefix octofit-tracker/backend test` - Run integration tests

## API Endpoints

### Configuration
- **GET** `/api/config` - Get API configuration with environment and URL info
  - Returns: `{ apiUrl, environment, version }`
  - Codespaces-aware: Uses `CODESPACE_NAME` to build API URL

### Users
- **POST** `/api/users` - Create user
  - Body: `{ name, email }`
- **GET** `/api/users` - List all users
- **GET** `/api/users/:id` - Get user by ID
- **PUT** `/api/users/:id` - Update user
- **DELETE** `/api/users/:id` - Delete user

### Teams
- **POST** `/api/teams` - Create team
  - Body: `{ name }`
- **GET** `/api/teams` - List all teams with members
- **POST** `/api/teams/:id/members` - Add user to team
  - Body: `{ userId }`

### Activities
- **POST** `/api/activities` - Log activity
  - Body: `{ user, team?, type, distance?, duration?, calories?, date? }`
- **GET** `/api/activities` - List activities (supports filters: `?user=id`, `?team=id`)
- **GET** `/api/activities/:id` - Get activity by ID

### Workouts
- **POST** `/api/workouts` - Create planned workout
  - Body: `{ user, team?, title, type, targetDuration?, targetDistance?, scheduledDate }`
- **GET** `/api/workouts` - List workouts (supports filters: `?user=id`, `?team=id`, `?completed=true|false`)
- **GET** `/api/workouts/:id` - Get workout by ID
- **PUT** `/api/workouts/:id` - Update workout (e.g., mark as completed)
- **DELETE** `/api/workouts/:id` - Delete workout

### Leaderboards
- **GET** `/api/leaderboards/top` - Get top performers
  - Query params: `?scope=user|team&limit=10`
  - Aggregates total distance by user or team

## Environment Variables

- `PORT` - Server port (default: `8000`)
- `MONGO_URI` - MongoDB connection string (default: `mongodb://localhost:27017/octofit`)
- `CODESPACE_NAME` - GitHub Codespaces name (auto-detected for API URL)
- `API_URL` - Custom API URL for production

## Development

Run backend and frontend dev servers:

```bash
npm --prefix octofit-tracker/backend run dev
npm --prefix octofit-tracker/frontend run dev
```

Backend: http://localhost:8000
Frontend: http://localhost:5173

## Testing

Run integration tests (uses local MongoDB):

```bash
npm --prefix octofit-tracker/backend test
```

Seed sample data:

```bash
npm --prefix octofit-tracker/backend run seed
```

## Project Structure

```
octofit-tracker/backend/
├── src/
│   ├── app.ts           # Express app setup
│   ├── index.ts         # Server entry point
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Route handlers
│   └── seed.ts          # Seed data script
├── tests/               # Integration tests
├── package.json
├── tsconfig.json
└── jest.config.ts
```
