import { Router } from 'express';
import multer from 'multer';

import { auth } from '@/middlewares/auth';
import { validateRequest } from '@/middlewares/validateRequest';
import { Role } from '@/shared/constend/auth.const';

import { MAX_FILE_SIZE_BYTES, UPLOAD_FIELD_NAME } from './upload.constand';
import { UploadControllers } from './upload.controller';
import { UploadUtils } from './upload.utlis';
import { UploadValidationSchemas } from './upload.validation';

const router = Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UploadUtils.ensureUploadDirectory());
  },
  filename: (_req, file, cb) => {
    cb(null, UploadUtils.buildStoredFileName(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
  },
});

router.use(auth(Role.DOCTOR, Role.ASSISTANT));

router.post(
  '/',
  upload.single(UPLOAD_FIELD_NAME),
  validateRequest(UploadValidationSchemas.createFileSchema),
  UploadControllers.uploadFile,
);

router.get(
  '/',
  validateRequest(UploadValidationSchemas.listFilesSchema),
  UploadControllers.listFiles,
);

router.get(
  '/:id',
  validateRequest(UploadValidationSchemas.fileParamsSchema),
  UploadControllers.getFileById,
);

router.patch(
  '/:id',
  validateRequest(UploadValidationSchemas.fileParamsSchema),
  validateRequest(UploadValidationSchemas.updateFileSchema),
  UploadControllers.updateFile,
);

router.delete(
  '/:id',
  validateRequest(UploadValidationSchemas.fileParamsSchema),
  UploadControllers.deleteFile,
);

export const uploadRouter = router;
