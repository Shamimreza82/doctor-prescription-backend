import type { TQueryOptions } from '@/types/pagination.types';

import type {
  AddressType,
  Gender,
  Patient,
  PatientAddress,
  PatientEmergencyContact,
  PatientIdentifier,
  PatientIdentifierType,
  PatientInsurance,
  PatientMedicalProfile,
  PatientStatus,
  VisitPriority,
  VisitSource,
  VisitStatus,
  VisitType,
} from '@prisma/client';

export interface TPatientAddressInput {
  type?: AddressType;
  addressLine: string;
  area?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  isPrimary?: boolean;
}

export interface TPatientEmergencyContactInput {
  name: string;
  relation?: string;
  phone: string;
  email?: string;
  address?: string;
  isPrimary?: boolean;
}

export interface TPatientMedicalProfileInput {
  allergies?: string;
  chronicDiseases?: string;
  currentMedications?: string;
  pastMedicalHistory?: string;
  familyHistory?: string;
  surgicalHistory?: string;
  habits?: string;
  heightCm?: number;
  weightKg?: number;
}

export interface TPatientInsuranceInput {
  providerName: string;
  policyNumber?: string;
  memberId?: string;
  coverageDetails?: string;
  validFrom?: Date;
  validTo?: Date;
  isActive?: boolean;
}

export interface TPatientIdentifierInput {
  type: PatientIdentifierType;
  value: string;
  isPrimary?: boolean;
}

export interface TPatientCreateInput {
  name: string;
  phone: string;
  email?: string;
  age?: number;
  dateOfBirth?: Date;
  gender?: Gender;
  bloodGroup?: string;
  maritalStatus?: string;
  occupation?: string;
  photoUrl?: string;
  status?: PatientStatus;
  isActive?: boolean;
  notes?: string;
  tenantId?: string;

  // Nested relations
  addresses?: TPatientAddressInput[];
  emergencyContacts?: TPatientEmergencyContactInput[];
  medicalProfile?: TPatientMedicalProfileInput;
  insurances?: TPatientInsuranceInput[];
  identifiers?: TPatientIdentifierInput[];
}

export interface TPatientUpdateInput {
  name?: string;
  phone?: string;
  email?: string | null;
  age?: number;
  dateOfBirth?: Date | null;
  gender?: Gender | null;
  bloodGroup?: string | null;
  maritalStatus?: string | null;
  occupation?: string | null;
  photoUrl?: string | null;
  status?: PatientStatus;
  isActive?: boolean;
  notes?: string | null;
  tenantId?: string;

  // Nested relations
  medicalProfile?: TPatientMedicalProfileInput;
  addresses?: TPatientAddressInput[];
  emergencyContacts?: TPatientEmergencyContactInput[];
  insurances?: TPatientInsuranceInput[];
  identifiers?: TPatientIdentifierInput[];
}

export interface TPatientListQuery extends TQueryOptions {
  gender?: Gender;
  status?: PatientStatus;
  isActive?: boolean;
}

export interface TPatientScope {
  tenantId?: string;
  isSuperAdmin: boolean;
}

export interface TPatientActor {
  userId: string;
  tenantId?: string | null;
  role: string;
}

export type TPatientWithRelations = Patient & {
  addresses: PatientAddress[];
  emergencyContacts: PatientEmergencyContact[];
  medicalProfile: PatientMedicalProfile | null;
  insurances: PatientInsurance[];
  identifiers: PatientIdentifier[];
};

export interface TVisitCreateInput {
  patientId?: string;
  visitDate: Date;
  type?: VisitType;
  status?: VisitStatus;
  priority?: VisitPriority;
  source?: VisitSource;
  chiefComplaint?: string;
  reason?: string;
  symptoms?: string;
  diagnosis?: string;
  notes?: string;
  queueNumber?: number;
  roomNumber?: string;
  departmentId?: string;
  consultationFee?: number;
  discount?: number;
  followUpDate?: Date;
  referredToDoctorId?: string;
  metadata?: Record<string, unknown>;
}

export interface TVisitUpdateInput {
  visitDate?: Date;
  type?: VisitType;
  status?: VisitStatus;
  priority?: VisitPriority;
  source?: VisitSource;
  chiefComplaint?: string;
  reason?: string;
  symptoms?: string;
  diagnosis?: string;
  notes?: string;
  checkedInAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  closedAt?: Date;
  queueNumber?: number;
  roomNumber?: string;
  departmentId?: string;
  consultationFee?: number;
  discount?: number;
  paidAmount?: number;
  followUpDate?: Date;
  referredToDoctorId?: string;
  metadata?: Record<string, unknown>;
}

export interface TVisitListQuery extends TQueryOptions {
  patientId?: string;
  status?: VisitStatus;
  type?: VisitType;
  priority?: VisitPriority;
  startDate?: Date;
  endDate?: Date;
}

export interface TVisitVitalsInput {
  systolicBp?: number;
  diastolicBp?: number;
  pulseRate?: number;
  temperature?: number;
  respiratoryRate?: number;
  spO2?: number;
  bmi?: number;
  weightKg?: number;
  heightCm?: number;
  notes?: string;
}
