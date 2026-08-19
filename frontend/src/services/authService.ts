import api from "./api";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  message?: string;
  token?: string;
  email?: string;
  fullName?: string;
  role?: string;
}

export const login = async (data: LoginRequest): Promise<AuthResponse | string> => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  role: string;
}

export const register = async (data: RegisterRequest) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const resetPassword = async (
  email: string,
  newPassword: string
) => {
  const response = await api.post("/auth/reset-password", null, {
    params: {
      email,
      newPassword,
    },
  });

  return response.data;
};

 export default {
  login,
  register,
  resetPassword,
};