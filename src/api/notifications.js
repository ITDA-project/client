import api from "./api";

export const getNotificationsAPI = () => api.get("/notifications");
export const markAllNotificationsReadAPI = () => api.patch("/notifications/read-all", null);