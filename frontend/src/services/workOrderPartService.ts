import api from './api';

export interface WorkOrderPart {
  id: number;
  workOrderId: number;
  partName: string;
  partNumber?: string;
  quantity: number;
  unitCost?: number;
  notes?: string;
  createdAt?: string;
  createdBy?: string;
}

export interface WorkOrderPartFormValues {
  partName: string;
  partNumber: string;
  quantity: number;
  unitCost: string;
  notes: string;
}

export const getPartsByWorkOrder = async (workOrderId: number): Promise<WorkOrderPart[]> => {
  const response = await api.get<WorkOrderPart[]>(`/workorders/${workOrderId}/parts`);
  return response.data;
};

export const createPart = async (workOrderId: number, data: WorkOrderPartFormValues): Promise<WorkOrderPart> => {
  const response = await api.post<WorkOrderPart>(`/workorders/${workOrderId}/parts`, {
    partName: data.partName.trim(),
    partNumber: data.partNumber.trim() || undefined,
    quantity: data.quantity,
    unitCost: data.unitCost ? Number(data.unitCost) : undefined,
    notes: data.notes.trim() || undefined,
  });
  return response.data;
};

export const updatePart = async (workOrderId: number, partId: number, data: WorkOrderPartFormValues): Promise<WorkOrderPart> => {
  const response = await api.put<WorkOrderPart>(`/workorders/${workOrderId}/parts/${partId}`, {
    partName: data.partName.trim(),
    partNumber: data.partNumber.trim() || undefined,
    quantity: data.quantity,
    unitCost: data.unitCost ? Number(data.unitCost) : undefined,
    notes: data.notes.trim() || undefined,
  });
  return response.data;
};

export const deletePart = async (workOrderId: number, partId: number): Promise<void> => {
  await api.delete(`/workorders/${workOrderId}/parts/${partId}`);
};
