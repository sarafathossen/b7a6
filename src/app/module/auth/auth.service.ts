import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../lib/prisma';
import { ILoginUserResponse } from './auth.interface';

const registerUser = async (payload: any) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (existingUser) {
    throw new Error('User already exists with this email');
  }

  const hashedPassword = await bcrypt.hash(
    payload.password,
    Number(process.env.BCRYPT_SALT_ROUNDS) || 10
  );

  const newUser = await prisma.user.create({
    data: {
      ...payload,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      createdAt: true,
    },
  });

  // ইউজার যদি ড্রাইভার হিসেবে রেজিস্টার করে, তবে সাথে সাথে ড্রাইভার প্রোফাইল তৈরি হবে
  if (payload.role === 'DRIVER') {
    await prisma.driverProfile.create({
      data: {
        userId: newUser.id,
        licenseNumber: `DL-${Date.now()}`,
      },
    });
  }

  return newUser;
};

const loginUser = async (payload: any): Promise<ILoginUserResponse> => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user || user.isDeleted) {
    throw new Error('User not found');
  }

  const isPasswordMatched = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordMatched) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: '7d' }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
    },
  };
};

export const authService = {
  registerUser,
  loginUser,
};