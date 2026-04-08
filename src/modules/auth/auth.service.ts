import { StatusCodes } from 'http-status-codes';

import { AppError } from '@/shared/errors/AppError';
import { generateId } from '@/shared/utils/generateId';
import { comparePassword } from '@/shared/utils/passwordCompare';
import { hashPassword } from '@/shared/utils/passwordHased';

import { AUTH_MESSAGES } from './auth.consted';
import {
  assertActiveUser,
  createAuthUser,
  findUserByEmail,
  findUserById,
  generateAccessToken,
  generateRefreshToken,
  TJwtPayload,
  verifyRefreshToken,
} from './auth.utils';
import { TLoginInput, TRegisterInput } from './auth.validation';



const register = async (payload: TRegisterInput) => {
  const { email, password } = payload;
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new AppError(StatusCodes.CONFLICT, AUTH_MESSAGES.USER_ALREADY_EXISTS);
  }

  const data: TRegisterInput = {
    publicId: generateId('usr'),
    ...payload,
    password: await hashPassword(password),
  };

  return createAuthUser(data);
};




const login = async (payload: TLoginInput) => {
  const { email, password } = payload;
  const existingUser = await findUserByEmail(email);

  if (!existingUser) {
    throw new AppError(StatusCodes.CONFLICT, AUTH_MESSAGES.USER_NOT_FOUND);
  }

  assertActiveUser(existingUser.status);

  const isPasswordValid = await comparePassword(password, existingUser.password);

  if (!isPasswordValid) {
    throw new AppError(StatusCodes.CONFLICT, AUTH_MESSAGES.INVALID_CREDENTIALS);
  }

  const jwtPayload = {
    userId: existingUser.id,
    tenantId: existingUser.tenantId,
    role: existingUser.role,
  };

  return {
    accessToken: generateAccessToken(jwtPayload),
    refreshToken: generateRefreshToken(jwtPayload),
    user: {
      userId: existingUser.id,
      tenantId: existingUser.tenantId,
      name: existingUser.name,
      email: existingUser.email,
      role: existingUser.role,
    },
  };
};




const refreshToken = async (token: string) => {
  const decoded = verifyRefreshToken(token) as TJwtPayload;
  const existingUser = await findUserById(decoded.userId);

  if (!existingUser) {
    throw new AppError(StatusCodes.CONFLICT, AUTH_MESSAGES.USER_NOT_FOUND);
  }

  assertActiveUser(existingUser.status);

  const jwtPayload = {
    userId: existingUser.id,
    tenantId: existingUser.tenantId,
    role: existingUser.role,
  };

  return {
    accessToken: generateAccessToken(jwtPayload),
    refreshToken: generateRefreshToken(jwtPayload),
  };
};

export const AuthServices = {
  login,
  register,
  refreshToken,
};
