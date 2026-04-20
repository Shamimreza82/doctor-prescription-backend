import type { TQueryOptions } from '@/types/pagination.types';

import type { PrescriptionStatus, Prisma } from '@prisma/client';


export interface TPrescriptionActor {
  userId: string;
  tenantId?: string | null;
  role: string;
}

export interface TPrescriptionScope {
  tenantId?: string;
  isSuperAdmin: boolean;
}

export interface TPrescriptionItemInput {
  medicineName: string;
  genericName?: string | null;
  dosage?: string | null;
  frequency?: string | null;
  durationValue?: number | null;
  durationUnit?: string | null;
  route?: string | null;
  instruction?: string | null;
  quantity?: string | null;
  timing?: string | null;
  sortOrder?: number;
  metadata?: Prisma.JsonObject;
}

export interface TPrescriptionCreateInput {
  patientId: string;
  doctorId?: string;
  visitId?: string | null;
  prescriptionNumber?: string;
  status?: PrescriptionStatus;
  diagnosis?: string | null;
  symptoms?: string | null;
  advice?: string | null;
  notes?: string | null;
  followUpDate?: Date | null;
  issuedAt?: Date | null;
  expiresAt?: Date | null;
  metadata?: Prisma.JsonObject;
  items?: TPrescriptionItemInput[];
  tenantId?: string;
}

export interface TPrescriptionUpdateInput {
  patientId?: string;
  doctorId?: string;
  visitId?: string | null;
  prescriptionNumber?: string;
  status?: PrescriptionStatus;
  diagnosis?: string | null;
  symptoms?: string | null;
  advice?: string | null;
  notes?: string | null;
  followUpDate?: Date | null;
  issuedAt?: Date | null;
  expiresAt?: Date | null;
  metadata?: Prisma.JsonObject | null;
  items?: TPrescriptionItemInput[];
  tenantId?: string;
}

export interface TPrescriptionListQuery extends TQueryOptions {
  status?: PrescriptionStatus;
  patientId?: string;
  doctorId?: string;
  tenantId?: string;
  issuedFrom?: Date;
  issuedTo?: Date;
}
