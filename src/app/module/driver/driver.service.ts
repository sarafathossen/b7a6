import prisma from '../../lib/prisma';


const createDriverProfile = async (userId: string, payload: { licenseNumber: string; ambulanceId?: string }) => {
  const user = await prisma.user.findUnique({
    where: { id: userId, isDeleted: false },
  });

  if (!user || user.role !== 'DRIVER') {
    throw new Error('Only users with DRIVER role can create a driver profile');
  }

  const existingProfile = await prisma.driverProfile.findUnique({
    where: { userId },
  });

  if (existingProfile) {
    throw new Error('Driver profile already exists for this user');
  }

  if (payload.ambulanceId) {
    const ambulance = await prisma.ambulance.findUnique({
      where: { id: payload.ambulanceId, isDeleted: false },
    });
    if (!ambulance) {
      throw new Error('Ambulance not found');
    }
  }

  const result = await prisma.driverProfile.create({
    data: {
      userId,
      licenseNumber: payload.licenseNumber,
      ambulanceId: payload.ambulanceId || null,
    },
    include: {
      user: {
        select: { id: true, name: true, email: true, phone: true },
      },
      ambulance: true,
    },
  });

  return result;
};


const getAllDrivers = async (filters: { isAvailable?: boolean; searchTerm?: string }, options: { page?: number; limit?: number }) => {
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 10;
  const skip = (page - 1) * limit;

  const whereConditions: any = {};

  if (filters.isAvailable !== undefined) {
    whereConditions.isAvailable = filters.isAvailable;
  }

  if (filters.searchTerm) {
    whereConditions.OR = [
      { licenseNumber: { contains: filters.searchTerm, mode: 'insensitive' } },
      { user: { name: { contains: filters.searchTerm, mode: 'insensitive' } } },
      { user: { phone: { contains: filters.searchTerm, mode: 'insensitive' } } },
    ];
  }

  const result = await prisma.driverProfile.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: { id: true, name: true, email: true, phone: true },
      },
      ambulance: true,
    },
  });

  const total = await prisma.driverProfile.count({ where: whereConditions });

  return {
    meta: { page, limit, total },
    data: result,
  };
};


const getMyDriverProfile = async (userId: string) => {
  const result = await prisma.driverProfile.findUnique({
    where: { userId },
    include: {
      user: {
        select: { id: true, name: true, email: true, phone: true },
      },
      ambulance: true,
      assignedRequests: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!result) {
    throw new Error('Driver profile not found');
  }

  return result;
};


const updateDriverProfile = async (id: string, payload: { licenseNumber?: string; isAvailable?: boolean; ambulanceId?: string | null }) => {
  const profile = await prisma.driverProfile.findUnique({
    where: { id },
  });

  if (!profile) {
    throw new Error('Driver profile not found');
  }

  const result = await prisma.driverProfile.update({
    where: { id },
    data: payload,
    include: {
      user: {
        select: { id: true, name: true, email: true, phone: true },
      },
      ambulance: true,
    },
  });

  return result;
};

export const driverService = {
  createDriverProfile,
  getAllDrivers,
  getMyDriverProfile,
  updateDriverProfile,
};