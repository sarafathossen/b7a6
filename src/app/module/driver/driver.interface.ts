export type IDriverFilter = {
  searchTerm?: string;
  isAvailable?: boolean | string;
};

export type ICreateDriverPayload = {
  licenseNumber: string;
  ambulanceId?: string;
};