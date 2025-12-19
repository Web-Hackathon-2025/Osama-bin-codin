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
  register: (data: any) => api.post("/auth/register", data),
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

// Worker API
export const workerAPI = {
  getProfile: () => api.get("/workers/profile/me"),
  updateProfile: (data: any) => api.put("/workers/profile/me", data),
  getWorkers: (params?: any) => api.get("/workers", { params }),
  getWorkerById: (id: string) => api.get(`/workers/${id}`),
  getStats: () => api.get("/workers/stats/me"),
  createStripeAccount: () => api.post("/workers/stripe/create-account"),
  getStripeOnboardingLink: () => api.get("/workers/stripe/onboarding-link"),
  getStripeStatus: () => api.get("/workers/stripe/status"),
  getStripeDashboard: () => api.get("/workers/stripe/dashboard"),
};

// Booking API
export const bookingAPI = {
  createBooking: (data: any) => api.post("/bookings", data),
  getMyBookings: (params?: any) => api.get("/bookings/my-bookings", { params }),
  getBookingById: (id: string) => api.get(`/bookings/${id}`),
  confirmPayment: (id: string) => api.post(`/bookings/${id}/confirm-payment`),
  respondToBooking: (id: string, data: { action: "accept" | "reject" }) =>
    api.put(`/bookings/${id}/respond`, data),
  updateBookingStatus: (id: string, data: { status: string }) =>
    api.put(`/bookings/${id}/status`, data),
  cancelBooking: (id: string, data?: { cancellationReason: string }) =>
    api.put(`/bookings/${id}/cancel`, data),
  reviewBooking: (id: string, data: { rating: number; comment: string }) =>
    api.post(`/bookings/${id}/review`, data),
  reportDispute: (id: string, data: { reason: string }) =>
    api.put(`/bookings/${id}/dispute`, data),
  getBookingStats: () => api.get("/bookings/stats/overview"),
  getStripeConfig: () => api.get("/bookings/stripe/config"),
};

// Notification API
export const notificationAPI = {
  getNotifications: (params?: any) => api.get("/notifications", { params }),
  markAsRead: (id: string) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put("/notifications/read-all"),
  deleteNotification: (id: string) => api.delete(`/notifications/${id}`),
  getUnreadCount: () => api.get("/notifications/unread/count"),
};

// Admin API
export const adminAPI = {
  getUsers: (params?: any) => api.get("/admin/users", { params }),
  updateUser: (id: string, data: any) => api.put(`/admin/users/${id}`, data),
  updateUserStatus: (id: string, data: { isActive: boolean }) =>
    api.put(`/admin/users/${id}/status`, data),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
  getPendingWorkers: () => api.get("/admin/workers/pending"),
  updateWorkerApproval: (id: string, data: { isApproved: boolean }) =>
    api.put(`/admin/workers/${id}/approval`, data),
  getStats: () => api.get("/admin/stats"),
  getBookings: (params?: any) => api.get("/admin/bookings", { params }),
  getBookingStats: () => api.get("/admin/bookings/stats"),
  getDisputedBookings: () => api.get("/admin/bookings/disputed"),
  resolveDispute: (
    id: string,
    data: { resolution: string; newStatus: string }
  ) => api.put(`/admin/bookings/${id}/resolve-dispute`, data),
  createJobCategory: (data: any) => api.post("/admin/job-categories", data),
  getJobCategories: () => api.get("/admin/job-categories"),
  updateJobCategory: (id: string, data: any) =>
    api.put(`/admin/job-categories/${id}`, data),
  deleteJobCategory: (id: string) => api.delete(`/admin/job-categories/${id}`),
};

// Chat API
export const chatAPI = {
  sendMessage: (bookingId: string, data: { message: string }) =>
    api.post(`/chat/${bookingId}/messages`, data),
  getMessages: (bookingId: string) => api.get(`/chat/${bookingId}/messages`),
  getConversations: () => api.get("/chat/conversations"),
  getUnreadCount: () => api.get("/chat/unread-count"),
};

export default api;
