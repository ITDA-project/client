import api from "./api";

export const getNotificationsAPI = (config = {}) => api.get("/notifications", config);
export const markAllNotificationsReadAPI = (config = {}) => api.patch("/notifications/read-all", null, config);