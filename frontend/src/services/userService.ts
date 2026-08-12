import api from './api';

export interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  role: string;
}

export const getProfile = async (): Promise<UserProfile> => {
  const response = await api.get<UserProfile>('/users/profile');
  return response.data;
};

export const getUsersByRole = async (role: string) => {
  const response = await api.get(`/users/role/${role}`);
  return response.data;
};

export const getAllUsers = async (page = 0, size = 100) => {
  const response = await api.get('/users', { params: { page, size, sortBy: 'fullName', direction: 'asc' } });
  return response.data;
};
