import api from "./api";

export const listPostsAPI = (params) => api.get("/posts/list", { params });
export const searchPostsAPI = (params) => api.get("/posts/search", { params });
export const getPostAPI = (postId, config = {}) => api.get(`/posts/${postId}`, config);
export const createPostAPI = (data, config = {}) => api.post("/posts/create", data, config);
export const updatePostAPI = (postId, data, config = {}) => api.patch(`/posts/${postId}`, data, config);
export const deletePostAPI = (postId, config = {}) => api.delete(`/posts/${postId}`, config);
export const likePostAPI = (postId, config = {}) => api.post(`/posts/${postId}/likes`, {}, config);
export const unlikePostAPI = (postId, config = {}) => api.delete(`/posts/${postId}/likes`, config);