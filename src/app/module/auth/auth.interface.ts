import { Role } from '@prisma/client';

export type ILoginUserResponse = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: Role;
    phone: string;
  };
};