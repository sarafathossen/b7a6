import express from 'express';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';
import { emergencyRequestController } from './emergencyRequest.controller';
import { emergencyRequestValidation } from './emergencyRequest.validation';

const router = express.Router();

// ১. কলার জরুরি রিকোয়েস্ট করবে
router.post(
  '/',
  auth('CALLER'),
  validateRequest(emergencyRequestValidation.createEmergencyRequestZodSchema),
  emergencyRequestController.createRequest
);

// ২. অ্যাডমিন সব রিকোয়েস্ট ফিল্টারিং ও পেজিনেশন সহ দেখবে
router.get('/', auth('ADMIN'), emergencyRequestController.getAllRequests);

// ৩. ইউজার/ড্রাইভার নিজের ট্রিপ লিস্ট দেখবে
router.get('/my-requests', auth('CALLER', 'DRIVER'), emergencyRequestController.getMyRequests);

// ৪. অ্যাডমিন ড্রাইভার ও গাড়ি অ্যাসাইন করবে (ট্রানজ্যাকশন)
router.post(
  '/:id/assign',
  auth('ADMIN'),
  validateRequest(emergencyRequestValidation.assignDriverZodSchema),
  emergencyRequestController.assignDriverAndAmbulance
);

// ৫. ড্রাইভার বা অ্যাডমিন ট্রিপ স্ট্যাটাস আপডেট করবে
router.patch(
  '/:id/status',
  auth('DRIVER', 'ADMIN'),
  validateRequest(emergencyRequestValidation.updateStatusZodSchema),
  emergencyRequestController.updateRequestStatus
);

export const emergencyRequestRoutes = router;