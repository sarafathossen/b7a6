import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
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
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      role: payload.role || 'CALLER',
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

  
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    (process.env.JWT_SECRET as string) || 'default_secret',
    { expiresIn: (process.env.JWT_EXPIRES_IN as any) || '1d' }
  );

  
  const refreshToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    (process.env.JWT_REFRESH_SECRET as string) || 'default_refresh_secret',
    { expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN as any) || '30d' }
  );

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as any,
      phone: user.phone,
    },
  };
};


const refreshToken = async (token: string) => {
  let verifiedToken: any = null;
  try {
    verifiedToken = jwt.verify(
      token,
      (process.env.JWT_REFRESH_SECRET as string) || 'default_refresh_secret'
    ) as JwtPayload;
  } catch (err) {
    throw new Error('Invalid refresh token');
  }

  const user = await prisma.user.findUnique({
    where: { id: verifiedToken.id },
  });

  if (!user || user.isDeleted) {
    throw new Error('User does not exist');
  }

  const newAccessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    (process.env.JWT_SECRET as string) || 'default_secret',
    { expiresIn: (process.env.JWT_EXPIRES_IN as any) || '1d' }
  );

  return {
    accessToken: newAccessToken,
  };
};

export const authService = {
  registerUser,
  loginUser,
  refreshToken,
};