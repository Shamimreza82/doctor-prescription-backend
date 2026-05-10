# doctor-prescription-backend Agent Guide

## Project Summary
- Backend API for a doctor prescription platform.
- Stack: Node.js 20+, Express 5, TypeScript, Prisma, PostgreSQL, Redis, BullMQ, Zod, Pino, Vitest.
- API routes are mounted under `/api/v1`.

## Current Active Modules
- `auth`
- `user`
- `onboarding`
- `patient`
- `prescription`
- `upload`

Mounted routes currently come from [src/routes/index.ts](/home/reza/codeing/doctor-prescription/doc-prescription/doctor-prescription-backend/src/routes/index.ts):
- `/auth`
- `/user`
- `/onboarding`
- `/patients`
- `/prescriptions`
- `/files`

Other modules and support code exist under `src/modules/`, but changes to public API should follow the mounted router list above.

## Common Commands
```bash
npm run dev
npm run build
npm run typecheck
npm run lint
npm run test
npm run prisma:generate
npm run prisma:migrate:dev
```

## Environment Notes
- Environment validation lives in [src/config/env.config.ts](/home/reza/codeing/doctor-prescription/doc-prescription/doctor-prescription-backend/src/config/env.config.ts).
- Keep JWT, Redis, CORS, host, trust-proxy, log-level, and rate-limit variable names aligned with that file.
- Redis is required for normal runtime startup.
- AI provider keys and model names are also validated there; if work touches AI integration, keep env naming aligned with that file.

## Architecture Rules
- Keep controllers thin: parse request, call service, return response, forward errors.
- Put business logic in services.
- Use repositories for large or reused Prisma queries.
- Keep modules isolated; shared code belongs in `src/shared/`.
- Put bootstrap/setup logic in `src/bootstrap/`.
- Put config in `src/config/`.
- Logger setup lives in `src/bootstrap/logger/`; prefer using the existing logging flow rather than introducing parallel logger wiring.
- Prefer explicit, readable code over clever abstractions.

## Module Layout
Use the existing module pattern where applicable:

```text
module/
  module.route.ts
  module.controller.ts
  module.service.ts
  module.validation.ts
  module.repository.ts
  module.constants.ts
  module.types.ts
```

Not every module needs every file, but new work should follow the prevailing structure in `src/modules/`.

## API Rules
- All externally exposed routes should remain versioned under `/api/v1`.
- Keep response shapes consistent with existing helpers and middleware, especially `src/shared/utils/sendResponse.ts`.
- Include pagination metadata for list endpoints when relevant.
- Do not add ad hoc response formats per controller.

## Validation And Errors
- Validate body, params, and query input with Zod.
- Keep validation schemas close to the module that owns them.
- Use centralized error handling.
- Throw structured application errors, not raw strings.
- Convert Prisma/database failures into API-safe errors.
- Reuse shared helpers such as `AppError`, `catchAsync`, `sendError`, and pagination utilities when they fit the existing pattern.

## Authorization And Tenant Safety
- Enforce authentication and authorization in middleware/services, not inline controller logic unless unavoidable.
- Use constants or enums for roles and permissions.
- Any tenant-owned resource must be filtered by `tenantId`.
- Never trust tenant scoping from the client.
- Super-admin bypasses must be explicit.

## Data And Transaction Rules
- Use transactions for multi-step workflows such as onboarding, provisioning, or linked record creation.
- Avoid large Prisma queries inside controllers.
- Create a repository only when it improves readability or reuse; skip it for trivial CRUD.

## Logging And Security
- Log operationally important events and errors with context.
- Use audit-style logging for sensitive actions.
- Never log passwords, tokens, or secrets.
- Redis, BullMQ, and audit-related plumbing already live under `src/shared/queues/` and `src/shared/services/`; extend those patterns instead of creating one-off infrastructure code.

## Working Style
Before changing code:
1. Inspect the existing module and adjacent patterns.
2. Match current naming, file placement, and response conventions.
3. Check whether a shared helper, queue, logger, or utility already exists.
4. Verify auth, tenant, validation, and transaction concerns before implementation.

## Done Criteria
A change is only complete when:
- it follows the current project structure,
- input validation exists where required,
- authorization and tenant boundaries are preserved,
- response formatting stays consistent,
- no unrelated files are changed,
- the code is type-safe and readable.
