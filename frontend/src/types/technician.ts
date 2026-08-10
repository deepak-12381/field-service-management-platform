export interface Technician {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  skills: string;
  status: string;
  assignedWorkOrders: number;
}

export interface TechnicianFormValues {
  fullName: string;
  email: string;
  phone: string;
  skills: string;
  status: string;
}

export interface TechnicianPageResponse {
  content: Technician[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
