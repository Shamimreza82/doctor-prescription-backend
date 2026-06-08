# Patient Module: Designer's Field Guide & Workflow

This guide is created for the design team to understand the data structure, form requirements, and logical workflows of the Patient module. Use this to ensure all necessary fields and states are represented in the UI.

---

## 1. Profile & Personal Info

**View:** _Patient Registration / Profile Settings_

These fields represent the patient's basic identity and contact information.

| Field Name         | Type    | UI Input Type   | Requirement | Notes                                |
| :----------------- | :------ | :-------------- | :---------- | :----------------------------------- |
| **Full Name**      | String  | Text Input      | **REQUIRED**| Split into First/Last name in system.|
| **Phone**          | String  | Phone Input     | **REQUIRED**| Primary contact for SMS/Calls.       |
| **Email**          | String  | Email Input     | Optional    | For digital prescriptions/billing.   |
| **Age**            | Number  | Number Input    | Optional    | Converts to Date of Birth if provided|
| **Date of Birth**  | Date    | Date Picker     | Optional    | ISO format.                          |
| **Gender**         | Enum    | Radio / Select  | Optional    | `MALE`, `FEMALE`, `OTHER`.           |
| **Blood Group**    | String  | Select / Text   | Optional    | e.g., A+, B-, O+.                    |
| **Marital Status** | String  | Select / Text   | Optional    | e.g., Single, Married, Divorced.     |
| **Occupation**     | String  | Text Input      | Optional    | Patient's profession.                |
| **Photo URL**      | String  | Image Upload    | Optional    | Profile picture.                     |
| **Status**         | Enum    | Badge / Label   | **System**  | `ACTIVE`, `INACTIVE`.                |
| **Notes**          | Text    | Textarea        | Optional    | General administrative notes.        |

---

## 2. Medical Profile (Clinical History)

**View:** _Medical Record / Clinical Summary_

Deep-dive into the patient's medical history. Usually managed by a Doctor or Nurse.

| Field Name              | UI Input Type | Requirement | Notes                                 |
| :---------------------- | :------------ | :---------- | :------------------------------------ |
| **Allergies**           | Textarea      | Optional    | Drug, food, or environmental.         |
| **Chronic Diseases**    | Textarea      | Optional    | e.g., Diabetes, Hypertension.         |
| **Current Medications** | Textarea      | Optional    | Drugs the patient is currently taking.|
| **Past History**        | Textarea      | Optional    | Previous illnesses or conditions.     |
| **Family History**      | Textarea      | Optional    | Hereditary conditions.                |
| **Surgical History**    | Textarea      | Optional    | Previous operations.                  |
| **Habits**              | Textarea      | Optional    | e.g., Smoking, Alcohol, Diet.         |
| **Height (cm)**         | Number Input  | Optional    | Used for BMI calculation.             |
| **Weight (kg)**         | Number Input  | Optional    | Used for BMI calculation.             |

---

## 3. Addresses & Emergency Contacts

**View:** _Contact Info Tab_

| Field Name              | UI Input Type | Requirement  | Notes                                |
| :---------------------- | :------------ | :----------- | :----------------------------------- |
| **Address Type**        | Select        | Optional     | `HOME`, `WORK`, `BILLING`, `OTHER`.  |
| **Address Line**        | Textarea      | **REQUIRED** | Street address.                      |
| **City/Area**           | Text Input    | Optional     | e.g., Dhaka, Dhanmondi.              |
| **Emergency Name**      | Text Input    | **REQUIRED** | Name of the guardian/contact.        |
| **Emergency Relation**  | Text Input    | Optional     | e.g., Spouse, Parent.                |
| **Emergency Phone**     | Phone Input   | **REQUIRED** | Contact number for emergencies.      |

---

## 4. Insurance & Identifiers

**View:** _Identity & Billing Tab_

| Field Name          | UI Input Type | Requirement  | Notes                                  |
| :------------------ | :------------ | :----------- | :------------------------------------- |
| **Insurance Prov.** | Text Input    | Optional     | e.g., "MetLife", "Green Delta".        |
| **Policy Number**   | Text Input    | Optional     | Unique insurance policy ID.            |
| **ID Type**         | Select        | **REQUIRED** | `NID`, `PASSPORT`, `BIRTH_CERTIFICATE`.|
| **ID Value**        | Text Input    | **REQUIRED** | The actual number on the ID card.      |

---

## 5. Visit Management

**View:** _Visit History / Check-in Form_

Captures the context of a specific visit (encounter).

| Field Name           | UI Input Type     | Requirement  | Notes                                  |
| :------------------- | :---------------- | :----------- | :------------------------------------- |
| **Visit Type**       | Select            | **REQUIRED** | `OPD`, `IPD`, `EMERGENCY`, `FOLLOW_UP`.|
| **Visit Status**     | Badge             | **System**  | `SCHEDULED`, `CHECKED_IN`, `COMPLETED`.|
| **Priority**         | Segmented Control | **REQUIRED** | `NORMAL`, `URGENT`, `EMERGENCY`.       |
| **Chief Complaint**  | Textarea          | **REQUIRED** | Why the patient is here today.         |
| **Consultation Fee** | Number Input      | Optional     | Financial record for the visit.        |

---

## 6. Vitals Tracking

**View:** _Vitals Intake Form / Dashboard_

| Field Name          | UI Input Type | Requirement | Notes                                 |
| :------------------ | :------------ | :---------- | :------------------------------------ |
| **BP (Systolic)**   | Number Input  | Optional    | Top number (e.g., 120).               |
| **BP (Diastolic)**  | Number Input  | Optional    | Bottom number (e.g., 80).             |
| **Pulse Rate**      | Number Input  | Optional    | Beats per minute.                     |
| **Temperature**     | Number Input  | Optional    | Fahrenheit or Celsius.                |
| **SpO2**            | Number Input  | Optional    | Oxygen saturation percentage.         |

---

## 7. Logical Workflows for Designers

### A. The "Patient Onboarding" Flow
1. **Quick Reg:** Name and Phone (Minimum required for a walk-in).
2. **Identity:** Adding NID/Insurance for official records.
3. **Medical Intake:** Completing the Medical Profile (Section 2) during the first consultation.

### B. The "Visit" Workflow
1. **Check-in:** Receptionist creates a `Visit` record, sets `Priority`, and records `Chief Complaint`.
2. **Vitals:** Nurse/Assistant records BP, Pulse, etc., linked to the `Visit`.
3. **Consultation:** Doctor reviews `Medical Profile` and `Vitals` before writing a prescription.

### C. Relationship Hierarchy
- **Patient** (Root)
  - -> has many **Addresses**
  - -> has many **Emergency Contacts**
  - -> has one **Medical Profile** (History)
  - -> has many **Insurances**
  - -> has many **Identifiers** (NID, Passport)
  - -> has many **Visits**
    - -> has one **Vitals** record (per visit)
    - -> has many **Files/Reports** (Lab results, X-rays)
