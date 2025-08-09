import api from "./api";

export const getMyUserIdAPI = () => api.get("/mypage/me");
export const getMyPageFullAPI = () => api.get("/mypage/full");
export const editMyPageAPI = (formData) => api.patch("/mypage/edit", formData, { headers: { "Content-Type": "multipart/form-data" } });

export const getProfileAPI = (userId) => api.get(`/profile/${userId}`);

export const getUserReviewsAPI = (userId) => api.get(`/review/${userId}`);
export const createReviewAPI = (payload) => api.post("/review", payload);

export const deleteAccountAPI = (payload) => api.delete("/auth/delete", { data: payload });