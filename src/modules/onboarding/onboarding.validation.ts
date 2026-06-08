import { z } from 'zod';

const phoneValidation = z
  .string()
  .regex(/^(\+88)?01[3-9]\d{8}$/, 'Invalid Bangladeshi phone number');

const onboardingRegisterSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: phoneValidation,
    password: z.string().min(6, 'Password must be at least 6 characters'),
    planCode: z.string().min(1, 'Plan code is required'),
  }),
});

export const OnboardingValidationSchemas = {
  onboardingRegisterSchema,
};

export type TOnboardingInput = z.infer<typeof onboardingRegisterSchema>['body'];
