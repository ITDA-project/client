import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/api";
import EncryptedStorage from "react-native-encrypted-storage";
import * as Keychain from "react-native-keychain";
import { isTokenExpired } from "../utils/auth";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // 로그인하면 user 정보가 저장됨
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stompClient, setStompClient] = useState(null);

  const clearTokens = async () => {
    await EncryptedStorage.removeItem("accessToken");
    await Keychain.resetGenericPassword();
  };

  useEffect(() => {
    const restoreSession = async () => {
      console.log("🔄 앱 시작 - 세션 복원 시도 중...");

      try {
        const storedAccessToken = await EncryptedStorage.getItem("accessToken");
        console.log("🧾 저장된 access token:", storedAccessToken);

        const credentials = await Keychain.getGenericPassword();
        const refreshToken = credentials ? credentials.password : null;
        console.log("🧾 저장된 refresh token:", refreshToken);

        if (!refreshToken) {
          console.log("리프레시 토큰 없음, 로그인 필요");
          setLoading(false);
          return;
        }

        // accessToken이 존재하고 유효하면 그대로 사용
        if (storedAccessToken && !isTokenExpired(storedAccessToken)) {
          setAccessToken(storedAccessToken);
          setUser({ username: jwtDecode(storedAccessToken).username });
          console.log("access token 복원 성공:", storedAccessToken);
        } else {
          const response = await axios.post("http://10.0.2.2:8080/reissue", {
            refresh_token: refreshToken,
          });

          const newAccessToken = response.headers["access"];
          await EncryptedStorage.setItem("accessToken", newAccessToken);
          setAccessToken(newAccessToken);
          setUser({ username: jwtDecode(newAccessToken).username });
          console.log("리프레시 토큰으로 새 access 발급:", newAccessToken);
        }
      } catch (error) {
        console.error("토큰 복원 실패 또는 자동 로그인 실패:", error);

        // 토큰 모두 초기화 (로그아웃 처리)
        await EncryptedStorage.removeItem("accessToken");
        await Keychain.resetGenericPassword();
        setAccessToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const signout = async () => {
    //await clearTokens(); // 토큰 삭제 안됐을때 살려서 실행

    try {
      // 1. 웹소켓 연결 해제
      if (stompClient && stompClient.connected) {
        await new Promise((resolve) => {
          stompClient.disconnect(() => {
            console.log("✅ 1단계: 웹소켓 연결 해제 완료");
            resolve();
          });
        });
      }

      // 2. 저장된 토큰 불러오기
      const storedAccessToken = await EncryptedStorage.getItem("accessToken");
      const credentials = await Keychain.getGenericPassword();
      const refreshToken = credentials ? credentials.password : null;

      // 3. 백엔드 로그아웃 요청 (api 인스턴스 사용)
      if (storedAccessToken && refreshToken) {
        // ❌ 기존: axios.post("http://...")
        // ✅ 변경: 중앙 api 인스턴스를 사용합니다. baseURL과 헤더가 자동으로 관리됩니다.
        await api.post("/auth/logout", {
          refresh_token: refreshToken,
        });
        console.log("✅ 2단계: 백엔드 로그아웃 요청 완료");
      }

      // 4. 로컬 토큰 삭제
      await EncryptedStorage.removeItem("accessToken");
      await Keychain.resetGenericPassword();
      console.log("✅ 3단계: 로컬 토큰 삭제 완료");

      // 5. 앱 상태 변경
      setAccessToken(null);
      setUser(null);
      console.log("✅ 4단계: 로그아웃 절차 최종 완료");
    } catch (error) {
      console.error("❌ 로그아웃 처리 중 에러 발생:", error);
      // 실패 시에도 안전하게 로컬 데이터 정리
      await EncryptedStorage.removeItem("accessToken");
      await Keychain.resetGenericPassword();
      setAccessToken(null);
      setUser(null);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, accessToken, setAccessToken, signout, loading, stompClient, setStompClient }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
