import { mkdir, writeFile, access } from 'fs/promises';
import path from 'path/win32';

import { Prisma, PrescriptionStatus } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

import { prisma } from '@/bootstrap/prisma';
import { AppError } from '@/shared/errors/AppError';
import { PdfService } from '@/shared/lib/pdf.service';
import { paginateResponse } from '@/shared/utils/paginateResponse';
import { calculatePagination } from '@/shared/utils/pagination';

import { PrescriptionPdfTemplate } from './prescription-pdf.template';
import { PRESCRIPTION_MESSAGES } from './prescription.constants';
import { PrescriptionRepository } from './prescription.repository';
import { PrescriptionUtils } from './prescription.utlis';

import type {
  TPrescriptionActor,
  TPrescriptionCreateInput,
  TPrescriptionListQuery,
  TPrescriptionPrintData,
  TPrescriptionUpdateInput,
} from './prescription.types';






const createPrescription = async (actor: TPrescriptionActor, payload: TPrescriptionCreateInput) => {

  const scope = PrescriptionUtils.resolveTenantScope(actor, payload.tenantId);

  if (!scope.tenantId) {
    throw new AppError(StatusCodes.BAD_REQUEST, PRESCRIPTION_MESSAGES.TENANT_REQUIRED);
  }

  console.log('Resolved tenant scope:', scope);



  await PrescriptionUtils.getPatientOrThrow(payload.patientId, scope);
  const doctorId = await PrescriptionUtils.getDoctorIdOrThrow(actor, scope, payload.doctorId);

  if (payload.visitId) {
    await PrescriptionUtils.validateVisitOrThrow(payload.visitId, payload.patientId);
  }

  return PrescriptionRepository.createPrescription(
    {
      tenant: {
        connect: {
          id: scope.tenantId,
        },
      },
      patient: {
        connect: {
          id: payload.patientId,
        },
      },
      doctor: {
        connect: {
          id: doctorId,
        },
      },
      ...(payload.visitId
        ? {
          visit: {
            connect: {
              id: payload.visitId,
            },
          },
        }
        : {}),
      prescriptionNumber: payload.prescriptionNumber ?? PrescriptionUtils.buildPrescriptionNumber(),
      status: payload.status ?? PrescriptionStatus.DRAFT,
      diagnosis: payload.diagnosis ?? null,
      symptoms: payload.symptoms ?? null,
      advice: payload.advice ?? null,
      notes: payload.notes ?? null,
      followUpDate: payload.followUpDate ?? null,
      issuedAt: payload.issuedAt ?? null,
      expiresAt: payload.expiresAt ?? null,
      metadata: payload.metadata,
    },
    PrescriptionUtils.mapItems(payload.items),
  );
};

const listPrescriptions = async (actor: TPrescriptionActor, query: TPrescriptionListQuery) => {
  const scope = PrescriptionUtils.resolveTenantScope(actor, query.tenantId);
  const { page, limit, skip } = calculatePagination(query);
  const where = PrescriptionUtils.buildPrescriptionListWhere(scope, query);
  const orderBy = PrescriptionUtils.buildOrderBy(query.sortBy, query.sortOrder);
  const { data, total } = await PrescriptionRepository.listPrescriptions(where, orderBy, skip, limit);

  return paginateResponse(data, total, page, limit);
};

const getPrescriptionById = async (actor: TPrescriptionActor, prescriptionId: string) => {
  const scope = PrescriptionUtils.resolveTenantScope(actor);
  return PrescriptionUtils.getScopedPrescriptionOrThrow(prescriptionId, scope);
};

const updatePrescription = async (
  actor: TPrescriptionActor,
  prescriptionId: string,
  payload: TPrescriptionUpdateInput,
) => {
  const current = await PrescriptionUtils.getScopedPrescriptionOrThrow(prescriptionId, PrescriptionUtils.resolveTenantScope(actor, payload.tenantId));
  const scope = PrescriptionUtils.resolveTenantScope(actor, current.tenantId);

  const nextPatientId = payload.patientId ?? current.patientId;
  await PrescriptionUtils.getPatientOrThrow(nextPatientId, scope);

  if (payload.visitId) {
    await PrescriptionUtils.validateVisitOrThrow(payload.visitId, nextPatientId);
  }

  const data: Prisma.PrescriptionUpdateInput = {};

  if (payload.patientId) {
    data.patient = {
      connect: {
        id: payload.patientId,
      },
    };
  }

  if (payload.doctorId !== undefined || actor.role === 'DOCTOR') {
    const doctorId = await PrescriptionUtils.getDoctorIdOrThrow(actor, scope, payload.doctorId);
    data.doctor = {
      connect: {
        id: doctorId,
      },
    };
  }

  if (payload.visitId !== undefined) {
    data.visit = payload.visitId
      ? {
        connect: {
          id: payload.visitId,
        },
      }
      : {
        disconnect: true,
      };
  }

  if (payload.prescriptionNumber !== undefined) {
    data.prescriptionNumber = payload.prescriptionNumber;
  }

  if (payload.status !== undefined) {
    data.status = payload.status;
  }

  if (payload.diagnosis !== undefined) {
    data.diagnosis = payload.diagnosis;
  }

  if (payload.symptoms !== undefined) {
    data.symptoms = payload.symptoms;
  }

  if (payload.advice !== undefined) {
    data.advice = payload.advice;
  }

  if (payload.notes !== undefined) {
    data.notes = payload.notes;
  }

  if (payload.followUpDate !== undefined) {
    data.followUpDate = payload.followUpDate;
  }

  if (payload.issuedAt !== undefined) {
    data.issuedAt = payload.issuedAt;
  }

  if (payload.expiresAt !== undefined) {
    data.expiresAt = payload.expiresAt;
  }

  if (payload.metadata !== undefined) {
    data.metadata = payload.metadata === null ? Prisma.JsonNull : payload.metadata;
  }

  return PrescriptionRepository.updatePrescription(
    prescriptionId,
    data,
    payload.items ? PrescriptionUtils.mapItems(payload.items) : undefined,
  );
};

