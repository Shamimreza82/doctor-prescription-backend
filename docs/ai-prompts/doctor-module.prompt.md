# Doctor Module Prompt

Follow `backend-rules.md`.

## Goal
Implement or improve the Doctor module.

## Context
This platform allows doctors to log in, manage patients, and create prescriptions.
Doctor may be provisioned by super admin.

## Requirements
Build or improve:
- create doctor
- list doctors
- get doctor by id
- update doctor profile
- doctor status handling
- doctor dashboard-safe retrieval logic
- doctor onboarding workflow if needed

## Business Rules
- Super admin can create doctor accounts
- A doctor may have:
  - user account
  - tenant
  - doctor profile
  - settings
  - subscription/trial
- Doctor should only access permitted tenant data

## Rules
- Keep controller thin
- Business logic in service
- Use transaction for onboarding
- Use validation
- No raw large Prisma logic inside controller
- Keep naming consistent

## Suggested Flow for Create Doctor
Possible onboarding flow:
1. create tenant
2. create user
3. create doctor profile
4. create tenant setting
5. create subscription trial

Use transaction if implementing full onboarding.

## Expected Files
- doctor.route.ts
- doctor.controller.ts
- doctor.service.ts
- doctor.validation.ts
- doctor.repository.ts (if needed)
- doctor.constants.ts
- doctor.types.ts

## Deliverables
1. short plan
2. file-by-file implementation
3. explanation of doctor onboarding flow
4. assumptions clearly listed before coding

## Verification
Confirm that:
- doctor creation is safe
- tenant linkage is correct
- doctor cannot access another tenant’s records
- role/permission checks are correct
- onboarding transaction rolls back safely on failure