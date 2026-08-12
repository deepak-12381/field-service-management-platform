import api from './api';
import type { TechnicianOption, WorkOrder, WorkOrderFormValues, WorkOrderPageResponse } from '../types/workOrder';

const statusToApiValue: Record<string, string> = {
  Open: 'NEW',
  'In Progress': 'IN_PROGRESS',
  Pending: 'NEW',
  Completed: 'COMPLETED',
  Closed: 'CLOSED',
};

export const getWorkOrders = async (page = 0, size = 100): Promise<WorkOrderPageResponse> => {
  const response = await api.get<WorkOrderPageResponse>('/workorders', {
    params: {
      page,
      size,
      sortBy: 'createdAt',
      direction: 'desc',
    },
  });

  return response.data;
};

export const getWorkOrderById = async (id: number): Promise<WorkOrder> => {
  const response = await api.get<WorkOrder>(`/workorders/${id}`);
  return response.data;
};

export const createWorkOrder = async (data: WorkOrderFormValues): Promise<WorkOrder> => {
  const response = await api.post<WorkOrder>('/workorders', {
    title: data.title.trim(),
    description: data.description.trim(),
    priority: data.priority,
    status: statusToApiValue[data.status] ?? data.status,
    createdBy: 'admin',
    siteId: Number(data.siteId),
  });

  return response.data;
};

export const updateWorkOrder = async (id: number, data: WorkOrderFormValues): Promise<WorkOrder> => {
  const response = await api.put<WorkOrder>(`/workorders/${id}`, {
    title: data.title.trim(),
    description: data.description.trim(),
    priority: data.priority,
     status: statusToApiValue[data.status] ?? data.status,
    createdBy: 'admin',
    siteId: Number(data.siteId),
  });

  return response.data;
};

export const deleteWorkOrder = async (id: number): Promise<void> => {
  await api.delete(`/workorders/${id}`);
};

export const assignTechnician = async (workOrderId: number, technicianId: number): Promise<WorkOrder> => {
  const response = await api.put<WorkOrder>(`/workorders/${workOrderId}/assign`, {
    technicianId,
  });

  return response.data;
};

export const getTechnicians = async (): Promise<TechnicianOption[]> => {
  const response = await api.get<{ content: Array<{ id: number; fullName: string }> }>('/technicians', {
    params: {
      page: 0,
      size: 100,
      sortBy: 'fullName',
      direction: 'asc',
    },
  });

  return response.data.content.map((technician) => ({
    id: technician.id,
    fullName: technician.fullName,
  }));
};
