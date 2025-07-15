import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import EncryptedStorage from "react-native-encrypted-storage";
import * as Keychain from "react-native-keychain";
import { isTokenExpired } from "../utils/auth";
import { jwtDecode } from "jwt-decode";
import { Client as StompClient } from "@stomp/stompjs";
import { useRef } from "react";
import SockJS from "sockjs-client";

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

  /*chat-notification 호출*/
  const clientRef = useRef(null); // WebSocket 연결 상태 추적

  useEffect(() => {
    if (!accessToken) return;

    console.log("✅ 최신 accessToken으로 WebSocket 연결 시도:", accessToken);

    // 기존 연결이 있다면 먼저 끊기
    if (clientRef.current) {
      console.log("♻️ 기존 WebSocket 연결 종료");
      clientRef.current.deactivate();
    }

    const client = new StompClient({
      webSocketFactory: () => new SockJS(`http://10.0.2.2:8080/ws?token=${accessToken}`),
      connectHeaders: {
        access: accessToken,
      },
      onConnect: () => {
        console.log("✅ 알림 WebSocket 연결됨");
        client.subscribe("/user/queue/chat-notifications", (message) => {
          try {
            const payload = JSON.parse(message.body);
            console.log("📨 채팅 알림 도착:", payload);
          } catch (e) {
            console.log("새 메시지 도착", message.body);
          }
        });
      },
      onStompError: (frame) => {
        console.error("❌ STOMP 오류:", frame);
      },

      onWebSocketClose: () => {
        console.warn("🔌 WebSocket 연결 종료됨");
      },
      onWebSocketError: (error) => {
        console.error("WebSocket 에러 발생:", error);
      },
      debug: console.log,
    });

    clientRef.current = client;
    client.activate();

    return () => {
      console.log("🧹 [cleanup] WebSocket 연결 해제");
      client.deactivate();
      clientRef.current = null;
    };
  }, [accessToken]);

  const signout = async () => {
    await clearTokens(); // 토큰 삭제 안됐을때 살려서 실행
    try {
      // 1. 저장된 accessToken과 refreshToken 불러오기
      const storedAccessToken = await EncryptedStorage.getItem("accessToken");
      const credentials = await Keychain.getGenericPassword();
      const refreshToken = credentials ? credentials.password : null;

      console.log("🔐 accessToken:", storedAccessToken);
      console.log("🔐 refreshToken:", refreshToken);

      // 2. access와 refresh가 모두 있을 경우에만 로그아웃 요청
      if (storedAccessToken && refreshToken) {
        await axios.post(
          "http://10.0.2.2:8080/auth/logout",
          { refresh_token: refreshToken },
          {
            headers: {
              Authorization: `Bearer ${storedAccessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("✅ 백엔드 로그아웃 요청 완료");
      } else {
        console.warn("⚠️ 토큰 정보가 부족해 백엔드에 로그아웃 요청하지 않음");
      }

      // 3. 로컬 토큰 삭제 및 상태 초기화
      await EncryptedStorage.removeItem("accessToken");
      await Keychain.resetGenericPassword();
      setAccessToken(null);
      setUser(null);
      console.log("🧹 로컬 토큰 삭제 및 상태 초기화 완료");
    } catch (error) {
      console.error("❌ 로그아웃 실패:", error);
      throw error; // 호출하는 쪽에서 예외 처리할 수 있도록 throw 유지
    }
  };

  return <AuthContext.Provider value={{ user, setUser, accessToken, setAccessToken, signout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
