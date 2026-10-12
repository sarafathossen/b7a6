import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { driverService } from './driver.service';

const createDriverProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await driverService.createDriverProfile(userId, req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Driver profile created successfully',
    data: result,
  });
});

const getAllDrivers = catchAsync(async (req: Request, res: Response) => {
  const filters = {
    searchTerm: req.query.searchTerm as string,
    isAvailable: req.query.isAvailable === undefined ? undefined : req.query.isAvailable === 'true',
  };
  const options = {
    page: Number(req.query.page),
    limit: Number(req.query.limit),
  };

  const result = await driverService.getAllDrivers(filters, options);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Drivers fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getMyDriverProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await driverService.getMyDriverProfile(userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Driver profile retrieved successfully',
    data: result,
  });
});

const updateDriverProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await driverService.updateDriverProfile(req.params.id as string, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Driver profile updated successfully',
    data: result,
  });
});

export const driverController = {
  createDriverProfile,
  getAllDrivers,
  getMyDriverProfile,
  updateDriverProfile,
};