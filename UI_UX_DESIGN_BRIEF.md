# UI/UX Design Brief

## 1. Product Context

This application is a multi-tenant doctor prescription platform. A tenant represents a doctor workspace or clinic account. Users authenticate into a tenant and perform role-specific actions such as managing patients, creating prescriptions, or onboarding new doctor workspaces.

Current public API routes are mounted under `/api/v1`:

- `/auth`
- `/onboarding`
- `/patients`
- `/prescriptions`

The backend also contains data models for doctors, visits, files, tenant settings, subscriptions, audit logs, and activity logs. Those models should inform the overall product direction, but designers should treat the mounted routes above as the current buildable frontend scope.

## 2. Primary Roles

### Super Admin

Purpose: manage platform-level onboarding and protected user creation.

Main capabilities:

- Sign in.
- Create users through the protected auth register endpoint.
- Onboard a doctor workspace.
- Access tenant-scoped patient and prescription APIs because the backend has a super-admin bypass.

UX priority:

- Provide an admin workspace for doctor onboarding and operational oversight.
- Avoid exposing clinic-only flows as the default landing experience unless the admin intentionally enters a workspace context.

### Doctor

Purpose: manage their own tenant workspace and clinical work.

Main capabilities:

- Sign in.
- View and manage patients in their tenant.
- Create, update, view, list, and archive prescriptions.
- Create prescriptions as themselves. The backend resolves the doctor profile from the logged-in doctor user.

UX priority:

- Fast patient lookup.
- Quick prescription creation.
- Clear patient context during clinical work.

### Assistant

Purpose: support doctor operations inside the same tenant.

Main capabilities:

- Sign in.
- View and manage patients in the tenant.
- Create, update, view, list, and archive prescriptions.
- Must select a doctor when creating prescriptions because the backend requires `doctorId` for non-doctor users.

UX priority:

- Efficient data entry.
- Strong doctor/patient selection controls.
- Avoid clinical assumptions that only doctors should make.

### Patient

The `PATIENT` role exists in the user model, but no patient-facing routes are currently mounted. Patient portal screens should be considered future scope.

## 3. Global UX Principles

- Keep screens task-first. Users should reach patient search, patient creation, and prescription creation quickly after login.
- Use consistent response handling everywhere: success message, error message, optional `data`, and optional pagination `meta`.
- Every list screen should support search, filters, sorting, pagination, loading states, empty states, and retryable error states.
- Every destructive action is a soft archive in the current backend. Use confirmation dialogs with clear wording such as "Archive patient" or "Archive prescription", not "Delete permanently".
- Preserve tenant safety in the UI. Non-super-admin users should not see tenant selectors. Super admin users may see tenant selectors only where the backend accepts `tenantId`.
- Use role-aware navigation, but do not rely on hidden navigation as security. The backend remains the source of truth.

## 4. Application Navigation

### Public Area

- Login
- Forbidden
- Session expired

### Authenticated Shell

Recommended primary navigation:

- Dashboard
- Patients
- Prescriptions
- Doctor Onboarding, visible to `SUPER_ADMIN`
- Account/Profile

Recommended secondary navigation:

- Settings, disabled or hidden until settings routes are exposed
- Doctors, disabled or hidden until doctor routes are mounted
- Visits/Appointments, disabled or hidden until visit/appointment routes are exposed
- Billing/Subscription, disabled or hidden until billing routes are exposed

## 5. Authentication Module

### Purpose

Authenticate users, return user identity and role, and manage access token refresh.

### Backend Data

Login request:

- `email`
- `password`

Login response:

- `accessToken`
- `user.userId`
- `user.tenantId`
- `user.name`
- `user.email`
- `user.role`

The backend sets an HTTP-only `refreshToken` cookie on login and refresh.

### Screens

#### Login

Fields:

- Email
- Password

Interactions:

- Submit login credentials.
- Show field-level validation for invalid email and short password.
- On success, route by role.
- On failure, show the backend `message`.

Recommended post-login route:

- `SUPER_ADMIN`: doctor onboarding or admin dashboard
- `DOCTOR`: patients or clinical dashboard
- `ASSISTANT`: patients
- `PATIENT`: forbidden or placeholder, because patient-facing routes are not exposed

#### Session Expired

Use when refresh fails or the access token is invalid.

Interactions:

- Explain that the user must sign in again.
- Provide a single action back to login.

#### Forbidden

Use when a user is authenticated but lacks role permission.

## 6. Onboarding Module

### Purpose

Super admin creates a new doctor workspace. The backend creates these records in one transaction:

