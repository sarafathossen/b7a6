import { z } from 'zod';

const createAmbulanceZodSchema = z.object({
  body: z.object({
    vehicleNumber: z.string({ required_error: 'Vehicle number is required' }),
    type: z.enum(['BASIC_LIFE_SUPPORT', 'ADVANCED_LIFE_SUPPORT', 'ICU_AMBULANCE'], {
      required_error: 'Ambulance type is required',
    }),
    basePrice: z.number({ required_error: 'Base price is required' }).positive(),
  }),
});

const updateAmbulanceZodSchema = z.object({
  body: z.object({
    vehicleNumber: z.string().optional(),
    type: z.enum(['BASIC_LIFE_SUPPORT', 'ADVANCED_LIFE_SUPPORT', 'ICU_AMBULANCE']).optional(),
    basePrice: z.number().positive().optional(),
    isAvailable: z.boolean().optional(),
  }),
});

export const ambulanceValidation = {
  createAmbulanceZodSchema,
  updateAmbulanceZodSchema,
};