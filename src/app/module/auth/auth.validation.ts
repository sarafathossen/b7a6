import { z } from 'zod';

const registerValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),
    email: z.string({ required_error: 'Email is required' }).email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    phone: z.string({ required_error: 'Phone number is required' }),
    role: z.enum(['CALLER', 'DRIVER', 'ADMIN']).optional(),
  }),
});

const loginValidationSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }).email(),
    password: z.string({ required_error: 'Password is required' }),
  }),
});

export const authValidation = {
  registerValidationSchema,
  loginValidationSchema,
};