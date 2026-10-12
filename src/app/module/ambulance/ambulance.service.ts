import { Ambulance, Prisma } from '@prisma/client';
import prisma from '../../lib/prisma';
import { IAmbulanceFilter } from './ambulance.interface';

// ১. নতুন অ্যাম্বুলেন্স তৈরি
const createAmbulance = async (payload: { vehicleNumber: string; type?: any; basePrice: number }): Promise<Ambulance> => {
  const isExist = await prisma.ambulance.findUnique({
    where: { vehicleNumber: payload.vehicleNumber },
  });

  if (isExist) {
    throw new Error('Ambulance with this vehicle number already exists');
  }

  const result = await prisma.ambulance.create({
    data: {
      vehicleNumber: payload.vehicleNumber,
      type: payload.type || 'BASIC_LIFE_SUPPORT',
      basePrice: payload.basePrice,
    },
  });

  return result;
};

// ২. ফিল্টারিং ও পেজিনেশন সহ সব অ্যাম্বুলেন্স ফেচ
const getAllAmbulances = async (filters: IAmbulanceFilter, options: { page?: number; limit?: number }) => {
  const { searchTerm, type, isAvailable } = filters;
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 10;
  const skip = (page - 1) * limit;

  const andConditions: Prisma.AmbulanceWhereInput[] = [{ isDeleted: false }];

  if (searchTerm) {
    andConditions.push({
      vehicleNumber: { contains: searchTerm, mode: 'insensitive' },
    });
  }

  if (type) {
    andConditions.push({ type });
  }

  if (isAvailable !== undefined) {
    andConditions.push({ isAvailable });
  }

  const result = await prisma.ambulance.findMany({
    where: { AND: andConditions },
    skip,
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: {
      driverProfile: {
        include: {
          user: {
            select: { name: true, phone: true, email: true },
          },
        },
      },
    },
  });

  const total = await prisma.ambulance.count({
    where: { AND: andConditions },
  });

  return {
    meta: { page, limit, total },
    data: result,
  };
};

// ৩. সিঙ্গেল অ্যাম্বুলেন্স ডিটেইলস
const getAmbulanceById = async (id: string): Promise<Ambulance | null> => {
  const result = await prisma.ambulance.findUnique({
    where: { id, isDeleted: false },
    include: {
      driverProfile: {
        include: { user: { select: { name: true, phone: true } } },
      },
    },
  });

  if (!result) {
    throw new Error('Ambulance not found');
  }

  return result;
};

// ৪. অ্যাম্বুলেন্স আপডেট
const updateAmbulance = async (id: string, payload: Partial<Ambulance>): Promise<Ambulance> => {
  const isExist = await prisma.ambulance.findUnique({
    where: { id, isDeleted: false },
  });

  if (!isExist) {
    throw new Error('Ambulance not found');
  }

  const result = await prisma.ambulance.update({
    where: { id },
    data: payload,
  });

  return result;
};

// ৫. সফট ডিলিট
const deleteAmbulance = async (id: string): Promise<Ambulance> => {
  const isExist = await prisma.ambulance.findUnique({
    where: { id, isDeleted: false },
  });

  if (!isExist) {
    throw new Error('Ambulance not found');
  }

  const result = await prisma.ambulance.update({
    where: { id },
    data: { isDeleted: true },
  });

  return result;
};

export const ambulanceService = {
  createAmbulance,
  getAllAmbulances,
  getAmbulanceById,
  updateAmbulance,
  deleteAmbulance,
};