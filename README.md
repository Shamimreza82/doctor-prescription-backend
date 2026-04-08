# doctor-prescription-backend

TypeScript/Express backend for a doctor prescription platform. The service uses Prisma with PostgreSQL, Redis, BullMQ workers, Zod validation, and Swagger UI.

## Current Scope

Implemented or in-progress modules in this repository:

- `auth`
- `doctor`
- `onboarding`
- `patient`

Currently mounted routes:

- `GET /` - basic health/status response
- `GET /docs` - Swagger UI
- `POST /api/v1/auth/register` - super admin only
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh-token`
- `POST /api/v1/onboarding/doctors` - super admin only
- `POST /api/v1/patients` - doctor or assistant only
- `GET /api/v1/patients` - doctor or assistant only
- `GET /api/v1/patients/:id` - doctor or assistant only
- `PATCH /api/v1/patients/:id` - doctor or assistant only
- `DELETE /api/v1/patients/:id` - doctor or assistant only

## Stack

- Node.js 20+
- TypeScript
- Express 5
- Prisma
- PostgreSQL
- Redis
- BullMQ
- Zod
- Pino
- Vitest

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and update values as needed.

Example runtime variables:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/hospital_management?schema=public
NODE_ENV=development
PORT=4000
HOST=0.0.0.0
CORS_ENABLED=true
CORS_ORIGINS=*
TRUST_PROXY=false
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=120
JWT_ACCESS_SECRET=dev-access-secret-change-me
JWT_REFRESH_SECRET=dev-refresh-secret-change-me
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=365d
REDIS_URL=redis://127.0.0.1:6379
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
LOG_LEVEL=debug
HTTP_LOG_LEVEL=info
```

Note: the app validates environment variables from `src/config/env.config.ts`. Keep the JWT variable names aligned with that file.

### 3. Prepare the database

```bash
npm run prisma:generate
npm run prisma:migrate:dev
```

Optional seed flow:

```bash
npx prisma db seed
```

### 4. Start Redis

Redis must be available before the app starts because workers and runtime services are initialized during bootstrap.

### 5. Run the app

```bash
npm run dev
```

Production build:

```bash
npm run build
npm start
```

## Useful Commands

```bash
npm run dev
npm run build
npm run start
npm run typecheck
npm run lint
npm run lint:fix
npm run format
npm run format:check
npm run test
npm run test:coverage
npm run test:watch
npm run test:auth
npm run prisma:generate
npm run prisma:migrate:dev
npm run prisma:migrate:deploy
npm run prisma:reset
npm run prisma:studio
```

## Project Layout

```text
src/
  bootstrap/
  config/
  docs/
  middlewares/
  modules/
  routes/
  shared/
  tests/
  workers/
prisma/
  migrations/
  seed/
  *.prisma
docs/
  ai-prompts/
```

## Notes

- Swagger UI is available at `/docs`.
- The repository contains prompt files under `docs/ai-prompts/` for internal scaffolding workflows.
- Some modules exist in the source tree without being mounted yet. Check `src/routes/index.ts` for the current public API surface.
