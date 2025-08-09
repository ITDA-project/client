import api from "./api";

export const listChatroomsAPI = () => api.get("/chatroom");
export const getChatroomAPI = (roomId) => api.get(`/chatroom/${roomId}`);
export const getChatroomParticipantsAPI = (roomId) => api.get(`/chatroom/${roomId}/participants`);
export const markChatroomReadAPI = (roomId) => api.post(`/chatroom/${roomId}/read`, {});
export const deleteChatroomAPI = (roomId) => api.delete(`/chatroom/${roomId}`);
export const inviteToChatroomAPI = (payload) => api.post("/chatroom/invite", payload);