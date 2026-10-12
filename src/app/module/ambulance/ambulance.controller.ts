import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ambulanceService } from './ambulance.service';

const createAmbulance = catchAsync(async (req: Request, res: Response) => {
  const result = await ambulanceService.createAmbulance(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Ambulance created successfully',
    data: result,
  });
});

const getAllAmbulances = catchAsync(async (req: Request, res: Response) => {
  const filters = {
    searchTerm: req.query.searchTerm as string,
    type: req.query.type as any,
    isAvailable: req.query.isAvailable === undefined ? undefined : req.query.isAvailable === 'true',
  };
  const options = {
    page: Number(req.query.page),
    limit: Number(req.query.limit),
  };

  const result = await ambulanceService.getAllAmbulances(filters, options);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Ambulances fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getAmbulanceById = catchAsync(async (req: Request, res: Response) => {
  const result = await ambulanceService.getAmbulanceById(req.params.id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Ambulance retrieved successfully',
    data: result,
  });
});

const updateAmbulance = catchAsync(async (req: Request, res: Response) => {
  const result = await ambulanceService.updateAmbulance(req.params.id as string, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Ambulance updated successfully',
    data: result,
  });
});

const deleteAmbulance = catchAsync(async (req: Request, res: Response) => {
  const result = await ambulanceService.deleteAmbulance(req.params.id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Ambulance deleted successfully',
    data: result,
  });
});

export const ambulanceController = {
  createAmbulance,
  getAllAmbulances,
  getAmbulanceById,
  updateAmbulance,
  deleteAmbulance,
};