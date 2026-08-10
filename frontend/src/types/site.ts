export interface Site {
  id: number;
  siteName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  customerName?: string;
  customerId?: number;
  status?: string;
  createdAt?: string;
}

export interface SiteFormValues {
  siteName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  customerId: string;
}

export interface CustomerOption {
  id: number;
  customerName: string;
}

export interface SitePageResponse {
  content: Site[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}