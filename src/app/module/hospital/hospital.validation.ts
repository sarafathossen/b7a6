import { z } from 'zod';

const createHospitalZodSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Hospital name is required'),
    address: z.string().min(1, 'Address is required'),
    contactNumber: z.string().min(1, 'Contact number is required'),
    emergencyUnits: z.number().int().nonnegative().optional(),
  }),
});

const updateHospitalZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    address: z.string().optional(),
    contactNumber: z.string().optional(),
    emergencyUnits: z.number().int().nonnegative().optional(),
  }),
});

export const hospitalValidation = {
  createHospitalZodSchema,
  updateHospitalZodSchema,
};