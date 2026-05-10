import type { RequestHandler } from 'express';

interface RequestWithContext {
  id?: string;
  log?: any;
  user?: { id: string; role: string };
}

export const requestContext: RequestHandler = (req, _res, next) => {
  const request = req as typeof req & RequestWithContext;

  if (request.log && typeof request.log.child === 'function') {
    request.log = request.log.child({
      requestId: request.id,
      userId: request.user?.id,
    });
  }

  next();
};
