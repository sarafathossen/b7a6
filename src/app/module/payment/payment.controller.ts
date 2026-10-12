import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { paymentService } from './payment.service';

const initiatePayment = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const { requestId } = req.body;
  const result = await paymentService.initiatePayment(req.user.id, requestId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'bKash payment session initiated successfully',
    data: result,
  });
});

const bkashCallback = catchAsync(async (req: Request, res: Response) => {
  const { paymentID, status, requestId } = req.query as {
    paymentID: string;
    status: string;
    requestId: string;
  };

  const result = await paymentService.executeBkashPayment(paymentID, status, requestId);

  sendResponse(res, {
    statusCode: 200,
    success: result.success,
    message: result.message,
    data: (result as any).data || null,
  });
});

const getPaymentById = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentService.getPaymentById(req.params.id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Payment record fetched successfully',
    data: result,
  });
});

export const paymentController = {
  initiatePayment,
  bkashCallback,
  getPaymentById,
};