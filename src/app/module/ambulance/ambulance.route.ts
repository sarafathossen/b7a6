import express from 'express';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';
import { ambulanceController } from './ambulance.controller';
import { ambulanceValidation } from './ambulance.validation';

const router = express.Router();

router.post(
  '/',
  auth('ADMIN'),
  validateRequest(ambulanceValidation.createAmbulanceZodSchema),
  ambulanceController.createAmbulance
);

router.get('/', ambulanceController.getAllAmbulances);

router.get('/:id', ambulanceController.getAmbulanceById);

router.patch(
  '/:id',
  auth('ADMIN'),
  validateRequest(ambulanceValidation.updateAmbulanceZodSchema),
  ambulanceController.updateAmbulance
);

router.delete('/:id', auth('ADMIN'), ambulanceController.deleteAmbulance);

export const ambulanceRoutes = router;