import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { hospitalService } from './hospital.service';

const createHospital = catchAsync(async (req: Request, res: Response) => {
  const result = await hospitalService.createHospital(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Hospital created successfully',
    data: result,
  });
});

const getAllHospitals = catchAsync(async (req: Request, res: Response) => {
  const filters = {
    searchTerm: req.query.searchTerm as string,
  };
  const options = {
    page: Number(req.query.page),
    limit: Number(req.query.limit),
  };

  const result = await hospitalService.getAllHospitals(filters, options);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Hospitals fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getHospitalById = catchAsync(async (req: Request, res: Response) => {
  const result = await hospitalService.getHospitalById(req.params.id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Hospital retrieved successfully',
    data: result,
  });
});

const updateHospital = catchAsync(async (req: Request, res: Response) => {
  const result = await hospitalService.updateHospital(req.params.id as string, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Hospital updated successfully',
    data: result,
  });
});

const deleteHospital = catchAsync(async (req: Request, res: Response) => {
  const result = await hospitalService.deleteHospital(req.params.id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Hospital deleted successfully',
    data: result,
  });
});

export const hospitalController = {
  createHospital,
  getAllHospitals,
  getHospitalById,
  updateHospital,
  deleteHospital,
};