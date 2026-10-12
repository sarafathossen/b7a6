import express from 'express';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';
import { ambulanceController } from './ambulance.controller';
import { ambulanceValidation } from './ambulance.validation';

const router = express.Router();

// শুধু ADMIN নতুন অ্যাম্বুলেন্স তৈরি করতে পারবে
router.post(
  '/',
  auth('ADMIN'),
  validateRequest(ambulanceValidation.createAmbulanceZodSchema),
  ambulanceController.createAmbulance
);

// সবাই দেখতে পারবে
router.get('/', ambulanceController.getAllAmbulances);
router.get('/:id', ambulanceController.getSingleAmbulance);

// শুধু ADMIN আপডেট ও ডিলিট করতে পারবে
router.patch(
  '/:id',
  auth('ADMIN'),
  validateRequest(ambulanceValidation.updateAmbulanceZodSchema),
  ambulanceController.updateAmbulance
);

router.delete('/:id', auth('ADMIN'), ambulanceController.deleteAmbulance);

export const ambulanceRoutes = router;