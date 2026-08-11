import api from "./api";

export interface DashboardData {
  totalCustomers: number;
  totalSites: number;
  totalWorkOrders: number;
  totalTechnicians: number;

  openWorkOrders: number;
  inProgressWorkOrders: number;
  completedWorkOrders: number;

  highPriorityWorkOrders: number;
}

export const getDashboardData = async (): Promise<DashboardData> => {
  const response = await api.get("/dashboard");
  return response.data;
};