- Tenant workspace
- Doctor user
- Doctor profile
- Tenant settings
- Trial subscription

### Backend Route

`POST /api/v1/onboarding/doctors`

Allowed role:

- `SUPER_ADMIN`

Fields:

- `name`
- `email`
- `phone`
- `password`
- `planCode`

Business rules:

- `planCode` must match an existing plan.
- Email or phone duplicates are rejected.
- Tenant defaults are created automatically.
- Trial duration is currently 7 days.

### Screens

#### Doctor Onboarding List/Dashboard

The backend currently exposes only create behavior, not a list of onboarded tenants. If designed now, this screen should be a simple action page rather than a data dashboard unless additional endpoints are added.

Primary action:

- Onboard doctor

#### Onboard Doctor Form

Sections:

- Doctor identity: name, email, phone
- Initial account: password
- Plan: plan code

Interactions:

- Validate Bangladeshi phone format.
- Show "Plan not found" clearly when `planCode` is invalid.
- Show duplicate email/phone errors as account conflicts.
- On success, show confirmation that the workspace was created.

Design note:

- Because the route returns only `true`, the UI cannot display created tenant ID, doctor ID, or subscription details unless the backend response changes.

## 7. Patient Module

### Purpose

Doctors and assistants manage patient records inside a tenant. Patients are tenant-owned resources and must always be scoped by tenant. Current implementation supports one primary address through a simplified `address` field.

### Backend Routes

- `POST /api/v1/patients`
- `GET /api/v1/patients`
- `GET /api/v1/patients/:id`
- `PATCH /api/v1/patients/:id`
- `DELETE /api/v1/patients/:id`

Allowed roles:

- `DOCTOR`
- `ASSISTANT`
- `SUPER_ADMIN` through backend bypass

### Patient Data

Create/update form fields:

- `name`, required
- `phone`, required
- `email`
- `age`
- `dateOfBirth`
- `gender`: `MALE`, `FEMALE`, `OTHER`
- `address`
- `bloodGroup`
- `maritalStatus`
- `occupation`
- `photoUrl`
- `status`: `ACTIVE`, `INACTIVE`, `DECEASED`, `BLOCKED`
- `isActive`
- `notes`
- `tenantId`, only for super-admin workflows

Returned patient fields:

- `id`
- `tenantId`
- `patientCode`
- `firstName`
- `lastName`
- `phone`
- `email`
- `gender`
- `dateOfBirth`
- `bloodGroup`
- `maritalStatus`
- `occupation`
- `photoUrl`
- `status`
- `isActive`
- `notes`
- `addresses`
- `createdAt`
- `updatedAt`

### Screens

#### Patient List

Purpose:

- Find and manage patients quickly.

Table columns:

- Patient code
- Name
- Phone
- Gender
- Age or date of birth
- Blood group
- Status
- Primary address
- Created date
- Actions

Filters:

- Search by first name, last name, or phone
- Gender
- Status
- Active state

Sorting:

- Created date
- Name
- Ascending/descending

Pagination:

- Use backend `meta.page`, `meta.limit`, `meta.total`, and `meta.totalPages`.

Row actions:

- View
- Edit
- Create prescription
- Archive

Empty states:

- No patients yet: offer "Add patient".
- No search results: offer "Clear filters".

#### Create Patient

Recommended layout:

- Basic details: name, phone, email, gender, date of birth or age
- Clinical identifiers: blood group, status, active state
- Contact and background: address, occupation, marital status
- Notes

Interactions:

- If both `age` and `dateOfBirth` are present, clarify which value will be sent. Prefer date of birth as the explicit input and calculate age for display.
- Show validation for required name and phone.
- After save, navigate to patient detail.

#### Patient Detail

Header:

- Full name from `firstName` and `lastName`
- Patient code
- Status badge
- Phone

Sections:

- Demographics
- Contact details
- Primary address
- Notes
- Prescriptions list filtered by `patientId`

Actions:

- Edit patient
- New prescription
- Archive patient

Design note:

- The Prisma model includes emergency contacts, medical profile, insurance, identifiers, and visits, but the current patient API does not expose CRUD screens for those nested records. These can be designed as future tabs, but should be disabled or marked future until backend routes exist.

#### Edit Patient

Use the create form structure with existing values prefilled. Submit only changed values where possible.

#### Archive Patient Confirmation

Explain that archived patients become inactive and no longer appear in normal lists. The backend sets:

- `deletedAt`
- `isActive: false`
- `status: INACTIVE`

## 8. Prescription Module

