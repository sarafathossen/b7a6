import { AmbulanceType } from '@prisma/client';

export type IAmbulanceFilter = {
  searchTerm?: string;
  type?: AmbulanceType;
  isAvailable?: boolean;
};