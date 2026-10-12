import { z } from 'zod';

const createEmergencyRequestZodSchema = z.object({
  body: z.object({
    pickupAddress: z.string({ required_error: 'Pickup address is required' }),
    destinationAddress: z.string({ required_error: 'Destination address is required' }),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
    totalAmount: z.number({ required_error: 'Total amount is required' }).positive(),
    hospitalId: z.string().optional(),
    ambulanceId: z.string().optional(),
  }),
});

const assignDriverZodSchema = z.object({
  body: z.object({
    driverId: z.string({ required_error: 'Driver ID is required' }),
    ambulanceId: z.string({ required_error: 'Ambulance ID is required' }),
  }),
});

const updateStatusZodSchema = z.object({
  body: z.object({
    status: z.enum(['ASSIGNED', 'EN_ROUTE', 'PICKED_UP', 'COMPLETED', 'CANCELLED'], {
      required_error: 'Status is required',
    }),
  }),
});

export const emergencyRequestValidation = {
  createEmergencyRequestZodSchema,
  assignDriverZodSchema,
  updateStatusZodSchema,
};