# Patient Module: Designer's Field Guide & Workflow

This guide is for the design team to understand the patient data structure, medical profile importance, and visit lifecycle. Use this to ensure comprehensive UI coverage for patient management.

---

## 1. Patient Core Profile

**View:** _Registration / Patient Profile View_

General identity and contact details for the patient.

| Field Name         | Type   | UI Input Type  | Requirement  | Notes                                        |
| :----------------- | :----- | :------------- | :----------- | :------------------------------------------- |
| **Patient Code**   | String | Read-only/Auto | **System**   | Internal ID (e.g., MRN-1002).                |
| **First Name**     | String | Text Input     | **REQUIRED** | Legal first name.                            |
| **Last Name**      | String | Text Input     | Optional     | Legal last name.                             |
| **Phone**          | String | Phone Input    | **REQUIRED** | Unique identifier for the patient.           |
| **Email**          | String | Email Input    | Optional     | For notifications/portal access.             |
| **Gender**         | Enum   | Radio / Select | Optional     | `MALE`, `FEMALE`, `OTHER`.                   |
| **Date of Birth**  | Date   | Date Picker    | Optional     | Used to calculate Age in UI.                 |
| **Blood Group**    | String | Select         | Optional     | A+, B-, O+, etc.                             |
| **Marital Status** | String | Select         | Optional     | Single, Married, etc.                        |
| **Occupation**     | String | Text Input     | Optional     | Patient's profession.                        |
| **Photo**          | String | File Upload    | Optional     | Patient's profile picture URL.               |
| **Status**         | Enum   | Badge          | **System**   | `ACTIVE`, `INACTIVE`, `BLOCKED`, `DECEASED`. |

---

## 2. Patient Medical Profile (CRITICAL)

**View:** _Doctor's Patient Dashboard / Medical History_

This is the most important section for doctors during a consultation. It represents the patient's long-term health history.

| Field Name           | UI Input Type    | Requirement | Notes                                          |
| :------------------- | :--------------- | :---------- | :--------------------------------------------- |
| **Allergies**        | Textarea / Tags  | Optional    | List of drug or food allergies.                |
| **Chronic Diseases** | Textarea / Tags  | Optional    | Long-term conditions (e.g., Diabetes, Asthma). |
| **Current Meds**     | Textarea         | Optional    | Medications the patient is currently taking.   |
| **Medical History**  | Textarea         | Optional    | Past major illnesses or conditions.            |
| **Surgical History** | Textarea         | Optional    | Past operations/surgeries.                     |
| **Family History**   | Textarea         | Optional    | Hereditary conditions (e.g., Heart disease).   |
| **Habits**           | Textarea / Chips | Optional    | e.g., Smoking, Alcohol, Exercise.              |
| **Height (cm)**      | Number Input     | Optional    | Used for BMI calculation.                      |
| **Weight (kg)**      | Number Input     | Optional    | Used for BMI/Dosage calculation.               |

---

## 3. Contact & Identity

**View:** _Addresses, Emergency Contacts, Identifiers_

| Section         | Field Name       | Requirement  | Notes                                   |
| :-------------- | :--------------- | :----------- | :-------------------------------------- |
| **Address**     | **Type**         | Optional     | `HOME`, `WORK`, `OTHER`.                |
|                 | **Address Line** | **REQUIRED** | Full street address.                    |
|                 | **Is Primary**   | Optional     | Checkbox for main address.              |
| **Emergency**   | **Name**         | **REQUIRED** | Contact person name.                    |
|                 | **Relation**     | Optional     | e.g., Spouse, Parent.                   |
|                 | **Phone**        | **REQUIRED** | Emergency contact number.               |
| **Identifiers** | **Type**         | **REQUIRED** | `NID`, `PASSPORT`, `INSURANCE_ID`, etc. |
|                 | **Value**        | **REQUIRED** | The ID number.                          |

---

## 4. Visit Management

**View:** _OPD Queue / Visit Details / Check-in Form_

A "Visit" is a single encounter between a patient and a doctor.

| Field Name          | UI Input Type   | Requirement  | Notes                                            |
| :------------------ | :-------------- | :----------- | :----------------------------------------------- |
| **Visit Type**      | Select          | **REQUIRED** | `OPD`, `EMERGENCY`, `FOLLOW_UP`, `TELEMEDICINE`. |
| **Priority**        | Select          | **REQUIRED** | `LOW`, `NORMAL`, `HIGH`, `URGENT`, `CRITICAL`.   |
| **Chief Complaint** | Textarea        | **REQUIRED** | The primary reason the patient is here.          |
| **Symptoms**        | Textarea / Tags | Optional     | Patient's reported symptoms.                     |
| **Diagnosis**       | Textarea        | Optional     | Doctor's final diagnosis for this visit.         |
| **Visit Status**    | Enum/Badge      | **System**   | `WAITING`, `IN_CONSULTATION`, `COMPLETED`, etc.  |
| **Follow-up Date**  | Date Picker     | Optional     | Date for next recommended visit.                 |

---

## 5. Logical Workflows for Designers

### A. The "Patient Check-in" Flow

1. **Search:** Receptionist searches for patient by **Phone** or **NID**.
2. **Create/Select:** If new, fill **Core Profile**. If existing, select profile.
3. **Visit Creation:** Choose **Visit Type** (e.g., OPD) and **Doctor**.
4. **Queue:** Patient is assigned a **Queue Number** and status becomes `WAITING`.

### B. The "Doctor's Consultation" View

1. **Review History:** Doctor opens **Medical Profile** (Section 2) to see chronic conditions/allergies.
2. **Current Visit:** Doctor fills **Chief Complaint**, **Symptoms**, and **Diagnosis**.
3. **Action:** Doctor creates a **Prescription** (linked to this visit).
4. **Conclusion:** Status changes to `COMPLETED`.

### C. Relationship Hierarchy

- **Patient** (Root)
  - -> has one **Medical Profile** (History)
  - -> has many **Addresses** & **Emergency Contacts**
  - -> has many **Identifiers** (IDs)
  - -> has many **Visits** (Each visit is one encounter)
  - -> has many **Prescriptions** (Linked to visits)
  - -> has many **Files** (Scans, Reports, Docs)
