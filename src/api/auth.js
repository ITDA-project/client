import api from "./api";

// email login
export const loginWithEmailAPI = (payload) => api.post("/auth/login", payload);

// email signup
export const signupWithEmailAPI = (payload) => api.post("/auth/signup/email", payload);
export const checkEmailDuplicateAPI = (payload) => api.post("/auth/signup/email/checkemail", payload);

// social signup
export const signupWithKakaoAPI = (payload) => api.post("/auth/signup/kakao", payload);
export const signupWithNaverAPI = (payload) => api.post("/auth/signup/naver", payload);

// password reset
export const requestFindPasswordAPI = (payload) => api.post("/auth/password/find", payload);
export const verifyOtpAPI = (payload) => api.post("/auth/password/otp", payload);
export const changePasswordAPI = (payload) => api.patch("/auth/password/find", payload);