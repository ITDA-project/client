import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import EncryptedStorage from "react-native-encrypted-storage";
import * as Keychain from "react-native-keychain";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // 로그인하면 user 정보가 저장됨
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        // ✅ access token 불러오기
        const storedAccessToken = await EncryptedStorage.getItem("accessToken");
        if (storedAccessToken) {
          setAccessToken(storedAccessToken);
          console.log("EncryptedStorage에서 access token 불러옴:", storedAccessToken);
        }

        // ✅ refresh token 불러오기 (Keychain 사용)
        const credentials = await Keychain.getGenericPassword();
        const refreshToken = credentials ? credentials.password : null;

        if (!refreshToken) {
          console.log("리프레시 토큰 없음, 로그아웃 상태 유지");
          return;
        }

        // ✅ 토큰 재발급
        const response = await axios.post("http://10.0.2.2:8080/auth/token", {
          refresh_token: refreshToken,
        });

        const newAccessToken = response.data.access;
        await EncryptedStorage.setItem("accessToken", newAccessToken);
        setAccessToken(newAccessToken);
        console.log("리프레시 토큰으로 새 access 발급:", newAccessToken);
      } catch (error) {
        console.error("토큰 복원 실패 또는 자동 로그인 실패:", error);
        await EncryptedStorage.removeItem("accessToken");
        await Keychain.resetGenericPassword();
        setAccessToken(null);
        setUser(null);
      }
    };

    restoreSession();
  }, []);

  // const signout = async () => {
  //   await
  // }

  return <AuthContext.Provider value={{ user, setUser, accessToken, setAccessToken }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
