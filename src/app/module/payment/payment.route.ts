import express from 'express';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';
import { paymentController } from './payment.controller';
import { paymentValidation } from './payment.validation';

const router = express.Router();


router.post(
  '/initiate',
  auth('CALLER'),
  validateRequest(paymentValidation.initiatePaymentValidationSchema),
  paymentController.initiatePayment
);


router.get('/bkash-callback', paymentController.bkashCallback);


router.get('/:id', auth('CALLER', 'ADMIN'), paymentController.getPaymentById);

export const paymentRoutes = router;