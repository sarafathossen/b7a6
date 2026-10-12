import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { emergencyRequestService } from './emergencyRequest.service';

const createRequest = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const result = await emergencyRequestService.createRequest(req.user.id, req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Emergency ambulance request placed successfully',
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
    message: 'Emergency requests fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const assignDriverAndAmbulance = catchAsync(async (req: Request, res: Response) => {
  const result = await emergencyRequestService.assignDriverAndAmbulance(
    req.params.id as string,
    req.body
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Driver and Ambulance assigned successfully via transaction',
    data: result,
  });
});

const updateRequestStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await emergencyRequestService.updateRequestStatus(
    req.params.id as string,
    req.body.status
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Request status transitioned to ${req.body.status}`,
    data: result,
  });
});

const getMyRequests = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const result = await emergencyRequestService.getMyRequests(req.user.id, req.user.role);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'My emergency requests retrieved successfully',
    data: result,
  });
});

export const emergencyRequestController = {
  createRequest,
  getAllRequests,
  assignDriverAndAmbulance,
  updateRequestStatus,
  getMyRequests,
};