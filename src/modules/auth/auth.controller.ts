import { StatusCodes } from 'http-status-codes';

import { catchAsync } from '@/shared/utils/catchAsync';
import { sendResponse } from '@/shared/utils/sendResponse';

import { AUTH_MESSAGES } from './auth.consted';
import { AuthServices } from './auth.service';
import { refreshTokenCookieOptions } from './auth.utils';
import { TLoginInput, TRegisterInput } from './auth.validation';



const register = catchAsync(async (req, res) => {
  const data = req.body as TRegisterInput;
  const result = await AuthServices.register(data);

  sendResponse(res, StatusCodes.CREATED, {
    success: true,
    message: AUTH_MESSAGES.REGISTER_SUCCESS,
    data: result,
  });
});




const login = catchAsync(async (req, res) => {
  const data = req.body as TLoginInput;
  const result = await AuthServices.login(data);
  const { user, accessToken, refreshToken } = result;

  res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: AUTH_MESSAGES.LOGIN_SUCCESS,
    data: {
      accessToken,
      user,
    },
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const token = req.cookies['refreshToken'] as string;
  const result = await AuthServices.refreshToken(token);

  res.cookie('refreshToken', result.refreshToken, refreshTokenCookieOptions);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: AUTH_MESSAGES.REFRESH_SUCCESS,
    data: {
      accessToken: result.accessToken,
    },
  });
});

const me = catchAsync(async (req, res) => {
  const userId = req.user?.userId;
  const result = await AuthServices.me(userId);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: AUTH_MESSAGES.ME_SUCCESS,
    data: result,
  });
}); 

export const AuthControllers = {
  login,
  register,
  refreshToken,
  me,
};
