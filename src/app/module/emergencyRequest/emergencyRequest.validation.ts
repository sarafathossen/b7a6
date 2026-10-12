import { z } from 'zod';

const createEmergencyRequestZodSchema = z.object({
  body: z.object({
    pickupAddress: z.string().min(1, 'Pickup address is required'),
    destinationAddress: z.string().min(1, 'Destination address is required'),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
    totalAmount: z.number().positive('Total amount must be greater than zero'),
    hospitalId: z.string().optional(),
    ambulanceId: z.string().optional(),
  }),
});

const assignDriverZodSchema = z.object({
  body: z.object({
    driverId: z.string().min(1, 'Driver ID is required'),
    ambulanceId: z.string().min(1, 'Ambulance ID is required'),
  }),
});

const updateStatusZodSchema = z.object({
  body: z.object({
    status: z.enum(['PENDING', 'ASSIGNED', 'EN_ROUTE', 'PICKED_UP', 'COMPLETED', 'CANCELLED'], {
      message: 'Invalid request status',
    }),
  }),
});

