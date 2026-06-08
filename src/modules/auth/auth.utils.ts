import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';

import { prisma } from '@/bootstrap/prisma';
import { envConfig } from '@/config/env.config';
import { AppError } from '@/shared/errors/AppError';

import type { JwtPayload, SignOptions } from 'jsonwebtoken';

export interface TJwtPayload {
  userId: string;
  tenantId: string;
  role: string;
}

export const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: envConfig.nodeEnv === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

export const findUserByEmail = async (email: string, tenantId?: string) => {
  return prisma.user.findFirst({
    where: { email, tenantId },
  });
};

export const findUserById = async (userId: string, tenantId?: string) => {
  return prisma.user.findFirst({
    where: {
      id: userId,
      tenantId,
    },
  });
};

export const createAuthUser = async (data: any) => {
  return prisma.user.create({
    data: {
      ...data,
    },
  });
};

export const generateAccessToken = (payload: JwtPayload) => {
  return jwt.sign(payload, envConfig.jwtAccessSecret, {
    expiresIn: envConfig.jwtExpiresIn as SignOptions['expiresIn'],
  });
};

export const generateRefreshToken = (payload: JwtPayload) => {
  return jwt.sign(payload, envConfig.jwtRefreshSecret, {
    expiresIn: envConfig.jwtRefreshExpiresIn as SignOptions['expiresIn'],
  });
};

export const verifyAccessToken = (token: string): TJwtPayload => {
  return jwt.verify(token, envConfig.jwtAccessSecret) as TJwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, envConfig.jwtRefreshSecret) as JwtPayload;
};

export const assertActiveUser = (status?: string | null) => {
  if (status === 'INACTIVE' || status === 'LOCKED' || status === 'SUSPENDED') {
    throw new AppError(StatusCodes.LOCKED, `Account temporarily ${status}, please contect admin`);
  }
};
