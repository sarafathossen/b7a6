import { z } from 'zod';

const registerValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    phone: z.string().min(1, 'Phone number is required'),
    role: z.enum(['CALLER', 'DRIVER', 'ADMIN']).optional(),
  }),
});

const loginValidationSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

const refreshTokenValidationSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
  }),
});

export const authValidation = {
  registerValidationSchema,
  loginValidationSchema,
  refreshTokenValidationSchema,
};