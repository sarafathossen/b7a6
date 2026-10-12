import { z } from 'zod';

const initiatePaymentValidationSchema = z.object({
  body: z.object({
    requestId: z.string().min(1, 'Request ID is required'),
  }),
});

export const paymentValidation = {
  initiatePaymentValidationSchema,
};