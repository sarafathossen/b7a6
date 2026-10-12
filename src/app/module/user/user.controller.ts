import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { userService } from './user.service';

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await userService.getMyProfile(userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Profile retrieved successfully',
    data: result,
  });
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await userService.updateProfile(userId, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Profile updated successfully',
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const filters = {
    searchTerm: req.query.searchTerm as string,
    role: req.query.role as any,
  };
  const options = {
    page: Number(req.query.page),
    limit: Number(req.query.limit),
  };

  const result = await userService.getAllUsers(filters, options);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Users retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const changeUserRole = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.changeUserRole(req.params.id as string, req.body.role);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User role updated successfully',
    data: result,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.deleteUser(req.params.id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User deleted successfully',
    data: result,
  });
});

export const userController = {
  getMyProfile,
  updateProfile,
  getAllUsers,
  changeUserRole,
  deleteUser,
};