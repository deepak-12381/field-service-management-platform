import api from './api';

export interface StatusHistoryEntry {
  id: number;
  workOrderId: number;
  oldStatus?: string;
  newStatus: string;
  changedBy?: string;
  changedAt?: string;
}

export const getWorkOrderHistory = async (workOrderId: number): Promise<StatusHistoryEntry[]> => {
  const response = await api.get<StatusHistoryEntry[]>(`/workorders/${workOrderId}/history`);
  return response.data;
};

export const updateWorkOrderStatus = async (workOrderId: number, status: string) => {
  const response = await api.put(`/workorders/${workOrderId}/status`, { status });
  return response.data;
};
