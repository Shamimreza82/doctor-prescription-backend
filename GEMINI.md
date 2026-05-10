# doctor-prescription-backend Agent Guide

## Project Summary
- Backend API for a doctor prescription platform.
- Stack: Node.js 20+, Express 5, TypeScript 5.9, Prisma 7, PostgreSQL.
- API routes are mounted under `/api/v1`.
- API Documentation (OpenAPI/Swagger) is available at `/docs`.

## Current Active Modules
Mounted routes in [src/routes/index.ts](src/routes/index.ts):
- `auth` -> `/auth`
- `user` -> `/user`
- `onboarding` -> `/onboarding`
- `patients` -> `/patients`
- `prescriptions` -> `/prescriptions`
- `files` (upload) -> `/files`

Other modules like `ai` and `doctor` exist but may not be fully mounted yet.

## Common Commands
```bash
npm run dev               # Start development server
npm run build             # Build the project
npm run typecheck         # Run TypeScript type check
npm run lint              # Run ESLint
npm run format            # Run Prettier
npm run prisma:generate   # Generate Prisma client
npm run prisma:migrate:dev # Run Prisma migrations
npm run create:module <name> # Scaffold a new module (uses a nested structure)
```

## Environment Notes
- Environment validation lives in [src/config/env.config.ts](src/config/env.config.ts).
- Key variables: `DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `CORS_ORIGINS`.
- AI providers (Gemini, OpenAI, Claude, Ollama) are supported via environment configuration.

## Architecture Rules
- **Flat Module Structure:** Existing modules follow a flat layout in `src/modules/<module>/`:
  - `module.route.ts`
  - `module.controller.ts`
  - `module.service.ts`
  - `module.validation.ts`
  - `module.repository.ts`
  - `module.constants.ts`
  - `module.types.ts`
- **Prisma Multi-Schema:** Prisma models are split across multiple files in the `prisma/` directory (e.g., `doctor.prisma`, `patient.prisma`).
- **OpenAPI Documentation:** Documentation is centrally managed in `src/docs/openapi/`. Path definitions and schemas should be updated there when adding new endpoints.
- **Thin Controllers:** Parse requests using Zod, call services, and return responses using `sendResponse`.
- **Business Logic:** Keep business logic in services.
- **Shared Code:** Utilities and shared logic belong in `src/shared/`.
- **Response Format:** Always use `sendResponse` for successes and `AppError`/`globalErrorHandler` for errors to maintain consistent JSON shapes.

## API Rules
- All externally exposed routes should remain versioned under `/api/v1`.
- Use the `Role` enum from `src/shared/constend/auth.const.ts` for authorization.
- Roles: `SUPER_ADMIN`, `MR`, `DOCTOR`, `ASSISTANT`, `PATIENT`.

## Validation And Errors
- Validate body, params, and query input with Zod using the `validateRequest` middleware.
- Throw structured `AppError` instances, which are handled by `globalErrorHandler`.
- Use `catchAsync` to wrap controller methods.

## Authorization And Tenant Safety
- Use the `auth` middleware for protecting routes.
- Tenant-owned resources must be scoped by `tenantId` (or `hospitalId` depending on the model).

## Working Style
1. Match current naming, flat file placement, and response conventions.
2. Check `src/shared/utils/` for helpers like `sendResponse`, `catchAsync`, `pagination`.
3. Update OpenAPI documentation in `src/docs/openapi/` for any new routes or schema changes.
4. If modifying the database, update the relevant `.prisma` file in `prisma/` and run `npm run prisma:generate`.

## Done Criteria
- Change follows the flat module structure.
- Input validation (Zod) is implemented via `validateRequest`.
- Authorization (Roles) is enforced.
- OpenAPI documentation is updated.
- Response formatting uses `sendResponse`.
- Code is type-safe and linted.
