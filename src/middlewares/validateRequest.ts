import { catchAsync } from '@/shared/utils/catchAsync';

import type { RequestHandler } from 'express';
import type { ZodTypeAny } from 'zod';

export const validateRequest = (schema: ZodTypeAny): RequestHandler =>
  catchAsync(async (req, _res, next) => {
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  });
