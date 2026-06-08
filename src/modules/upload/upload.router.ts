import { Router } from 'express';

import { auth } from '@/middlewares/auth';
import { validateRequest } from '@/middlewares/validateRequest';
import { Role } from '@/shared/constend/auth.const';
import { MulterConfig } from '@/shared/utils/multer';

import { UPLOAD_FIELD_NAME } from './upload.constand';
import { UploadControllers } from './upload.controller';
import { UploadValidationSchemas } from './upload.validation';

const router = Router();

router.use(auth(Role.DOCTOR, Role.ASSISTANT));

router.post(
  '/',
  MulterConfig.upload.single(UPLOAD_FIELD_NAME),
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
