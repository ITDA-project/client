import axios from "axios";
import EncryptedStorage from "react-native-encrypted-storage";
import * as Keychain from "react-native-keychain";
import { Platform } from "react-native";

const API_BASE_URL = Platform.OS === "android" ? "http://10.0.2.2:8080" : "http://127.0.0.1:8080";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 요청 시 access token 자동 첨부
api.interceptors.request.use(async (config) => {
  const accessToken = await EncryptedStorage.getItem("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// 🔁 응답에서 401이 오면 → refresh로 재발급
api.interceptors.response.use(
  (res) => res, // 성공 응답은 그대로
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const credentials = await Keychain.getGenericPassword();
        if (!credentials) throw new Error("No refresh token");

        const refreshToken = credentials.password;

        const res = await axios.post(`${API_BASE_URL}/reissue`, {
          refresh_token: refreshToken,
        });

        const newAccessToken = res.headers["access"];
        const newRefreshToken = res.data.refresh_token;

        await EncryptedStorage.setItem("accessToken", newAccessToken);
        await Keychain.setGenericPassword("refreshToken", newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("토큰 재발급 실패:", refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