### Purpose

Create and manage prescriptions for tenant patients. A prescription belongs to a tenant, patient, doctor, and optionally a visit. It contains clinical text fields and repeatable medicine items.

### Backend Routes

- `POST /api/v1/prescriptions`
- `GET /api/v1/prescriptions`
- `GET /api/v1/prescriptions/:id`
- `PATCH /api/v1/prescriptions/:id`
- `DELETE /api/v1/prescriptions/:id`

Allowed roles:

- `DOCTOR`
- `ASSISTANT`
- `SUPER_ADMIN` through backend bypass

### Prescription Data

Prescription fields:

- `patientId`, required
- `doctorId`, required for assistants; optional for doctors
- `visitId`
- `prescriptionNumber`
- `status`: `DRAFT`, `ISSUED`, `CANCELLED`, `COMPLETED`
- `diagnosis`
- `symptoms`
- `advice`
- `notes`
- `followUpDate`
- `issuedAt`
- `expiresAt`
- `metadata`
- `tenantId`, only for super-admin workflows

Medicine item fields:

- `medicineName`, required
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

### Screens

#### Prescription List

Purpose:

- Review prescription history and continue drafts.

Table columns:

- Prescription number
- Patient
- Doctor
- Status
- Diagnosis
- Issued date
- Follow-up date
- Created date
- Actions

Filters:

- Search by prescription number, diagnosis, patient first name, or patient last name
- Status
- Patient
- Doctor
- Issued date range

Sorting:

- Created date
- Issued date
- Prescription number

Actions:

- View
- Edit
- Print
- Archive/cancel

Design note:

- The backend currently archives prescriptions by setting `deletedAt` and `status: CANCELLED`.

#### Create Prescription

Recommended layout:

- Patient selector
- Doctor selector, visible for assistants and super-admin users
- Visit selector, optional and disabled until visits are available through the UI
- Clinical notes: symptoms, diagnosis, advice, notes
- Medicines table
- Dates: follow-up, issued, expiry
- Status control: draft or issued

Patient selector:

- Search patients by name or phone using the patient list endpoint.
- Show patient code, age/date of birth, phone, and status in results.
- Do not allow archived patients.

Doctor selector:

- Required for assistants.
- For doctors, hide the control or show read-only "Prescribing doctor: current user".
- Because doctor list routes are not currently mounted, assistant prescription creation needs either a future doctor lookup endpoint or a temporary configuration source.

Medicine table:

- Each row represents one `items[]` entry.
- Required column: medicine name.
- Optional columns: generic, dosage, frequency, duration, route, timing, quantity, instruction.
- Support add row, duplicate row, reorder row, and remove row.
- Store row order in `sortOrder`.

Primary actions:

- Save draft
- Issue prescription
- Cancel

Validation:

- Patient is required.
- Medicine rows with any entered data must have medicine name.
- Duration value must be a positive integer when present.

#### Prescription Detail

Header:

- Prescription number
- Status
- Patient name and phone
- Doctor name and registration number
- Issued date

Sections:

- Clinical summary
- Medicine list
- Follow-up information
- Notes
- Visit reference, if present

Actions:

- Edit
- Print
- Archive/cancel

#### Printable Prescription

Use tenant settings when exposed:

- Prescription header
- Prescription footer
- Timezone
- Language

Until settings APIs are available, design with placeholder clinic branding.

Print layout should include:

- Doctor information
- Patient information
- Diagnosis/symptoms
- Medicines
- Advice
- Follow-up date
- Signature area

## 9. Data Flow

### Login Flow

1. User submits email and password.
2. Backend validates credentials.
3. Backend returns `accessToken` and user details.
4. Backend sets `refreshToken` cookie.
5. Frontend stores/uses access token according to the chosen session strategy.
6. Frontend loads role-aware navigation.

### Token Refresh Flow

1. Protected request receives `401`.
2. Frontend calls `/auth/refresh-token` with cookies.
3. Backend rotates refresh cookie and returns a new access token.
4. Frontend retries the original request once.
5. If refresh fails, redirect to login/session expired.

### Patient Creation Flow

1. Doctor or assistant opens Create Patient.
2. User enters name and phone plus optional details.
3. Frontend submits to `/patients`.
4. Backend derives tenant from authenticated user.
5. Backend splits `name` into `firstName` and `lastName`.
6. Backend generates `patientCode`.
7. Backend creates primary address when `address` is provided.
8. Frontend routes to Patient Detail.

### Prescription Creation Flow

