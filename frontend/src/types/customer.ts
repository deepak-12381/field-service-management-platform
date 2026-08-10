export interface Customer {
  id: number;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface CustomerFormValues {
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface CustomerPageResponse {
  content: Customer[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}