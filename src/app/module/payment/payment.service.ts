import axios from 'axios';
import prisma from '../../lib/prisma';

const bkashConfig = {
  base_url: process.env.BKASH_BASE_URL || 'https://tokenized.sandbox.bka.sh/v1.2.0-beta',
  app_key: process.env.BKASH_APP_KEY || '4f6o0cjiki2rfm34kfdadl1eqq',
  app_secret: process.env.BKASH_APP_SECRET || '2is7hdktrekvrbljjh44ll3d9l1dtjo4pasmjvs5vl5qr3fug4b',
  username: process.env.BKASH_USERNAME || 'sandboxTokenizedUser02',
  password: process.env.BKASH_PASSWORD || 'sandboxTokenizedUser02@12345',
};


const getBkashHeaders = async () => {
  const { data } = await axios.post(
    `${bkashConfig.base_url}/tokenized/checkout/token/grant`,
    {
      app_key: bkashConfig.app_key,
      app_secret: bkashConfig.app_secret,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        username: bkashConfig.username,
        password: bkashConfig.password,
      },
    }
  );

  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    authorization: data.id_token,
    'x-app-key': bkashConfig.app_key,
  };
};


const initiatePayment = async (userId: string, requestId: string) => {
  const emergencyRequest = await prisma.ambulanceRequest.findUnique({
    where: { id: requestId, isDeleted: false },
    include: { caller: true },
  });

  if (!emergencyRequest) {
    throw new Error('Emergency request not found');
  }

  if (emergencyRequest.callerId !== userId) {
    throw new Error('You are not authorized to pay for this request');
  }

  const existingPayment = await prisma.payment.findUnique({
    where: { requestId },
  });

  if (existingPayment && existingPayment.status === 'PAID') {
    throw new Error('This emergency request has already been paid for');
  }

  const headers = await getBkashHeaders();
  const invoiceNumber = `INV-${Date.now()}`;

  
  const { data } = await axios.post(
    `${bkashConfig.base_url}/tokenized/checkout/create`,
    {
      mode: '0011',
      payerReference: emergencyRequest.caller.phone || '01770618575',
      callbackURL: `${process.env.BKASH_CALLBACK_URL}?requestId=${requestId}`,
      amount: String(emergencyRequest.totalAmount),
      currency: 'BDT',
      intent: 'sale',
      merchantInvoiceNumber: invoiceNumber,
    },
    { headers }
  );

  if (!data?.bkashURL || !data?.paymentID) {
    throw new Error(data?.statusMessage || 'Failed to generate bKash payment URL');
  }

  
  if (existingPayment) {
    await prisma.payment.update({
      where: { requestId },
      data: {
        transactionId: data.paymentID,
        status: 'PENDING',
        paymentMethod: 'BKASH',
        amount: emergencyRequest.totalAmount,
      },
    });
  } else {
    await prisma.payment.create({
      data: {
        requestId,
        userId,
        amount: emergencyRequest.totalAmount,
        transactionId: data.paymentID,
        paymentMethod: 'BKASH',
        status: 'PENDING',
      },
    });
  }

  return {
    paymentUrl: data.bkashURL, 
    paymentID: data.paymentID,
  };
};


const executeBkashPayment = async (paymentID: string, status: string, requestId: string) => {
  if (status === 'cancel' || status === 'failure') {
    await prisma.payment.update({
      where: { requestId },
      data: { status: 'FAILED' },
    });
    return { success: false, message: `Payment was ${status}` };
  }

  const headers = await getBkashHeaders();

  const { data } = await axios.post(
    `${bkashConfig.base_url}/tokenized/checkout/execute`,
    { paymentID },
    { headers }
  );

  if (data && data.statusCode === '0000') {
    const updatedPayment = await prisma.payment.update({
      where: { requestId },
      data: {
        status: 'PAID',
        transactionId: data.trxID,
      },
      include: { request: true },
    });

    return {
      success: true,
      message: 'Payment executed successfully',
      data: updatedPayment,
    };
  } else {
    await prisma.payment.update({
      where: { requestId },
      data: { status: 'FAILED' },
    });
    throw new Error(data.statusMessage || 'Payment execution failed');
  }
};

const getPaymentById = async (id: string) => {
  const payment = await prisma.payment.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true, phone: true } },
      request: true,
    },
  });

  if (!payment) {
    throw new Error('Payment record not found');
  }

  return payment;
};

export const paymentService = {
  initiatePayment,
  executeBkashPayment,
  getPaymentById,
};