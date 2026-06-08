import { StatusCodes } from 'http-status-codes';

import { catchAsync } from '@/shared/utils/catchAsync';
import { sendResponse } from '@/shared/utils/sendResponse';

import { ONBOARDING_MESSAGES } from './onboarding.consted';
import { OnboardingServices } from './onboarding.service';
import { TOnboardingInput } from './onboarding.validation';

const createDoctor = catchAsync(async (req, res) => {
  const data: TOnboardingInput = req.body;
  const result = await OnboardingServices.createDoctor(data);

  sendResponse(res, StatusCodes.CREATED, {
    success: true,
    message: ONBOARDING_MESSAGES.REGISTER_SUCCESS,
    data: result,
  });
});

export const OnboardingControllers = {
  createDoctor,
};
