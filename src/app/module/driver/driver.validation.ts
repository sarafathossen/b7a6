import { z } from 'zod';

const createDriverProfileZodSchema = z.object({
  body: z.object({
    licenseNumber: z.string().min(1, 'License number is required'),
    ambulanceId: z.string().optional(),
  }),
});

const updateDriverProfileZodSchema = z.object({
  body: z.object({
    licenseNumber: z.string().optional(),
    isAvailable: z.boolean().optional(),
    ambulanceId: z.string().nullable().optional(),
  }),
});

export const driverValidation = {
  createDriverProfileZodSchema,
  updateDriverProfileZodSchema,
};