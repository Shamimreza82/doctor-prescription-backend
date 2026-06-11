import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';

import { prisma } from '@/bootstrap/prisma';
import { envConfig } from '@/config/env.config';
import { AppError } from '@/shared/errors/AppError';
import { createEmailToken } from '@/shared/utils/createEmailToken';
import { comparePassword } from '@/shared/utils/passwordCompare';
import { hashPassword } from '@/shared/utils/passwordHased';
import sendEmail from '@/shared/utils/sendEmail';

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
import { verifyEmailTemplate } from './emailTemplate/VerifyLink';



const register = async (payload: TRegisterInput) => {
  const { email, password } = payload;
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new AppError(StatusCodes.CONFLICT, AUTH_MESSAGES.USER_ALREADY_EXISTS);
  }

  const data: TRegisterInput = {
    ...payload,
    password: await hashPassword(password),
  };

  const createdUser = await createAuthUser(data);

    if (! createdUser.emailVerified) {
    const token = createEmailToken(createdUser.id);
    const link = `${envConfig.clientUrl}/auth/verify-email?token=${token}`;
    const emailTemplate = verifyEmailTemplate(link);

    await sendEmail(createdUser.email, 'Verify your email', emailTemplate);
    console.log('email send successfull');
  }


  return createdUser
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

const me = async (userId: string) => {
  const existingUser = await findUserById(userId);

  if (!existingUser) {
    throw new AppError(StatusCodes.CONFLICT, AUTH_MESSAGES.USER_NOT_FOUND);
  }

  assertActiveUser(existingUser.status);

  return {
    userId: existingUser.id,
    tenantId: existingUser.tenantId,
    name: existingUser.name,
    email: existingUser.email,
    role: existingUser.role,
  };
};


const verifyEmail = async (token: string) => {
  const decoded = jwt.verify(token, envConfig.emailSecret) as {
    userId: string;
    id: string
  };
  console.log(decoded);
  const user = await findUserById(decoded.userId);


  if (!user) {
    throw new AppError(404, 'User not found');
  }
  await prisma.user.update({
    where: { id: decoded.userId },
    data: { emailVerified: true },
  });

  return { message: 'Email verified successfully' };
};



export const AuthServices = {
  login,
  register,
  refreshToken,
  me,
  verifyEmail,
};