1. Doctor or assistant chooses a patient.
2. Doctor is inferred for doctor users; assistants must provide `doctorId`.
3. User fills diagnosis, symptoms, advice, dates, and medicines.
4. Frontend submits to `/prescriptions`.
5. Backend validates patient tenant scope.
6. Backend validates doctor tenant scope.
7. Backend creates prescription and items.
8. Frontend routes to Prescription Detail or Printable Prescription.

### Archive Flow

1. User opens archive confirmation.
2. Frontend submits `DELETE`.
3. Backend soft-archives the record.
4. Frontend removes the item from active list or updates its status.
5. Frontend shows a success message from the backend response.

## 10. Dashboards

Dashboard endpoints are not currently mounted. Designers may prepare low-fidelity dashboard concepts, but the first implemented dashboard should only use available data or be deferred.

Current feasible dashboard cards using existing APIs:

- Total patients from `/patients` pagination `meta.total`
- Recent patients from `/patients?sortBy=createdAt&sortOrder=desc`
- Total prescriptions from `/prescriptions` pagination `meta.total`
- Recent prescriptions from `/prescriptions?sortBy=createdAt&sortOrder=desc`
- Draft prescriptions from `/prescriptions?status=DRAFT`

Avoid charts that require unsupported aggregate endpoints unless those endpoints are planned.

## 11. Forms And Components

### Shared Components

- App shell with role-aware sidebar/top navigation
- Data table with search, filters, sort, pagination
- Status badge
- Date picker
- Date range picker
- Confirmation dialog
- Toast/inline alert
- Field error text
- Empty state
- Loading skeleton
- Patient selector
- Doctor selector, future or admin-provided until doctor list route exists
- Medicine item table

### Status Display

Patient statuses:

- `ACTIVE`
- `INACTIVE`
- `DECEASED`
- `BLOCKED`

Prescription statuses:

- `DRAFT`
- `ISSUED`
- `CANCELLED`
- `COMPLETED`

Tenant statuses, future admin context:

- `PENDING`
- `ACTIVE`
- `SUSPENDED`
- `INACTIVE`
- `ARCHIVED`

User statuses, future admin context:

- `ACTIVE`
- `INACTIVE`
- `SUSPENDED`
- `LOCKED`

## 12. Backend-Aligned Validation Notes

- Phone validation expects Bangladeshi numbers matching `+8801XXXXXXXXX` or `01XXXXXXXXX`.
- Password must be at least 6 characters.
- Patient `name` and `phone` are required.
- Prescription `patientId` is required.
- Prescription item `medicineName` is required.
- List `limit` supports 1 to 100.
- UUID fields must be valid UUIDs.
- Forms should display backend validation messages without rewriting them into unrelated copy.

## 13. Current Backend Constraints Designers Should Know

- Doctor management routes exist only as commented code. Do not design full doctor CRUD as current scope.
- Patient nested records such as medical profile, emergency contacts, identifiers, insurance, and visits exist in Prisma but do not have mounted CRUD APIs.
- Visits exist in Prisma and prescription can reference `visitId`, but there is no mounted visit API.
- Tenant settings exist in Prisma but there is no mounted settings API.
- Plans/subscriptions exist in Prisma, but public plan/subscription endpoints are not mounted.
- File upload model exists, but no mounted file upload API is available.
- Patient-facing UI is future scope because no patient routes are mounted.
- Prescription OpenAPI docs are not present even though prescription routes are mounted. Designers and frontend developers should align directly with validation/service files until docs are added.

## 14. Suggested Screen Inventory

Buildable now:

- Login
- Forbidden
- Session expired
- App shell
- Admin doctor onboarding
- Patient list
- Create patient
- Patient detail
- Edit patient
- Archive patient confirmation
- Prescription list
- Create prescription
- Prescription detail
- Edit prescription
- Archive prescription confirmation
- Printable prescription

Future/backlog:

- Doctor directory and profile management
- Doctor schedules, chambers, departments, leaves, fees
- Visit and appointment workflow
- Patient medical profile tabs
- Emergency contacts
- Insurance and identifiers
- Tenant settings
- Billing and subscription management
- File uploads
- Patient portal
- Reporting dashboard

## 15. Recommended Designer Deliverables

- Role-based sitemap.
- User flow diagrams for login, onboarding, patient creation, prescription creation, and archive actions.
- Wireframes for every buildable screen.
- Component inventory for forms, tables, selectors, status badges, and dialogs.
- Empty/loading/error state designs.
- Printable prescription template.
- Responsive behavior for mobile, tablet, and desktop.

