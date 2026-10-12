import { z } from 'zod';

const createAmbulanceZodSchema = z.object({
  body: z.object({
    vehicleNumber: z.string().min(1, 'Vehicle number is required'),
    type: z.enum(['BASIC_LIFE_SUPPORT', 'ADVANCED_LIFE_SUPPORT', 'ICU_AMBULANCE']).optional(),
    basePrice: z.number().positive('Base price must be positive'),
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

