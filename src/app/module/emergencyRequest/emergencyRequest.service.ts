import { AmbulanceRequest, Prisma, RequestStatus } from '@prisma/client';
import prisma from '../../lib/prisma';
import { IEmergencyRequestFilter } from './emergencyRequest.interface';


const createEmergencyRequest = async (
  callerId: string,
  payload: {
    pickupAddress: string;
    destinationAddress: string;
    priority?: any;
    totalAmount: number;
    hospitalId?: string;
    ambulanceId?: string;
  }
): Promise<AmbulanceRequest> => {
  const result = await prisma.ambulanceRequest.create({
    data: {
      callerId,
      pickupAddress: payload.pickupAddress,
      destinationAddress: payload.destinationAddress,
      priority: payload.priority || 'HIGH',
      totalAmount: payload.totalAmount,
      hospitalId: payload.hospitalId || null,
      ambulanceId: payload.ambulanceId || null,
    },
    include: {
      caller: {
        select: { id: true, name: true, phone: true, email: true },
      },
    },
  });

  return result;
};


const getMyRequests = async (callerId: string) => {
  const result = await prisma.ambulanceRequest.findMany({
    where: { callerId, isDeleted: false },
    orderBy: { createdAt: 'desc' },
    include: {
      driver: {
        include: {
          user: { select: { name: true, phone: true } },
        },
      },
      ambulance: true,
      hospital: true,
      payment: true,
    },
  });

  return result;
};


const getAllRequests = async (
  filters: IEmergencyRequestFilter,
  options: { page?: number; limit?: number }
) => {
  const { status, priority, searchTerm } = filters;
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 10;
  const skip = (page - 1) * limit;

  const andConditions: any[] = [{ isDeleted: false }];

  if (status) {
    andConditions.push({ status });
  }

  if (priority) {
    andConditions.push({ priority });
  }

  if (searchTerm) {
    andConditions.push({
      OR: [
        { pickupAddress: { contains: searchTerm, mode: 'insensitive' } },
        { destinationAddress: { contains: searchTerm, mode: 'insensitive' } },
        { caller: { name: { contains: searchTerm, mode: 'insensitive' } } },
        { caller: { phone: { contains: searchTerm, mode: 'insensitive' } } },
      ],
    });
  }

  const result = await prisma.ambulanceRequest.findMany({
    where: { AND: andConditions },
    skip,
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: {
      caller: { select: { id: true, name: true, phone: true, email: true } },
      driver: {
        include: { user: { select: { name: true, phone: true } } },
      },
      ambulance: true,
      hospital: true,
      payment: true,
    },
  });

  const total = await prisma.ambulanceRequest.count({
    where: { AND: andConditions },
  });

  return {
    meta: { page, limit, total },
    data: result,
  };
};


const getRequestById = async (id: string): Promise<AmbulanceRequest | null> => {
  const result = await prisma.ambulanceRequest.findUnique({
    where: { id, isDeleted: false },
    include: {
      caller: { select: { id: true, name: true, phone: true, email: true } },
      driver: {
        include: { user: { select: { name: true, phone: true } } },
      },
      ambulance: true,
      hospital: true,
      payment: true,
    },
  });

  if (!result) {
    throw new Error('Emergency request not found');
  }

  return result;
};


const assignDriver = async (
  requestId: string,
  payload: { driverId: string; ambulanceId: string }
) => {
  const request = await prisma.ambulanceRequest.findUnique({
    where: { id: requestId, isDeleted: false },
  });

  if (!request) {
    throw new Error('Emergency request not found');
  }

  // ড্রাইভার প্রোফাইল চেক
  const driver = await prisma.driverProfile.findUnique({
    where: { id: payload.driverId },
  });

  if (!driver) {
    throw new Error('Driver profile not found');
  }

  // অ্যাম্বুলেন্স চেক
  const ambulance = await prisma.ambulance.findUnique({
    where: { id: payload.ambulanceId, isDeleted: false },
  });

  if (!ambulance) {
    throw new Error('Ambulance not found');
  }

  // ট্রানজ্যাকশন: রিকোয়েস্ট আপডেট এবং ড্রাইভার ও অ্যাম্বুলেন্স বিজি (isAvailable: false) করা
  const result = await prisma.$transaction(async (tx) => {
    const updatedRequest = await tx.ambulanceRequest.update({
      where: { id: requestId },
      data: {
        driverId: payload.driverId,
        ambulanceId: payload.ambulanceId,
        status: 'ASSIGNED',
      },
      include: {
        driver: { include: { user: { select: { name: true, phone: true } } } },
        ambulance: true,
      },
    });

    await tx.driverProfile.update({
      where: { id: payload.driverId },
      data: { isAvailable: false },
    });

    await tx.ambulance.update({
      where: { id: payload.ambulanceId },
      data: { isAvailable: false },
    });

    return updatedRequest;
  });

  return result;
};


const updateStatus = async (requestId: string, status: RequestStatus) => {
  const request = await prisma.ambulanceRequest.findUnique({
    where: { id: requestId, isDeleted: false },
  });

  if (!request) {
    throw new Error('Emergency request not found');
  }

  // ট্রানজ্যাকশন: ট্রিপ সম্পন্ন বা বাতিল হলে ড্রাইভার ও অ্যাম্বুলেন্স ফ্রি (isAvailable: true) করা
  const result = await prisma.$transaction(async (tx) => {
    const updatedRequest = await tx.ambulanceRequest.update({
      where: { id: requestId },
      data: { status },
      include: {
        driver: true,
        ambulance: true,
      },
    });

    if (status === 'COMPLETED' || status === 'CANCELLED') {
      if (request.driverId) {
        await tx.driverProfile.update({
          where: { id: request.driverId },
          data: { isAvailable: true },
        });
      }

      if (request.ambulanceId) {
        await tx.ambulance.update({
          where: { id: request.ambulanceId },
          data: { isAvailable: true },
        });
      }
    }

    return updatedRequest;
  });

  return result;
};

export const emergencyRequestService = {
  createEmergencyRequest,
  getMyRequests,
  getAllRequests,
  getRequestById,
  assignDriver,
  updateStatus,
};