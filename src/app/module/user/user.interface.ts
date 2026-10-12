import { UserRole } from '@prisma/client';

export type IUserFilter = {
  searchTerm?: string;
  role?: UserRole;
};