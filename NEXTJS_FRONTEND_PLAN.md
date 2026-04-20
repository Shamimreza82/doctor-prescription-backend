# Next.js Frontend Plan

## Goal

Build a separate Next.js frontend that matches the current backend API surface in this repository without inventing unsupported features.

Current backend public modules under `/api/v1`:

- `auth`
- `onboarding`
- `patients`
- `prescriptions`

This means the frontend team should avoid building dashboards or modules for doctors, plans, subscriptions, settings, or reports until those routes are actually exposed.

## Recommended Stack

Use a separate frontend project with:

- `Next.js 15+` with App Router
- `TypeScript`
- `Tailwind CSS` if the team wants fast UI delivery
- `React Hook Form + Zod` for forms
- `TanStack Query` for server state
- `Axios` or `fetch` wrapper for API calls
- `next-safe-action` only if the team already uses it well; otherwise skip extra abstractions

## Best Approach

Use **BFF-style Next.js**:

- Browser talks to Next.js
- Next.js talks to this backend
- Keep access token on the server side when possible
- Treat refresh token cookie as backend-owned and always call the backend with credentials

Why this is the safest fit for the current backend:

- backend login returns `accessToken` in JSON
- backend refresh flow depends on `refreshToken` cookie
- protected backend routes expect `Authorization: Bearer <token>`
- role-based routing matters (`SUPER_ADMIN`, `DOCTOR`, `ASSISTANT`, `PATIENT`)

For this backend, a pure client-side auth implementation will work, but a server-first session layer in Next.js is cleaner and easier to control.

## Frontend Delivery Phases

### Phase 1: Foundation

Create these first:

- app shell
- auth/session handling
- API client
- shared form system
- error handling
- protected route guard

### Phase 2: Auth + Onboarding

Build these screens first:

- login
- super-admin doctor onboarding
- unauthorized / forbidden page

### Phase 3: Patients

Build:

- patient list with pagination and filters
- create patient form
- patient details page
- update patient form
- archive patient action

### Phase 4: Prescriptions

Build:

- prescription list with pagination and filters
- create prescription form with repeatable items
- prescription details page
- update prescription form
- archive prescription action

## Suggested Frontend Structure

```text
src/
  app/
    (auth)/
      login/page.tsx
    (dashboard)/
      layout.tsx
      patients/page.tsx
      patients/new/page.tsx
      patients/[id]/page.tsx
      prescriptions/page.tsx
      prescriptions/new/page.tsx
      prescriptions/[id]/page.tsx
      onboarding/doctors/page.tsx
    forbidden/page.tsx
  components/
    ui/
    forms/
    tables/
    layout/
  features/
    auth/
      api/
      components/
      schemas/
      server/
    onboarding/
    patients/
    prescriptions/
  lib/
    api/
      client.ts
      server.ts
      endpoints.ts
    auth/
      session.ts
      permissions.ts
    utils/
  types/
    api.ts
    auth.ts
    patient.ts
    prescription.ts
```

## API Contract The Frontend Should Assume

### Base URL

Backend routes are versioned under:

```text
/api/v1
```

Examples:

- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh-token`
- `POST /api/v1/onboarding/doctors`
- `GET /api/v1/patients`
- `GET /api/v1/prescriptions`

### Response Shape

Successful responses follow this shape:

```ts
type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
};
```

Error responses follow this shape:

```ts
type ApiErrorResponse = {
  success: false;
  message: string;
  error?: unknown;
  stack?: string;
};
```

Frontend rule:

- always read `message`
- for lists, expect `data` plus `meta`
- for forms, map backend validation errors into field-level messages where possible

## Auth Model

### Login

`POST /api/v1/auth/login`

Body:

```json
{
  "email": "user@example.com",
  "password": "123456"
}
```

Response includes:

- `data.accessToken`
- `data.user`

Backend also sets:

- `refreshToken` cookie

### Refresh

`POST /api/v1/auth/refresh-token`

Requirements:

- send request with credentials/cookies
- backend reads refresh token from cookie
- backend returns a new access token

### Protected Requests

Protected backend routes require:

```text
Authorization: Bearer <accessToken>
```

### Recommended Session Strategy

Use this flow:

1. Login from Next.js server action or route handler.
2. Store `accessToken` in an `httpOnly` Next.js session cookie.
3. Forward backend `refreshToken` cookie by allowing credentialed requests.
4. Use a centralized server API client that adds the bearer token.
5. On `401`, attempt one refresh request, update session, and retry once.
6. If refresh fails, clear session and redirect to login.

If the team wants a faster first version:

- keep `accessToken` in memory client-side
- rely on backend refresh cookie
- add an axios interceptor for refresh

But the preferred production approach is server-managed session handling in Next.js.

## Role-Aware Routing

Current backend route protection:

- `auth/register`: `SUPER_ADMIN`
- `onboarding/doctors`: `SUPER_ADMIN`
- `patients/*`: `DOCTOR`, `ASSISTANT`, `SUPER_ADMIN` bypass exists in backend
- `prescriptions/*`: `DOCTOR`, `ASSISTANT`, `SUPER_ADMIN` bypass exists in backend

Frontend should:

- hide unavailable navigation by role
- still rely on backend as source of truth
- redirect forbidden users to `/forbidden`

## Initial Pages The Team Should Build

### Must-Have

- `/login`
- `/onboarding/doctors`
- `/patients`
- `/patients/new`
- `/patients/[id]`
- `/prescriptions`
- `/prescriptions/new`
- `/prescriptions/[id]`

### Nice-To-Have

- `/patients/[id]/edit`
- `/prescriptions/[id]/edit`
- printable prescription view

## Forms To Match Backend Validation

### Auth Login

- `email`
- `password`

### Onboarding Doctor

- `name`
- `email`
- `phone` using Bangladeshi phone validation expectation
- `password`
- `planCode`

### Patient

Important fields:

- `name`
- `phone`
- `email`
- `age`
- `dateOfBirth`
- `gender`
- `address`
- `bloodGroup`
- `maritalStatus`
- `occupation`
- `photoUrl`
- `status`
- `isActive`
- `notes`

List filters:

- `page`
- `limit`
- `search`
- `sortBy`
- `sortOrder`
- `gender`
- `status`
- `isActive`

### Prescription

Important fields:

- `patientId`
- `doctorId`
- `visitId`
- `prescriptionNumber`
- `status`
- `diagnosis`
- `symptoms`
- `advice`
- `notes`
- `followUpDate`
- `issuedAt`
- `expiresAt`
- `items[]`

Each `items[]` entry should support:

- `medicineName`
- `genericName`
- `dosage`
- `frequency`
- `durationValue`
- `durationUnit`
- `route`
- `instruction`
- `quantity`
- `timing`
- `sortOrder`
- `metadata`

List filters:

- `page`
- `limit`
- `search`
- `sortBy`
- `sortOrder`
- `status`
- `patientId`
- `doctorId`
- `issuedFrom`
- `issuedTo`

## API Client Rules

The frontend team should implement these rules once and reuse them everywhere:

- one typed API client
- one auth-aware request wrapper
- one error normalizer
- one pagination parser
- one query key factory for TanStack Query

Recommended behavior:

- send cookies on login/refresh requests
- attach bearer token on protected requests
- retry once after refresh on `401`
- never build endpoint strings inline across components

## Environment Variables For Frontend

Suggested frontend env names:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api/v1
```

If using Next.js server proxy/BFF:

```bash
BACKEND_INTERNAL_URL=http://localhost:4000/api/v1
```

## Team Working Agreement

The frontend team should align on these rules before coding:

- do not build UI for backend routes that do not exist yet
- keep business rules in feature modules, not scattered across pages
- generate or hand-write shared TypeScript API types early
- centralize auth and refresh logic on day one
- use server components for data-heavy pages where it helps
- use client components only for interactive forms, tables, and local UI state
- keep route protection at layout level where possible

## Recommended Build Order For The Team

1. Set up project, layout, env, API client, session handling.
2. Finish login and refresh flow completely.
3. Add role-aware dashboard shell and navigation.
4. Build patients module end to end.
5. Build prescriptions module end to end.
6. Add onboarding for super-admin.
7. Add print/export and UX polish after core flows work.

## Final Recommendation

If the frontend team wants the most stable and maintainable setup, use:

- `Next.js App Router`
- `TanStack Query`
- `React Hook Form + Zod`
- a centralized API layer
- server-managed auth/session in Next.js
- feature-based folders for `auth`, `onboarding`, `patients`, and `prescriptions`

That is the best fit for the backend as it exists today.
