import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { emergencyRequestService } from './emergencyRequest.service';

const createEmergencyRequest = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await emergencyRequestService.createEmergencyRequest(userId, req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Emergency request created successfully',
    data: result,
  });
});

const getMyRequests = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await emergencyRequestService.getMyRequests(userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'My emergency requests retrieved successfully',
    data: result,
  });
});

const getAllRequests = catchAsync(async (req: Request, res: Response) => {
  const filters = {
    searchTerm: req.query.searchTerm as string,
    status: req.query.status as any,
    priority: req.query.priority as any,
  };
  const options = {
    page: Number(req.query.page),
    limit: Number(req.query.limit),
  };

  const result = await emergencyRequestService.getAllRequests(filters, options);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Emergency requests retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getRequestById = catchAsync(async (req: Request, res: Response) => {
  const result = await emergencyRequestService.getRequestById(req.params.id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Emergency request retrieved successfully',
    data: result,
  });
});

const assignDriver = catchAsync(async (req: Request, res: Response) => {
  const result = await emergencyRequestService.assignDriver(req.params.id as string, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Driver and ambulance assigned successfully',
    data: result,
  });
});

const updateStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await emergencyRequestService.updateStatus(req.params.id as string, req.body.status);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Emergency request status updated successfully',
    data: result,
  });
});

export const emergencyRequestController = {
  createEmergencyRequest,
  getMyRequests,
  getAllRequests,
  getRequestById,
  assignDriver,
  updateStatus,
};