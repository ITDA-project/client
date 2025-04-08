import axios from "axios";
import EncryptedStorage from "react-native-encrypted-storage";
import * as Keychain from "react-native-keychain";

const api = axios.create({
  baseURL: "https://10.0.2.2:8080",
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

    // 401 Unauthorized → 토큰 재발급 시도
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const credentials = await Keychain.getGenericPassword();
        if (!credentials) throw new Error("No refresh token");

        const refreshToken = credentials.password;

        const res = await axios.post("https://10.0.2.2:8080/reissue", {
          refresh_token: refreshToken,
        });

        const newAccessToken = res.headers["access"];
        const newRefreshToken = res.data.refresh_token;

        // 저장소 업데이트
        await EncryptedStorage.setItem("accessToken", newAccessToken);
        await Keychain.setGenericPassword("refreshToken", newRefreshToken);

        // 헤더에 새 access token 넣어서 재요청
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("토큰 재발급 실패:", refreshError);
        // refresh도 실패하면 로그아웃 로직 연결 가능
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
