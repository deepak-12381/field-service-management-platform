import api from './api';

export interface TimeLog {
  id: number;
  workOrderId: number;
  technicianId: number;
  technicianName?: string;
  startTime: string;
  endTime?: string;
  hoursLogged?: number;
  notes?: string;
  createdAt?: string;
}

export interface TimeLogFormValues {
  technicianId: string;
  startTime: string;
  endTime: string;
  notes: string;
}

export const getTimeLogsByWorkOrder = async (workOrderId: number): Promise<TimeLog[]> => {
  const response = await api.get<TimeLog[]>(`/workorders/${workOrderId}/timelogs`);
  return response.data;
};

export const getTimeLogsByTechnician = async (technicianId: number): Promise<TimeLog[]> => {
  const response = await api.get<TimeLog[]>(`/technicians/${technicianId}/timelogs`);
  return response.data;
};

export const createTimeLog = async (workOrderId: number, data: TimeLogFormValues): Promise<TimeLog> => {
  const response = await api.post<TimeLog>(`/workorders/${workOrderId}/timelogs`, {
    technicianId: Number(data.technicianId),
    startTime: data.startTime,
    endTime: data.endTime || undefined,
    notes: data.notes.trim() || undefined,
  });
  return response.data;
};

export const updateTimeLog = async (timeLogId: number, data: TimeLogFormValues): Promise<TimeLog> => {
  const response = await api.put<TimeLog>(`/timelogs/${timeLogId}`, {
    technicianId: Number(data.technicianId),
    startTime: data.startTime,
    endTime: data.endTime || undefined,
    notes: data.notes.trim() || undefined,
  });
  return response.data;
};

export const deleteTimeLog = async (timeLogId: number): Promise<void> => {
  await api.delete(`/timelogs/${timeLogId}`);
};
