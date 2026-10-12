import prisma from '../../lib/prisma';
import { AmbulanceRequest, Prisma, RequestStatus } from '@prisma/client';
import { IEmergencyRequestFilter } from './emergencyRequest.interface';

// ১. জরুরি রিকোয়েস্ট তৈরি
const createRequest = async (callerId: string, payload: any): Promise<AmbulanceRequest> => {
  const result = await prisma.ambulanceRequest.create({
    data: {
      callerId,
      pickupAddress: payload.pickupAddress,
      destinationAddress: payload.destinationAddress,
      priority: payload.priority || 'HIGH',
      totalAmount: payload.totalAmount,
      hospitalId: payload.hospitalId || null,
      ambulanceId: payload.ambulanceId || null,
      status: 'PENDING',
    },
    include: {
      caller: {
        select: { id: true, name: true, phone: true },
      },
    },
  });

  return result;
};

// ২. সব রিকোয়েস্ট ফেচ (পেজিনেশন ও ফিল্টারিং সহ)
const getAllRequests = async (filters: IEmergencyRequestFilter, options: { page?: number; limit?: number }) => {
  const { searchTerm, status, priority } = filters;
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 10;
  const skip = (page - 1) * limit;

  const andConditions: Prisma.AmbulanceRequestWhereInput[] = [{ isDeleted: false }];

  if (searchTerm) {
    andConditions.push({
      OR: [
        { pickupAddress: { contains: searchTerm, mode: 'insensitive' } },
        { destinationAddress: { contains: searchTerm, mode: 'insensitive' } },
      ],
    });
  }

  if (status) {
    andConditions.push({ status });
  }

  if (priority) {
    andConditions.push({ priority });
  }

  const result = await prisma.ambulanceRequest.findMany({
    where: { AND: andConditions },
    skip,
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: {
      caller: { select: { name: true, phone: true } },
      driver: { include: { user: { select: { name: true, phone: true } } } },
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

// ৩. ট্রানজ্যাকশন ব্যবহার করে ড্রাইভার ও অ্যাম্বুলেন্স অ্যাসাইন করা (Atomic Transaction)
const assignDriverAndAmbulance = async (requestId: string, payload: { driverId: string; ambulanceId: string }) => {
  return await prisma.$transaction(async (tx) => {
    // রিকোয়েস্ট চেক
    const request = await tx.ambulanceRequest.findUnique({
      where: { id: requestId, isDeleted: false },
    });
    if (!request) throw new Error('Emergency request not found');
    if (request.status === 'COMPLETED' || request.status === 'CANCELLED') {
      throw new Error(`Cannot assign to a ${request.status} request`);
    }

    // ড্রাইভার ও অ্যাম্বুলেন্স ফ্রি আছে কিনা চেক
    const ambulance = await tx.ambulance.findUnique({ where: { id: payload.ambulanceId } });
    if (!ambulance || !ambulance.isAvailable) {
      throw new Error('Ambulance is not available or occupied');
    }

    const driver = await tx.driverProfile.findUnique({ where: { id: payload.driverId } });
    if (!driver || !driver.isAvailable) {
      throw new Error('Driver is currently unavailable');
    }

    // ১. অ্যাম্বুলেন্সকে ব্যস্ত করা
    await tx.ambulance.update({
      where: { id: payload.ambulanceId },
      data: { isAvailable: false },
    });

    // ২. ড্রাইভারকে ব্যস্ত করা
    await tx.driverProfile.update({
      where: { id: payload.driverId },
      data: { isAvailable: false, ambulanceId: payload.ambulanceId },
    });

    // ৩. রিকোয়েস্ট আপডেট
    const updatedRequest = await tx.ambulanceRequest.update({
      where: { id: requestId },
      data: {
        driverId: payload.driverId,
        ambulanceId: payload.ambulanceId,
        status: 'ASSIGNED',
      },
      include: {
        ambulance: true,
        driver: { include: { user: true } },
      },
    });

    return updatedRequest;
  });
};

// ৪. স্ট্যাটাস পরিবর্তন (ড্রাইভার বা অ্যাডমিন)
const updateRequestStatus = async (requestId: string, status: RequestStatus) => {
  return await prisma.$transaction(async (tx) => {
    const request = await tx.ambulanceRequest.findUnique({ where: { id: requestId } });
    if (!request) throw new Error('Request not found');

    // ট্রিপ শেষ বা ক্যানসেল হলে ড্রাইভার ও অ্যাম্বুলেন্স পুনরায় এভেইলেবল করা
    if (status === 'COMPLETED' || status === 'CANCELLED') {
      if (request.ambulanceId) {
        await tx.ambulance.update({
          where: { id: request.ambulanceId },
          data: { isAvailable: true },
        });
      }

      if (request.driverId) {
        await tx.driverProfile.update({
          where: { id: request.driverId },
          data: { isAvailable: true },
        });
      }
    }

    const result = await tx.ambulanceRequest.update({
      where: { id: requestId },
      data: { status },
      include: { driver: true, ambulance: true },
    });

    return result;
  });
};

// ৫. ইউজারের নিজস্ব ট্রিপ লিস্ট
const getMyRequests = async (userId: string, role: string) => {
  if (role === 'CALLER') {
    return await prisma.ambulanceRequest.findMany({
      where: { callerId: userId, isDeleted: false },
      include: { ambulance: true, payment: true },
      orderBy: { createdAt: 'desc' },
    });
  } else if (role === 'DRIVER') {
    const driverProfile = await prisma.driverProfile.findUnique({ where: { userId } });
    if (!driverProfile) throw new Error('Driver profile not found');

    return await prisma.ambulanceRequest.findMany({
      where: { driverId: driverProfile.id, isDeleted: false },
      include: { caller: { select: { name: true, phone: true } }, ambulance: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  return [];
};

export const emergencyRequestService = {
  createRequest,
  getAllRequests,
  assignDriverAndAmbulance,
  updateRequestStatus,
  getMyRequests,
};