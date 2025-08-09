import api from "./api";

export const listChatroomsAPI = (config = {}) => api.get("/chatroom", config);
export const getChatroomAPI = (roomId, config = {}) => api.get(`/chatroom/${roomId}`, config);
export const getChatroomParticipantsAPI = (roomId, config = {}) => api.get(`/chatroom/${roomId}/participants`, config);
export const markChatroomReadAPI = (roomId, config = {}) => api.post(`/chatroom/${roomId}/read`, {}, config);
export const deleteChatroomAPI = (roomId, config = {}) => api.delete(`/chatroom/${roomId}`, config);
export const inviteToChatroomAPI = (payload, config = {}) => api.post("/chatroom/invite", payload, config);