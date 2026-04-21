import crypto from 'node:crypto';

import { pinoHttp } from 'pino-http';

import { requestPino } from './requestLogger';

import type { Request, Response } from 'express';

export const httpLogger = pinoHttp<Request, Response>({
  logger: requestPino,
  autoLogging: {
    ignore: (req) => req.url === '/health',
  },
  genReqId(req, res) {
    const incoming = req.headers['x-request-id'];
    const requestId =
      typeof incoming === 'string' && incoming.length > 0 ? incoming : crypto.randomUUID();
    res.setHeader('x-request-id', requestId);
    return requestId;
  },
  customProps(req) {
    return {
      requestId: req.id,
      ip: req.ip,
    };
  },

  customSuccessMessage(req, res) {
    return `${req.method} ${req.url} completed (${res.statusCode})`;
  },

  customErrorMessage(req, res) {
    return `${req.method} ${req.url} failed (${res.statusCode})`;
  },

  serializers: {
    req(req) {
      return {
        id: req.id,
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
      };
    },

    res(res) {
      return {
        statusCode: res.statusCode,
      };
    },
  },
});
