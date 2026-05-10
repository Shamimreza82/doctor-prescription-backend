# Doctor Module: Designer's Field Guide & Workflow

This guide is created for the design team to understand the data structure, form requirements, and logical workflows of the Doctor module. Use this to ensure all necessary fields and states are represented in the UI.

---

## 1. Profile & Personal Info
**View:** *Doctor Profile Settings / Onboarding*

These fields represent the doctor's professional and personal identity.

| Field Name | Type | UI Input Type | Requirement | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Employee ID** | String | Text Input | Optional | Internal serial/staff ID. |
| **Reg. Number** | String | Text Input | Optional | BMDC or medical board registration. |
| **License No.** | String | Text Input | Optional | Professional license. |
| **Experience** | Number | Number Input | Optional | Years of practice. |
| **Gender** | Enum | Radio / Select | Optional | Options: `MALE`, `FEMALE`, `OTHER`. |
| **Date of Birth** | Date | Date Picker | Optional | ISO format. |
| **Blood Group** | String | Select / Text | Optional | e.g., A+, B-, O+. |
| **Bio / Summary** | Text | Textarea | Optional | Professional summary for patients. |
| **Address** | Text | Textarea | Optional | Residential or office address. |
| **Emergency Contact**| String | Text Input | Optional | Name of the person to contact. |
| **Emergency Phone** | String | Phone Input | Optional | Contact number. |
| **Consultation Time**| Number | Minutes (Step) | Optional | Default: `15 mins`. Time per patient. |
| **Availability** | Boolean | Toggle / Switch | **System** | Quick toggle for "Taking Appointments". |
| **Account Status** | Enum | Badge / Label | **System** | `ACTIVE`, `ON_LEAVE`, `INACTIVE`, etc. |

---

## 2. Chamber Management
**View:** *Chamber List / Add Chamber Form*

Doctors can consult at multiple locations (Hospitals, Clinics, or Private Chambers).

| Field Name | UI Input Type | Requirement | Notes |
| :--- | :--- | :--- | :--- |
| **Chamber Name** | Text Input | **REQUIRED** | e.g., "City Hospital", "Private Care". |
| **Room / Cabin** | Text Input | Optional | Specific room number. |
| **Floor** | Text Input | Optional | e.g., "3rd Floor". |
| **Branch Name** | Text Input | Optional | e.g., "Dhanmondi Branch". |
| **Full Address** | Textarea | Optional | Complete physical location. |
| **Primary Chamber** | Checkbox | Optional | Marks if this is the main workplace. |
| **Active Status** | Toggle | Optional | Enable/Disable this chamber. |

---

## 3. Weekly Schedule (Availability)
**View:** *Schedule Planner / Weekly Calendar*

This defines *when* a doctor is available at a *specific chamber*.

| Field Name | UI Input Type | Requirement | Notes |
| :--- | :--- | :--- | :--- |
| **Chamber** | Dropdown | Optional | Link to one of the created chambers. |
| **Day of Week** | Multi-Select/Buttons| **REQUIRED** | Mon, Tue, Wed, etc. |
| **Start Time** | Time Picker | **REQUIRED** | Format: `HH:mm`. |
| **End Time** | Time Picker | **REQUIRED** | Format: `HH:mm`. |
| **Max Patients** | Number Input | Optional | Cap on total appointments for this slot. |
| **Slot Duration** | Number (Mins) | Optional | Override the default 15-min duration. |
| **Mode** | Segmented Control| **REQUIRED** | `IN_PERSON`, `ONLINE`, `VIDEO`, `PHONE`. |

---

## 4. Fee Configuration (Pricing)
**View:** *Billing / Fee Settings*

Pricing can vary based on the *type* of visit and the *chamber*.

| Field Name | UI Input Type | Requirement | Notes |
| :--- | :--- | :--- | :--- |
| **Chamber** | Dropdown | Optional | Price can be specific to a location. |
| **Visit Type** | Select | **REQUIRED** | `NEW`, `FOLLOW_UP`, `EMERGENCY`. |
| **Mode** | Select | **REQUIRED** | `IN_PERSON`, `VIDEO`, etc. |
| **Amount** | Number (Currency) | **REQUIRED** | The cost of the consultation. |
| **Currency** | Label/Text | **System** | Default: `BDT`. |

---

## 5. Leaves & Absences
**View:** *Leave Management / Vacation Tracker*

| Field Name | UI Input Type | Requirement | Notes |
| :--- | :--- | :--- | :--- |
| **Start Date** | Date Picker | **REQUIRED** | First day of leave. |
| **End Date** | Date Picker | **REQUIRED** | Last day of leave. |
| **Full Day** | Checkbox | Default: True | If false, implies a partial day absence. |
| **Reason** | Textarea | Optional | For internal records. |

---

## 6. Logical Workflows for Designers

### A. The "Onboarding" Flow
1. Doctor creates an account.
2. System prompts to complete **Personal Info** (Section 1).
3. Doctor must add at least one **Chamber** (Section 2) before they can set a schedule.

### B. The "Appointment Discovery" Logic
For a patient to book an appointment:
- The Doctor must be `ACTIVE`.
- `isAvailable` must be `true`.
- There must be a **Schedule** for that day.
- There must not be a **Leave** record covering that date.
- The **Fee** is determined by matching the `Visit Type` and `Mode`.

### C. Relationship Hierarchy
- **Doctor** (Root)
    - -> has many **Chambers**
    - -> has many **Schedules** (Linked to Chambers)
    - -> has many **Fee Configs** (Linked to Modes/Chambers)
    - -> has many **Specializations** (e.g., Cardiology, Surgery)
