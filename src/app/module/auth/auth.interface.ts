export type Role = 'CALLER' | 'DRIVER' | 'ADMIN';

export type ILoginUserResponse = {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: Role;
    phone: string;
  };
};