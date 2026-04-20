import type { FILE_CATEGORIES, FILE_ENTITY_TYPES } from './upload.constand';

export type TFileEntityType = (typeof FILE_ENTITY_TYPES)[number];
export type TFileCategory = (typeof FILE_CATEGORIES)[number];

export interface TUploadActor {
  userId: string;
  tenantId?: string;
  role: string;
}

export interface TUploadScope {
  tenantId?: string;
  isSuperAdmin: boolean;
}

export interface TUploadedFile {
  originalname: string;
  mimetype: string;
  size: number;
  path: string;
}

export interface TCreateFileInput {
  entityType: TFileEntityType;
  entityId: string;
  category?: TFileCategory;
  title?: string;
  notes?: string;
  tenantId?: string;
}

export interface TUpdateFileInput {
  category?: TFileCategory | null;
  title?: string | null;
  notes?: string | null;
}

export interface TListFilesQuery {
  page?: number | string;
  limit?: number | string;
  entityType?: TFileEntityType;
  entityId?: string;
  category?: TFileCategory;
  search?: string;
  tenantId?: string;
  sortBy?: 'createdAt' | 'originalName' | 'sizeBytes';
  sortOrder?: 'asc' | 'desc';
}
