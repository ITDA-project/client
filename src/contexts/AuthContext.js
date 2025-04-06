import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // 로그인하면 user 정보가 저장됨
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const restoreSession = async () => {
      const refreshToken = await AsyncStorage.getItem("refreshToken");

      if (!refreshToken) {
        console.log("리프레시 토큰 없음, 로그아웃 상태 유지");
        return;
      }

      try {
        // ✅ 토큰 갱신 API 호출
        const response = await axios.post("http://10.0.2.2:8080/auth/token", { refresh_token: refreshToken });
        const newAccessToken = response.data.access_token;

        setAccessToken(newAccessToken);
        console.log("새로운 액세스 토큰 발급:", newAccessToken);

        // ✅ 유저 정보 가져오기 (백엔드에서 유저 정보 조회 API 필요)
        const userResponse = await axios.get("http://10.0.2.2:8080/auth/me", {
          headers: { Authorization: `Bearer ${newAccessToken}` },
        });

        setUser(userResponse.data);
        console.log("로그인된 유저 정보:", userResponse.data);
      } catch (error) {
        console.error("리프레시 토큰 만료됨, 자동 로그아웃 처리", error);
        await AsyncStorage.removeItem("refreshToken");
        setUser(null);
        setAccessToken(null);
      }
    };

    restoreSession();
  }, []); // ✅ 의존성 배열 추가하여 **최초 1회 실행**

  return <AuthContext.Provider value={{ user, setUser, accessToken, setAccessToken }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
