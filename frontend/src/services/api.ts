import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "https://field-service-management-backend.onrender.com/api",
    timeout: 45000,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            console.warn(`API error (${error.response.status}):`, error.response.data || error.message);
        }
        return Promise.reject(error);
    }
);

export default api;