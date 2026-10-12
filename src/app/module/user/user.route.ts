import express from 'express';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';
import { userController } from './user.controller';
import { userValidation } from './user.validation';

const router = express.Router();

router.get('/me', auth('CALLER', 'DRIVER', 'ADMIN'), userController.getMyProfile);

router.patch(
  '/me',
  auth('CALLER', 'DRIVER', 'ADMIN'),
  validateRequest(userValidation.updateProfileZodSchema),
  userController.updateProfile
);

router.get('/', auth('ADMIN'), userController.getAllUsers);

router.patch(
  '/:id/role',
  auth('ADMIN'),
  validateRequest(userValidation.changeUserRoleZodSchema),
  userController.changeUserRole
);

router.delete('/:id', auth('ADMIN'), userController.deleteUser);

export const userRoutes = router;