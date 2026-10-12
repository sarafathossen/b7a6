import { Prisma, User } from '@prisma/client';
import prisma from '../../lib/prisma';
import { IUserFilter, IUserRole } from './user.interface';


// ১. নিজের প্রোফাইল দেখা
const getMyProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId, isDeleted: false },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      driverProfile: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

// ২. প্রোফাইল তথ্য আপডেট
const updateProfile = async (userId: string, payload: { name?: string; phone?: string }) => {
  const user = await prisma.user.findUnique({
    where: { id: userId, isDeleted: false },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const result = await prisma.user.update({
    where: { id: userId },
    data: payload,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      updatedAt: true,
    },
  });

  return result;
};

// ৩. সব ইউজার ফেচ করা (ADMIN)
const getAllUsers = async (filters: IUserFilter, options: { page?: number; limit?: number }) => {
  const { searchTerm, role } = filters;
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 10;
  const skip = (page - 1) * limit;

  const andConditions: any[] = [{ isDeleted: false }];

  if (role) {
    andConditions.push({ role });
  }

  if (searchTerm) {
    andConditions.push({
      OR: [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { email: { contains: searchTerm, mode: 'insensitive' } },
        { phone: { contains: searchTerm, mode: 'insensitive' } },
      ],
    });
  }

  const result = await prisma.user.findMany({
    where: { AND: andConditions },
    skip,
    take: limit,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
    },
  });

  const total = await prisma.user.count({
    where: { AND: andConditions },
  });

  return {
    meta: { page, limit, total },
    data: result,
  };
};

// ৪. ইউজারের রোল পরিবর্তন (ADMIN)
const changeUserRole = async (userId: string, role: IUserRole) => {
  const user = await prisma.user.findUnique({
    where: { id: userId, isDeleted: false },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const result = await prisma.user.update({
    where: { id: userId },
    data: { role },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  return result;
};

// ৫. সফট ডিলিট (ADMIN)
const deleteUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId, isDeleted: false },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const result = await prisma.user.update({
    where: { id: userId },
    data: { isDeleted: true },
  });

  return result;
};

export const userService = {
  getMyProfile,
  updateProfile,
  getAllUsers,
  changeUserRole,
  deleteUser,
};