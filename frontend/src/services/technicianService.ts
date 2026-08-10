import api from './api';
import type { Technician, TechnicianFormValues, TechnicianPageResponse } from '../types/technician';

export const getTechnicians = async (page = 0, size = 100): Promise<TechnicianPageResponse> => {
  const response = await api.get<TechnicianPageResponse>('/technicians', {
    params: {
      page,
      size,
      sortBy: 'fullName',
      direction: 'asc',
    },
  });

  return response.data;
};

export const getTechnicianById = async (id: number): Promise<Technician> => {
  const response = await api.get<Technician>(`/technicians/${id}`);
  return response.data;
};

export const createTechnician = async (data: TechnicianFormValues): Promise<Technician> => {
  const payload = {
    fullName: data.fullName.trim(),
    email: data.email.trim(),
    phone: data.phone.trim(),
    skills: data.skills.trim(),
    status: data.status,
  };

  const response = await api.post<Technician>('/technicians', payload);
  return response.data;
};

export const updateTechnician = async (id: number, data: TechnicianFormValues): Promise<Technician> => {
  const payload = {
    fullName: data.fullName.trim(),
    email: data.email.trim(),
    phone: data.phone.trim(),
    skills: data.skills.trim(),
    status: data.status,
  };

  const response = await api.put<Technician>(`/technicians/${id}`, payload);
  return response.data;
};

export const deleteTechnician = async (id: number): Promise<void> => {
  await api.delete(`/technicians/${id}`);
};
