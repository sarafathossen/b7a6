export type IUserRole = 'CALLER' | 'DRIVER' | 'ADMIN';

export type IUserFilter = {
  searchTerm?: string;
  role?: IUserRole;
};