import api from "./api";
import type { CustomerOption, Site, SiteFormValues, SitePageResponse } from "../types/site";

export const getSites = async (page = 0, size = 100): Promise<SitePageResponse> => {
  const response = await api.get<SitePageResponse>("/sites", {
    params: {
      page,
      size,
      sortBy: "siteName",
      direction: "asc",
    },
  });

  return response.data;
};

export const getSiteById = async (id: number): Promise<Site> => {
  const response = await api.get<Site>(`/sites/${id}`);
  return response.data;
};

export const createSite = async (data: SiteFormValues): Promise<Site> => {
  const payload = {
    siteName: data.siteName.trim(),
    address: data.address.trim(),
    city: data.city.trim(),
    state: data.state.trim(),
    pincode: data.pincode.trim(),
    customerId: Number(data.customerId),
  };

  const response = await api.post<Site>("/sites", payload);
  return response.data;
};

export const updateSite = async (id: number, data: SiteFormValues): Promise<Site> => {
  const payload = {
    siteName: data.siteName.trim(),
    address: data.address.trim(),
    city: data.city.trim(),
    state: data.state.trim(),
    pincode: data.pincode.trim(),
    customerId: Number(data.customerId),
  };

  const response = await api.put<Site>(`/sites/${id}`, payload);
  return response.data;
};

export const deleteSite = async (id: number): Promise<string> => {
  const response = await api.delete<string>(`/sites/${id}`);
  return response.data;
};

export const getCustomersForSite = async (): Promise<CustomerOption[]> => {
  const response = await api.get<{ content: Array<{ id: number; customerName: string }> }>('/customers', {
    params: {
      page: 0,
      size: 100,
      sortBy: 'customerName',
      direction: 'asc',
    },
  });

  return response.data.content.map((customer) => ({
    id: customer.id,
    customerName: customer.customerName,
  }));
};