# Backend Rules

## Project Context
This is a modular multi-tenant backend application.

## Tech Stack
- Node.js
- Express.js
- TypeScript
- Prisma
- PostgreSQL
- Redis
- Zod

## Core Principles
- Keep controllers thin
- Put business logic in services
- Use repository layer for complex DB logic
- Keep modules isolated
- Prefer reusable helpers over duplicated logic
- Write explicit, readable code over clever code

## Architecture Rules
- All APIs must be versioned under `/api/v1`
- Each feature must belong to a clear module
- One module should not directly own another module's business logic
- Shared logic goes into `common/`
- Bootstrap/setup logic goes into `bootstrap/`
- Configuration goes into `config/`

## Folder Rules
Each major module should follow this pattern:

module/
- module.route.ts
- module.controller.ts
- module.service.ts
- module.validation.ts
- module.repository.ts (if needed)
- module.constants.ts
- module.types.ts

## Controller Rules
Controllers should only:
- receive request
- call service
- send formatted response
- pass errors to global handler

Controllers must NOT:
- contain complex business logic
- contain large Prisma queries
- contain transaction logic
- contain authorization rules inline

## Service Rules
Services should:
- hold business logic
- orchestrate workflows
- call repositories or Prisma
- validate business rules
- enforce tenant boundary
- use transactions where needed

## Repository Rules
Use repository when:
- query is large
- query is reused
- module is complex
- abstraction improves readability

Do not create repository for trivial CRUD unless needed.

## Validation Rules
- Use Zod for body, params, and query validation
- Validate all external input
- Keep validation schemas close to the module

## Error Handling Rules
- Use centralized error handling
- Use `AppError` for operational errors
- Never throw plain random strings
- Prisma errors should be transformed into friendly API errors

## Response Rules
Use standard response helpers:
- success response
- error response
- pagination meta when listing data

Response shape should remain consistent across all modules.

## Multi-Tenant Rules
- Every tenant-owned resource must include `tenantId`
- Never query tenant data without tenant filter
- Never trust tenant filtering from frontend
- Tenant boundary must be enforced in service/repository layer
- Super admin bypass must be explicit, not accidental

## Authorization Rules
- Auth middleware verifies user
- Authorization middleware checks permissions/roles
- Do not hardcode authorization deep inside controller unless necessary
- Use enums/constants for roles and permissions

## Transaction Rules
Use transactions for multi-step operations like:
- onboarding
- provisioning
- subscription setup
- doctor creation with linked records
- billing workflows

## Logging Rules
- Log important system events
- Log errors with context
- Log sensitive actions in audit logs
- Never log passwords, tokens, or secrets

## Naming Rules
- Use consistent naming
- File names: `doctor.service.ts`
- Method names: `createDoctor`, `getDoctorById`, `listDoctors`
- Avoid mixed naming styles

## Code Quality Rules
- Keep functions focused
- Avoid giant files
- Avoid deeply nested logic when possible
- Prefer early returns
- Prefer explicit types where helpful
- Keep code easy to test

## Before Writing Code
Always:
1. inspect existing project patterns
2. follow current style
3. check naming conventions
4. check tenant rules
5. check if helper already exists

## Done Criteria
A task is complete only if:
- code follows project structure
- tenant safety is enforced
- validation exists
- authorization is correct
- response format is consistent
- no unrelated files were changed
- code is type-safe
- code is readable and maintainable