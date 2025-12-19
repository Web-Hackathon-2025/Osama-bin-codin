import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post("/auth/register", data),

  verifyOTP: (data: { email: string; otp: string }) =>
    api.post("/auth/verify-otp", data),

  resendOTP: (data: { email: string }) => api.post("/auth/resend-otp", data),

  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),

  forgotPassword: (data: { email: string }) =>
    api.post("/auth/forgot-password", data),

  resetPassword: (data: { email: string; otp: string; newPassword: string }) =>
    api.post("/auth/reset-password", data),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.post("/auth/change-password", data),

  getMe: () => api.get("/auth/me"),
};

// Profile API
export const profileAPI = {
  getProfile: () => api.get("/profile"),

  updateProfile: (data: {
    name?: string;
    phone?: string;
    bio?: string;
    avatar?: string;
  }) => api.put("/profile", data),

  deleteAccount: (data: { password: string }) =>
    api.delete("/profile", { data }),

  getStats: () => api.get("/profile/stats"),
};

export default api;
