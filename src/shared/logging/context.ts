import type { Request } from 'express';

type RequestWithLog = Request & { id?: string; log?: any; user?: { id: string; role: string } };

export const getRequestLogger = (req: Request): any => {
  const request = req as RequestWithLog;

  if (request.log) {
    return request.log;
  }

  // Fallback to console if no request logger is present
  return {
    child: () => console,
    info: console.info,
    error: console.error,
    warn: console.warn,
    debug: console.debug,
    trace: console.trace,
  };
};

export const getRequestId = (req: Request): string | undefined => {
  return (req as RequestWithLog).id;
};