const archivePrescription = async (actor: TPrescriptionActor, prescriptionId: string) => {
  const scope = PrescriptionUtils.resolveTenantScope(actor);
  await PrescriptionUtils.getScopedPrescriptionOrThrow(prescriptionId, scope);

  return PrescriptionRepository.updatePrescription(prescriptionId, {
    deletedAt: new Date(),
    status: PrescriptionStatus.CANCELLED,
  });
};

const getFinalPrescriptionData = async (
  prescriptionId: string
): Promise<TPrescriptionPrintData> => {


  if (!prescriptionId) {
    throw new AppError(400, 'Prescription ID is required');
  }
  const prescription = await PrescriptionRepository.getPrescriptionById(prescriptionId);

  if (!prescription) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Prescription not found');
  } 

  console.log('Fetched prescription data:', prescription);

{

  return {
    id: prescription.id,
    prescriptionNo: prescription.prescriptionNumber,
    tenantId: prescription.tenantId,
    issuedAt: prescription.issuedAt ? prescription.issuedAt.toISOString() : '',
    patient: {
      name: `${prescription.patient.firstName} ${prescription.patient.lastName ?? ''}`.trim(),
      age: 32,
      gender: 'Not specified',
      phone: prescription.patient.phone ?? 'Not specified',
    },
    doctor: {
      name: prescription.doctor.user.name,
      designation: 'General Physician',
      registrationNo: prescription.doctor.registrationNumber ?? 'Not specified',
    },
    diagnosis: prescription.diagnosis ?? 'Not specified',
    medicines: prescription.items.map((item) => ({
      name: item.medicineName,
      strength: item.dosage ?? 'Not specified',
      dosage: item.dosage ?? 'Not specified',
      duration: `${item.durationValue ?? 'N/A'} ${item.durationUnit ?? ''}`.trim(),
      instructions: item.instruction ?? 'No specific instructions',
    })),
    advice: prescription.advice ? [prescription.advice] : [],
    followUpDate: prescription.followUpDate ? prescription.followUpDate.toISOString() : undefined,
  };
};
}


const generatePdf = async (actor: TPrescriptionActor, prescriptionId: string) => {
  const data = await getFinalPrescriptionData(prescriptionId);

  const html = PrescriptionPdfTemplate.generateHtml(data);
  const pdfBuffer = await PdfService.generateFromHtml(html);

  // use real tenant id from your data/auth context
  const tenantId = data.tenantId ?? 't-001';

  // dynamic file name
  const fileName = `rx-${data.prescriptionNo}.pdf`;

  // storage key -> save in DB if needed
  const storageKey = path.join(
    'tenants',
    tenantId,
    'prescriptions',
    fileName
  );

  // absolute path -> for writing file
  const absolutePath = path.join(process.cwd(), 'uploads', storageKey);

  // relative path -> for API response
  const relativePath = `/uploads/${storageKey.split(path.sep).join('/')}`;

  // ensure folder exists
  await mkdir(path.dirname(absolutePath), { recursive: true });

  // write file
  await writeFile(absolutePath, pdfBuffer);

  await prisma.file.create({
    data: {
      tenantId: actor.tenantId,
      uploadedById: actor.userId,
      originalName: fileName,
      mimeType: 'application/pdf',
      sizeBytes: pdfBuffer.length,
      storageKey,
      entityType: 'PRESCRIPTION',
      entityId: prescriptionId,
      category: 'PRESCRIPTION',
      title: `Prescription PDF - ${data.prescriptionNo}`,
      notes: 'System generated prescription PDF',
    },
  });



  return {
    prescriptionId,
    fileName,
    filePath: relativePath,
    sizeBytes: pdfBuffer.length,
    downloadUrl: `/api/v1/prescriptions/${prescriptionId}/pdf/download`,
    previewUrl: `/api/v1/prescriptions/${prescriptionId}/pdf/view`,
    generatedAt: new Date().toISOString(),
  };
};


const getPdfFilePath = async (prescriptionId: string) => {
  const data = await getFinalPrescriptionData(prescriptionId);
  const fileName = `rx-${data.prescriptionNo}.pdf`;
  const filePath = path.join(
    process.cwd(),
    'uploads',
    'prescriptions',
    fileName
  );

  try {
    await access(filePath);
  } catch {
    throw new AppError(StatusCodes.NOT_FOUND, 'PDF file not found. Please generate the PDF first.');
  }

  return {
    fileName,
    filePath,
  };
};



export const PrescriptionServices = {
  createPrescription,
  listPrescriptions,
  getPrescriptionById,
  updatePrescription,
  archivePrescription,
  getFinalPrescriptionData,
  generatePdf,
  getPdfFilePath,
};
