import { z } from 'zod';

const updateProfileZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
  }),
});

const changeUserRoleZodSchema = z.object({
  body: z.object({
    role: z.enum(['CALLER', 'DRIVER', 'ADMIN'], {
      message: 'Role must be CALLER, DRIVER, or ADMIN',
    }),
  }),
});

export const userValidation = {
  updateProfileZodSchema,
  changeUserRoleZodSchema,
};