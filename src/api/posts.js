import api from "./api";

export const listPostsAPI = (params) => api.get("/posts/list", { params });
export const searchPostsAPI = (params) => api.get("/posts/search", { params });
export const getPostAPI = (postId) => api.get(`/posts/${postId}`);
export const createPostAPI = (data) => api.post("/posts/create", data);
export const updatePostAPI = (postId, data) => api.patch(`/posts/${postId}`, data);
export const deletePostAPI = (postId) => api.delete(`/posts/${postId}`);
export const likePostAPI = (postId) => api.post(`/posts/${postId}/likes`, {});
export const unlikePostAPI = (postId) => api.delete(`/posts/${postId}/likes`);