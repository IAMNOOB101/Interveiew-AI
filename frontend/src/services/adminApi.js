import api from "./api";

export const getAllUsers = () => api.get("/admin/users");
export const getAllAttempts = () => api.get("/admin/attempts");
export const getAnalytics = () => api.get("/admin/analytics");
