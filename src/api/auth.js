import api from "./api";

// email login
export const loginWithEmailAPI = (payload, config = {}) => api.post("/auth/login", payload, config);

// email signup
export const signupWithEmailAPI = (payload, config = {}) => api.post("/auth/signup/email", payload, config);
export const checkEmailDuplicateAPI = (payload, config = {}) => api.post("/auth/signup/email/checkemail", payload, config);

// social signup
export const signupWithKakaoAPI = (payload, config = {}) => api.post("/auth/signup/kakao", payload, config);
export const signupWithNaverAPI = (payload, config = {}) => api.post("/auth/signup/naver", payload, config);

// password reset
export const requestFindPasswordAPI = (payload, config = {}) => api.post("/auth/password/find", payload, config);
export const verifyOtpAPI = (payload, config = {}) => api.post("/auth/password/otp", payload, config);
export const changePasswordAPI = (payload, config = {}) => api.patch("/auth/password/find", payload, config);