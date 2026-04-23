import { catchAsync } from '@/shared/utils/catchAsync';

import type { RequestHandler } from 'express';
import type { ZodTypeAny } from 'zod';

export const validateRequest = (schema: ZodTypeAny): RequestHandler =>
  catchAsync(async (req, _res, next) => {

    await schema.parseAsync({
      body: req.body as unknown,
      query: { ...req.query } as unknown,
      params: req.params as unknown,
    });
    next();
  });
