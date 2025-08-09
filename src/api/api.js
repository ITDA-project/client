import axios from "axios";
import EncryptedStorage from "react-native-encrypted-storage";
import * as Keychain from "react-native-keychain";
import API_BASE_URL from "../config/apiConfig";

const api = axios.create({
  baseURL: API_BASE_URL, // 가져온 변수를 사용합니다.
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 요청 시 access token 자동 첨부
api.interceptors.request.use(async (config) => {
  const accessToken = await EncryptedStorage.getItem("accessToken");
  if (accessToken) {
    // ✅ 헤더 이름을 'access'로 변경
    config.headers.access = accessToken;
  }
  return config;
});

// 🔁 응답에서 401이 오면 → refresh로 재발급
api.interceptors.response.use(
  (res) => res,
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

        originalRequest.headers.access = newAccessToken;
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
