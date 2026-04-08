Follow:
- docs/ai-prompts/AGENTS.md

## Goal
Implement a complete Patient module for a multi-tenant SaaS backend.

## Context
This system supports:
- Super Admin
- Doctor
- Assistant
- Patient

Each doctor works inside a tenant (workspace).
Patients belong to a tenant.

Doctors and authorized assistants can manage patients within their tenant.

## Requirements

Build a full Patient module with:

### Core Features
- Create patient
- List patients (with pagination)
- Search patients (name, phone)
- Get patient by ID
- Update patient
- Soft delete / archive patient

### Query Features
- pagination (page, limit)
- search (name, phone)
- sort (createdAt, name)
- filters (optional)

## Business Rules
- Every patient MUST have `tenantId`
- Doctor can only access their own tenant patients
- Assistant can access based on role (assume allowed for now)
- Super admin can access all patients (explicit bypass)
- No cross-tenant data access allowed

## Architecture Rules
- Keep controller thin
- Put all business logic in service
- Use repository if query becomes complex
- Do not write Prisma logic inside controller
- Follow existing module structure

## Validation Rules
Use Zod:
- validate body
- validate params
- validate query

Example fields:
- name (string, required)
- phone (string, required)
- age (number, optional)
- gender (optional enum)
- address (optional)

## Multi-Tenant Safety
- Always filter by tenantId in queries
- Never trust frontend tenant filtering
- Use `req.user.tenantId`
- Super admin bypass must be explicit

## Authorization
- Auth middleware already exists
- Assume roles:
  - SUPER_ADMIN
  - DOCTOR
  - ASSISTANT

- Doctor → own tenant only
- Assistant → same tenant
- Super admin → all

## Expected Files

Create or update:

- patient.route.ts
- patient.controller.ts
- patient.service.ts
- patient.validation.ts
- patient.repository.ts (if needed)
- patient.types.ts
- patient.constants.ts

if  need you can create your wone make sure its relavent

## Route Structure

- POST   /api/v1/patients
- GET    /api/v1/patients
- GET    /api/v1/patients/:id
- PATCH  /api/v1/patients/:id
- DELETE /api/v1/patients/:id

if  need you can create your wone make sure its relavent
## Implementation Rules

Controller:
- receive request
- call service
- send response

Service:
- handle business logic
- enforce tenant boundary
- handle pagination/search
- handle role-based access

Repository (optional):
- handle Prisma queries
- reusable queries

## Deliver

1. Short plan first
2. Then implement file by file
3. Explain:
   - tenant filtering strategy
   - pagination approach
   - search logic

## Verification Checklist

Confirm that:
- patient creation works
- list is paginated
- search works
- tenant isolation is enforced
- doctor cannot access another tenant’s patients
- super admin bypass works correctly
- no Prisma query exists in controller
- validation is applied
- response format is consistent