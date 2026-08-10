export interface WorkOrder {
  id: number;
  title: string;
  description: string;
  priority: string;
  status: string;
  createdAt?: string;
  createdBy?: string;
  siteId?: number;
  siteName?: string;
  technicianId?: number;
  technicianName?: string;
}

export interface WorkOrderFormValues {
  title: string;
  description: string;
  priority: string;
  status: string;
  siteId: string;
  technicianId: string;
}

export interface WorkOrderPageResponse {
  content: WorkOrder[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface TechnicianOption {
  id: number;
  fullName: string;
}
