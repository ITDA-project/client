import { useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNotificationOverlay } from "./NotificationOverlay";
import SockJS from "sockjs-client";
import { Client as StompClient } from "@stomp/stompjs";
import { navigationRef } from "../navigations/navigationRef";

export default function WebSocketManager() {
  const { accessToken, loading } = useAuth();
  const { showNotification } = useNotificationOverlay();
  const clientRef = useRef(null);

  useEffect(() => {
    console.log("[WS] loading:", loading, "accessToken:", accessToken);
    if (loading || !accessToken) return;

    if (clientRef.current) {
      clientRef.current.deactivate();
    }

    const client = new StompClient({
      webSocketFactory: () => new SockJS(`http://10.0.2.2:8080/ws?token=${accessToken}`),
      connectHeaders: {
        access: accessToken,
      },
      onConnect: () => {
        console.log("✅알림 Websocket 연결됨");
        client.subscribe("/user/queue/chat-notifications", (message) => {
          const payload = JSON.parse(message.body);
          const formatted = `${payload.username} : ${payload.message}`;
          showNotification(
            {
              roomName: payload.roomName,
              senderName: payload.username,
              message: payload.message,
            },
            () => {
              navigationRef.current?.navigate("채팅방", { roomId: payload.roomId });
              console.log("[WS] navigationRef:", navigationRef.current);
            }
          );
        });
      },
      onWebSocketError: (error) => console.error("❌ WebSocket 에러:", error),
      onStompError: (frame) => console.error("❌ STOMP 에러:", frame),
      onWebSocketClose: () => console.warn("🔌 WebSocket 연결 종료"),
      debug: console.log, // 디버깅 활성화
    });

    clientRef.current = client;
    client.activate();

    return () => {
      client.deactivate();
      clientRef.current = null;
    };
  }, [accessToken, loading]);

  return null;
}
