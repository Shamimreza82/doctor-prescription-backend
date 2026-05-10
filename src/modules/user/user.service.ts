import { StatusCodes } from 'http-status-codes';
import { AppError } from '@/shared/errors/AppError';
import { UserRepository } from './user.repository';
import { TJwtPayload } from '@/modules/auth/auth.utils';
import { TUpdateUserProfileInput } from './user.types';

const getMyProfile = async (actor: TJwtPayload) => {
  const user = await UserRepository.findById(actor.userId);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }
  return user;
};

const updateMyProfile = async (actor: TJwtPayload, payload: TUpdateUserProfileInput) => {
  const user = await UserRepository.findById(actor.userId);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }

  return UserRepository.update(actor.userId, payload);
};

export const UserServices = {
  getMyProfile,
  updateMyProfile,
};
