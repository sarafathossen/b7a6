import { RequestPriority, RequestStatus } from '@prisma/client';

export type IEmergencyRequestFilter = {
  searchTerm?: string;
  status?: RequestStatus;
  priority?: RequestPriority;
};