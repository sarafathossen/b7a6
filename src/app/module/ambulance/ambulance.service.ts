import prisma from '../../lib/prisma';
import { Ambulance, Prisma } from '@prisma/client';
import { IAmbulanceFilterRequest } from './ambulance.interface';

const createAmbulance = async (data: Ambulance): Promise<Ambulance> => {
  const result = await prisma.ambulance.create({
    data,
  });
  return result;
};

const getAllAmbulances = async (filters: IAmbulanceFilterRequest) => {
  const { searchTerm, type, isAvailable } = filters;
  const andConditions: Prisma.AmbulanceWhereInput[] = [{ isDeleted: false }];

  if (searchTerm) {
    andConditions.push({
      vehicleNumber: {
        contains: searchTerm,
        mode: 'insensitive',
      },
    });
  }

  if (type) {
    andConditions.push({ type });
  }

  if (isAvailable !== undefined) {
    andConditions.push({ isAvailable: Boolean(isAvailable) });
  }

  const result = await prisma.ambulance.findMany({
    where: { AND: andConditions },
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

  return result;
};

const getSingleAmbulance = async (id: string): Promise<Ambulance | null> => {
  const result = await prisma.ambulance.findUnique({
    where: { id, isDeleted: false },
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

  if (!result) {
    throw new Error('Ambulance not found');
  }

  return result;
};

const updateAmbulance = async (id: string, payload: Partial<Ambulance>): Promise<Ambulance> => {
  const isExist = await prisma.ambulance.findUnique({ where: { id, isDeleted: false } });
  if (!isExist) {
    throw new Error('Ambulance not found');
  }

  const result = await prisma.ambulance.update({
    where: { id },
    data: payload,
  });
  return result;
};

const deleteAmbulance = async (id: string): Promise<Ambulance> => {
  const isExist = await prisma.ambulance.findUnique({ where: { id, isDeleted: false } });
  if (!isExist) {
    throw new Error('Ambulance not found');
  }

  // সফট ডিলিট রিকোয়ারমেন্ট পূরণ করতে
  const result = await prisma.ambulance.update({
    where: { id },
    data: { isDeleted: true },
  });
  return result;
};

export const ambulanceService = {
  createAmbulance,
  getAllAmbulances,
  getSingleAmbulance,
  updateAmbulance,
  deleteAmbulance,
};