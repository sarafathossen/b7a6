import { Hospital, Prisma } from '@prisma/client';
import prisma from '../../lib/prisma';
import { IHospitalFilter } from './hospital.interface';

const createHospital = async (payload: {
  name: string;
  address: string;
  contactNumber: string;
  emergencyUnits?: number;
}): Promise<Hospital> => {
  const result = await prisma.hospital.create({
    data: {
      name: payload.name,
      address: payload.address,
      contactNumber: payload.contactNumber,
      emergencyUnits: payload.emergencyUnits ?? 5,
    },
  });

  return result;
};

const getAllHospitals = async (
  filters: IHospitalFilter,
  options: { page?: number; limit?: number }
) => {
  const { searchTerm } = filters;
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 10;
  const skip = (page - 1) * limit;

  const andConditions: Prisma.HospitalWhereInput[] = [{ isDeleted: false }];

  if (searchTerm) {
    andConditions.push({
      OR: [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { address: { contains: searchTerm, mode: 'insensitive' } },
        { contactNumber: { contains: searchTerm, mode: 'insensitive' } },
      ],
    });
  }

  const result = await prisma.hospital.findMany({
    where: { AND: andConditions },
    skip,
    take: limit,
    orderBy: { createdAt: 'desc' },
  });

  const total = await prisma.hospital.count({
    where: { AND: andConditions },
  });

  return {
    meta: { page, limit, total },
    data: result,
  };
};

const getHospitalById = async (id: string): Promise<Hospital | null> => {
  const result = await prisma.hospital.findUnique({
    where: { id, isDeleted: false },
    include: {
      ambulanceRequests: {
        where: { isDeleted: false },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!result) {
    throw new Error('Hospital not found');
  }

  return result;
};

const updateHospital = async (id: string, payload: Partial<Hospital>): Promise<Hospital> => {
  const isExist = await prisma.hospital.findUnique({
    where: { id, isDeleted: false },
  });

  if (!isExist) {
    throw new Error('Hospital not found');
  }

  const result = await prisma.hospital.update({
    where: { id },
    data: payload,
  });

  return result;
};

const deleteHospital = async (id: string): Promise<Hospital> => {
  const isExist = await prisma.hospital.findUnique({
    where: { id, isDeleted: false },
  });

  if (!isExist) {
    throw new Error('Hospital not found');
  }

  const result = await prisma.hospital.update({
    where: { id },
    data: { isDeleted: true },
  });

  return result;
};

export const hospitalService = {
  createHospital,
  getAllHospitals,
  getHospitalById,
  updateHospital,
  deleteHospital,
};