import type { TQueryOptions } from '@/types/pagination.types';

import type { Gender, Patient, PatientAddress, PatientStatus } from '@prisma/client';

export interface TPatientCreateInput {
  name: string;
  phone: string;
  email?: string;
  age?: number;
  dateOfBirth?: Date;
  gender?: Gender;
  address?: string;
  bloodGroup?: string;
  maritalStatus?: string;
  occupation?: string;
  photoUrl?: string;
  status?: PatientStatus;
  isActive?: boolean;
  notes?: string;
  tenantId?: string;
}

export interface TPatientUpdateInput {
  name?: string;
  phone?: string;
  email?: string | null;
  age?: number;
  dateOfBirth?: Date | null;
  gender?: Gender | null;
  address?: string | null;
  bloodGroup?: string | null;
  maritalStatus?: string | null;
  occupation?: string | null;
  photoUrl?: string | null;
  status?: PatientStatus;
  isActive?: boolean;
  notes?: string | null;
  tenantId?: string;
}

export interface TPatientListQuery extends TQueryOptions {
  gender?: Gender;
  status?: PatientStatus;
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

export type TPatientWithAddress = Patient & {
  addresses: PatientAddress[];
};

export interface TPatientListResult {
  data: TPatientWithAddress[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
