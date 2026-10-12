import express from 'express';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';
import { paymentController } from './payment.controller';
import { paymentValidation } from './payment.validation';

const router = express.Router();

// ১. কলার বিকাশ পেমেন্ট ইনিশিয়েট করবে
router.post(
  '/initiate',
  auth('CALLER'),
  validateRequest(paymentValidation.initiatePaymentValidationSchema),
  paymentController.initiatePayment
);

// ২. বিকাশ পেমেন্ট সম্পন্ন হলে এই কলব্যাকে হিট করবে
router.get('/bkash-callback', paymentController.bkashCallback);

// ৩. পেমেন্ট রেকর্ড দেখা
router.get('/:id', auth('CALLER', 'ADMIN'), paymentController.getPaymentById);

export const paymentRoutes = router;