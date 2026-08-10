import api from "./api";
import type {
  Customer,
  CustomerFormValues,
  CustomerPageResponse,
} from "../types/customer";

 export const getCustomers = async (
  page = 0,
  size = 10,
  search = "",
  city = "",
  state = ""
): Promise<CustomerPageResponse> => {
  const response = await api.get("/customers", {
    params: {
      page,
      size,
      sortBy: "customerName",
      direction: "asc",
      search: search || undefined,
      city: city || undefined,
      state: state || undefined,
    },
  });

  return response.data;
};
export const getCustomerById = async (
  id: number
): Promise<Customer> => {
  const response = await api.get<Customer>(`/customers/${id}`);

  return response.data;
};

export const createCustomer = async (
  data: CustomerFormValues
): Promise<Customer> => {
  const payload = {
    customerName: data.customerName.trim(),
    email: data.email.trim(),
    phone: data.phone.trim(),
    address: data.address.trim(),
    city: data.city.trim(),
    state: data.state.trim(),
    pincode: data.pincode.trim(),
  };

  const response = await api.post<Customer>("/customers", payload);

  return response.data;
};

export const updateCustomer = async (
  id: number,
  data: CustomerFormValues
): Promise<Customer> => {
  const payload = {
    customerName: data.customerName.trim(),
    email: data.email.trim(),
    phone: data.phone.trim(),
    address: data.address.trim(),
    city: data.city.trim(),
    state: data.state.trim(),
    pincode: data.pincode.trim(),
  };

  const response = await api.put<Customer>(
    `/customers/${id}`,
    payload
  );

  return response.data;
};

export const deleteCustomer = async (
  id: number
): Promise<string> => {
  const response = await api.delete<string>(`/customers/${id}`);

  return response.data;
};