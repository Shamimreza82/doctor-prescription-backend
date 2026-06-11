import { z } from 'zod';

const phoneValidation = z
  .string()
  .regex(/^(\+88)?01[3-9]\d{8}$/, 'Invalid Bangladeshi phone number');

const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: phoneValidation,
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(["MR", "DOCTOR"])
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

export const AuthValidationSchemas = {
  registerSchema,
  loginSchema,
};

export type TRegisterInput = z.infer<typeof registerSchema>['body'];
export type TLoginInput = z.infer<typeof loginSchema>['body'];
