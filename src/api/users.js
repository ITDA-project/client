import api from "./api";

export const getMyUserIdAPI = (config = {}) => api.get("/mypage/me", config);
export const getMyPageFullAPI = (config = {}) => api.get("/mypage/full", config);
export const editMyPageAPI = (formData, config = {}) =>
  api.patch("/mypage/edit", formData, { headers: { "Content-Type": "multipart/form-data" }, ...config });

export const getProfileAPI = (userId, config = {}) => api.get(`/profile/${userId}`, config);

export const getUserReviewsAPI = (userId, config = {}) => api.get(`/review/${userId}`, config);
export const createReviewAPI = (payload, config = {}) => api.post("/review", payload, config);

export const deleteAccountAPI = (payload, config = {}) => api.delete("/auth/delete", { data: payload, ...config });