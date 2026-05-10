import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { catchAsync } from '@/shared/utils/catchAsync';
import { sendResponse } from '@/shared/utils/sendResponse';
import { UserServices } from './user.service';

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getMyProfile(req.user);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Profile fetched successfully',
    data: result,
  });
});

const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.updateMyProfile(req.user, req.body);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Profile updated successfully',
    data: result,
  });
});

export const UserControllers = {
  getMyProfile,
  updateMyProfile,
};
