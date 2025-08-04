import "react-native-get-random-values";
import React, { useState, useEffect, useCallback, useContext, useRef, useMemo } from "react";
import { View, Text, FlatList, KeyboardAvoidingView, Platform, Modal } from "react-native";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import styled, { ThemeContext } from "styled-components/native";
import { MaterialIcons, Feather, Ionicons } from "@expo/vector-icons";
import { Button } from "../components";
import ChatModal from "../components/ChatModal";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TouchableOpacity from "react-native/Libraries/Components/Touchable/TouchableOpacity";
import axios from "axios";
import EncryptedStorage from "react-native-encrypted-storage";
import SockJS from "sockjs-client";
import { Client as StompClient } from "@stomp/stompjs";
import { v4 as uuid } from "uuid";

const Chat = () => {
  /* ──────────────────────── 기본 훅 및 파라미터 */
  const theme = useContext(ThemeContext);
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  const { roomId } = route.params;

  const getToday = () => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`; // YYYY-MM-DD
  };

  const getNow = () => {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, "0");
    const mi = String(d.getMinutes()).padStart(2, "0");
    return `${hh}:${mi}`; // HH:mm (24h)
  };

  /* ──────────────────────── 상태 */
  const [currentUserId, setCurrentUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [participants, setParticipants] = useState([]);
  const [sideMenuVisible, setSideMenuVisible] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [meetingActive, setMeetingActive] = useState(false);
  // ⭐ participantStatus 객체의 키를 userId로 관리하도록 변경
  const [participantStatus, setParticipantStatus] = useState({});
  const [wsConnected, setWsConnected] = useState(false);
  const [hostExists, setHostExists] = useState(true);
  const [myRole, setMyRole] = useState();
  const [title, setTitle] = useState("");

  const [startModalVisible, setStartModalVisible] = useState(false);
  const [formDate, setFormDate] = useState(getToday());
  const [formTime, setFormTime] = useState(getNow());
  const [formPrice, setFormPrice] = useState("10000");
  const [formLocation, setFormLocation] = useState("");

  const stompRef = useRef(null);

  /* ──────────────────────── Utils */
  const ensureId = (msg) => ({ ...msg, id: msg.id ?? uuid() });

  /* ──────────────────────── 사용자 ID 로드 */
  useEffect(() => {
    (async () => {
      try {
        const token = await EncryptedStorage.getItem("accessToken");
        const { data } = await axios.get("http://10.0.2.2:8080/api/mypage/me", {
          headers: { access: token },
        });
        setCurrentUserId(Number(data.data));
      } catch (e) {
        console.error("유저 정보 가져오기 실패", e);
      }
    })();
  }, []);

  /* ──────────────────────── 참가자 목록 로드 */
  const fetchParticipants = useCallback(async () => {
    try {
      const token = await EncryptedStorage.getItem("accessToken");
      const { data } = await axios.get(`http://10.0.2.2:8080/api/chatroom/${roomId}/participants`, {
        headers: { access: token },
      });
      const list = (data?.dtoList ?? []).map((p) => ({
        userId: p.userId ?? null,
        name: p.participantName,
        image: p.image,
        status: p.status ?? null,
      }));
      setParticipants(list);
      return list;
    } catch (e) {
      console.error("참가자 목록 불러오기 실패", e.response?.data ?? e.message);
      return [];
    }
  }, [roomId]);

  /* ───── 세션 상태 로드 (수정된 버전) */
  const fetchSessionStatus = useCallback(async () => {
    const token = await EncryptedStorage.getItem("accessToken");

    try {
      // 1. 참가자 목록 로드
      const participantDataResponse = await axios.get(`http://10.0.2.2:8080/api/chatroom/${roomId}/participants`, {
        headers: { access: token },
      });
      const list = (participantDataResponse?.data?.dtoList ?? []).map((p) => ({
        userId: p.userId ?? null,
        name: p.participantName,
        image: p.image,
        status: p.status ?? null,
      }));
      setParticipants(list);

      // 2. 현재 활성화된 세션 정보 로드
      const sessionDataResponse = await axios.get(`http://10.0.2.2:8080/api/sessions/chatroom/${roomId}/active`, {
        headers: { access: token },
      });

      if (!sessionDataResponse.data.data) {
        setMeetingActive(false);
        setParticipantStatus({});
        console.log("[fetchSessionStatus] 활성화된 세션이 없습니다.");
        return;
      }

      const s = sessionDataResponse.data.data;
      setMeetingActive(true);
      setCurrentSessionId(s.id);
      setCurrentRound(s.sessionNumber);

      // 3. 결제 상태 API 호출
      const paymentStatusResponse = await axios.post(
        `http://10.0.2.2:8080/api/payments/status`,
        {
          roomId,
          sessionId: s.id,
        },
        { headers: { access: token } }
      );

      const newParticipantStatus = {};
      const paymentStatuses = paymentStatusResponse?.data?.data?.userPaymentStatuses ?? [];

      console.log("[fetchSessionStatus] 결제 상태 API 응답:", paymentStatuses);

      // 4. 결제 상태 정보 매핑 (userId를 키로 사용)
      paymentStatuses.forEach((userStatus) => {
        // userStatus.paid 값을 사용
        newParticipantStatus[userStatus.userId] = userStatus.paid ? "참여" : "불참";
      });

      // 5. 결제 정보가 없는 참가자(전체 참가자 목록에는 있지만 userPaymentStatuses에 없는 사람)는 '불참'으로 설정
      list.forEach((p) => {
        if (!newParticipantStatus[p.userId]) {
          newParticipantStatus[p.userId] = "불참";
        }
      });

      console.log("[fetchSessionStatus] 최종 참가자 상태:", newParticipantStatus);

      setParticipantStatus(newParticipantStatus);
    } catch (e) {
      console.error("세션 상태 로드 실패:", e.response?.data ?? e.message);
    }
  }, [roomId]);

  /* ──────────────────────── 기존 메시지 로드 */
  const fetchHistory = useCallback(
    async (participantList) => {
      try {
        const token = await EncryptedStorage.getItem("accessToken");
        const { data } = await axios.get(`http://10.0.2.2:8080/api/chatroom/${roomId}`, {
          headers: { access: token },
        });
        const history = (data?.data?.messages ?? []).map((m) => {
          const matchedUser = participantList.find((p) => Number(p.userId) === Number(m.senderId));
          return ensureId({
            id: m.id || m.messageId || uuid(),
            senderId: m.senderId,
            name: m.sender,
            image: matchedUser?.image ?? null,
            text: m.content,
            time: m.createdAt?.slice(11, 16) ?? "",
          });
        });

        setTitle(data.data.roomName);
        setHostExists(!data.data.deleteFlag);
        setMyRole(data.data.role);
        setMessages(history);
      } catch (e) {
        console.error("메시지 불러오기 실패", e.response?.data ?? e.message);
      }
    },
    [roomId]
  );

  /* ──────────────────────── 소켓 연결 */
  const connectSocket = useCallback(async () => {
    const token = await EncryptedStorage.getItem("accessToken");

    const client = new StompClient({
      webSocketFactory: () => new SockJS("http://10.0.2.2:8080/ws"),
      connectHeaders: { access: token },
      debug: (str) => console.log("[STOMP]", str),
      onConnect: () => {
        setWsConnected(true);
        client.subscribe(`/topic/room/${roomId}`, ({ body }) => {
          try {
            const raw = JSON.parse(body);
            const mapped = ensureId({
              id: raw.id || raw.messageId || uuid(),
              senderId: raw.senderId,
              name: raw.senderName || raw.sender,
              image: raw.profileImage,
              text: raw.content,
              time: (raw.sentAt || raw.createdAt)?.slice(11, 16) ?? "",
            });

            setMessages((prev) => {
              if (prev.find((msg) => msg.id === mapped.id)) {
                return prev;
              }
              return [mapped, ...prev];
            });
          } catch (e) {
            console.error("메시지 파싱 실패:", e);
          }
        });
      },
      onStompError: console.error,
      onWebSocketError: console.error,
    });

    client.onUnhandledMessage = (msg) => console.warn("⚠️ UNHANDLED MESSAGE:", msg.body);
    client.activate();
    stompRef.current = client;
  }, [roomId]);

  /* ──────────────────────── 초기 로드 & 언마운트 */
  useEffect(() => {
    if (!roomId) return;

    const initialize = async () => {
      const participantList = await fetchParticipants();
      await connectSocket();
      await fetchHistory(participantList);
      await fetchSessionStatus();
    };

    initialize();
    return () => {
      stompRef.current?.deactivate();
      stompRef.current = null;
    };
  }, [roomId]);

  /* ───────── 화면 포커스 */
  useFocusEffect(
    useCallback(() => {
      if (roomId) fetchSessionStatus();
    }, [roomId])
  );

  useEffect(() => {
    const markAsRead = async () => {
      const accessToken = await EncryptedStorage.getItem("accessToken");
      await axios.post(`http://10.0.2.2:8080/api/chatroom/${roomId}/read`, {}, { headers: { access: accessToken } });
    };
    markAsRead();
  }, [roomId]);

  /* ──────────────────────── 메시지 전송 */
  const handleSend = () => {
    if (!input.trim()) return;
    if (!stompRef.current?.connected) {
      console.warn("소켓 연결 중. 잠시후 시도하세요");
      return;
    }

    stompRef.current.publish({
      destination: `/app/${roomId}`,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ content: input, roomId }),
    });
    setInput("");
  };

  // 채팅방 나가기 버튼
  const leaveRoom = async () => {
    const token = await EncryptedStorage.getItem("accessToken");
    try {
      await axios.delete(`http://10.0.2.2:8080/api/chatroom/${roomId}`, {
        headers: { access: token },
      });
      navigation.goBack();
    } catch (e) {
      console.error("채팅방 나가기 실패", e.response?.data || e.message);
    }
  };

  /* ───────── 모임 시작 */
  const handleStartMeeting = async () => {
    if (meetingActive) return;
    const token = await EncryptedStorage.getItem("accessToken");

    const { data } = await axios.post(
      "http://10.0.2.2:8080/api/sessions/start",
      { roomId, sessionDate: formDate, sessionTime: formTime, price: parseInt(formPrice, 10), location: formLocation },
      { headers: { access: token, "Content-Type": "application/json" } }
    );

    const s = data.data;
    setCurrentSessionId(s.id);
    setCurrentRound(s.sessionNumber);
    setMeetingActive(true);

    const list = await fetchParticipants();

    const initial = {};
    list.forEach((p) => {
      // ⭐ userId를 키로 사용
      initial[p.userId] = "불참";
    });
    setParticipantStatus(initial);
    setStartModalVisible(false);
  };

  const handlePaymentSuccess = (name) => {
    // 이 함수는 이제 사용되지 않지만, 다른 곳에서 호출할 경우를 대비해 유지
    // ⭐ 이 함수를 사용하려면 name 대신 userId를 인자로 받도록 수정해야 합니다.
    if (meetingActive) {
      setParticipantStatus((prev) => ({ ...prev, [name]: "참여" }));
    }
  };

  /* ───────── 모임 종료 */
  const handleEndMeeting = async () => {
    if (!currentSessionId) return;
    const token = await EncryptedStorage.getItem("accessToken");

    try {
      await axios.post(
        "http://10.0.2.2:8080/api/sessions/end",
        { roomId, sessionId: currentSessionId },
        { headers: { access: token, "Content-Type": "application/json" } }
      );

      await fetchSessionStatus();
      setParticipantStatus({});
      setSideMenuVisible(false);
      navigation.navigate("참여확인", { participants, participantStatus, currentRound });
    } catch (e) {
      console.error("모임 종료 실패", e.response?.data ?? e.message);
    }
  };

  /* ──────────────────────── FlatList 데이터 메모 */
  const listData = messages;

  /* ──────────────────────── 렌더 함수 */
  const renderItem = ({ item, index }) => {
    const prev = listData[index + 1];
    const newerMsg = index > 0 ? messages[index - 1] : null;
    const isMe = Number(item.senderId) === Number(currentUserId);
    const isFirstOfGroup = !prev || prev.name !== item.name;
    const showTime = !newerMsg || newerMsg.senderId !== item.senderId || newerMsg.time !== item.time;

    return (
      <MessageRow alignRight={isMe}>
        {!isMe && (
          <AvatarWrapper>
            {isFirstOfGroup ? (
              item.image ? (
                <ProfileImage source={{ uri: item.image }} />
              ) : (
                <ProfileImage source={{ uri: "https://ssl.pstatic.net/static/pwe/address/img_profile.png" }} />
              )
            ) : (
              <View style={{ width: 40, height: 40 }} />
            )}
          </AvatarWrapper>
        )}

        <MessageGroup alignRight={isMe}>
          {!isMe && isFirstOfGroup && <Sender>{item.name}</Sender>}
          <BubbleRow alignRight={isMe}>
            <MessageBubble alignRight={isMe}>
              <MessageText alignRight={isMe}>{item.text}</MessageText>
            </MessageBubble>
            {showTime && <MessageTime alignRight={isMe}>{item.time}</MessageTime>}
          </BubbleRow>
        </MessageGroup>
      </MessageRow>
    );
  };

  /* ──────────────────────── UI 컴포넌트 */
  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
      <ChatHeader>
        <HeaderButton onPress={() => navigation.goBack()}>
          <MaterialIcons name="keyboard-arrow-left" size={38} />
        </HeaderButton>

        <HeaderTitleWrapper>
          <ChatTitleCentered>{title}</ChatTitleCentered>
          {meetingActive && <RoundIndicator>{`${currentRound}회차 진행중`}</RoundIndicator>}
        </HeaderTitleWrapper>

        <HeaderButton
          onPress={() => {
            fetchSessionStatus().finally(() => {
              setSideMenuVisible(true);
            });
          }}
        >
          <MaterialIcons name="menu" size={28} />
        </HeaderButton>
      </ChatHeader>

      <ChatArea>
        {currentUserId !== null && <FlatList data={listData} inverted renderItem={renderItem} keyExtractor={(item) => item.id.toString()} />}
        <InputContainer insets={insets}>
          {hostExists ? (
            <>
              <ChatInput placeholder="메세지를 입력해보세요!" value={input} onChangeText={setInput} editable />
              <SendButton onPress={handleSend} disabled={!stompRef.current?.connected}>
                <MaterialIcons name="send" size={24} />
              </SendButton>
            </>
          ) : (
            <View style={{ flexDirection: "row", alignItems: "center", width: "100%" }}>
              <MaterialIcons name="error-outline" size={20} color="#000" style={{ marginRight: 6 }} />
              <Text style={{ color: "#000", fontSize: 16, marginBottom: 5 }}>종료된 채팅입니다</Text>
            </View>
          )}
        </InputContainer>
      </ChatArea>
      <Modal visible={sideMenuVisible} animationType="slide" transparent>
        <Overlay>
          <SideMenuContainer>
            <HeaderButton style={{ alignSelf: "flex-end" }} onPress={() => setSideMenuVisible(false)}>
              <MaterialIcons name="close" size={30} />
            </HeaderButton>

            <SideMenuTitle>참가 중인 사람</SideMenuTitle>
            <ParticipantListContainer>
              <ParticipantList>
                {participants.map((p) => {
                  // ⭐ p.userId를 사용하여 상태를 참조
                  const status = participantStatus[p.userId] ?? "불참";
                  return (
                    // ⭐ key prop에 p.userId 사용
                    <TouchableOpacity
                      key={p.userId}
                      onPress={() => {
                        navigation.navigate("리뷰 등록", {
                          userId: p.userId,
                          name: p.name,
                          image: p.image,
                        });
                      }}
                      activeOpacity={0.7}
                    >
                      <ParticipantRow>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                          {p?.image ? (
                            <ParticipantImage source={{ uri: p.image }} />
                          ) : (
                            <ParticipantImage source={{ uri: "https://ssl.pstatic.net/static/pwe/address/img_profile.png" }} />
                          )}

                          <ParticipantItem>{p.name}</ParticipantItem>
                        </View>

                        {meetingActive && (
                          <StatusBadge>
                            <StatusDot>
                              <Text style={{ color: "#FFD000" }}>{status === "참여" ? "●" : "○"}</Text>
                            </StatusDot>
                            <StatusText>{status}</StatusText>
                          </StatusBadge>
                        )}
                      </ParticipantRow>
                    </TouchableOpacity>
                  );
                })}
              </ParticipantList>
            </ParticipantListContainer>

            {myRole === "OWNER" && (
              <ButtonContainer>
                {meetingActive ? (
                  <Button
                    title="모임종료"
                    onPress={handleEndMeeting}
                    containerStyle={{ backgroundColor: theme.colors.lightBlue, height: 40, width: "100%" }}
                    textStyle={{ color: theme.colors.black, fontSize: 16, marginLeft: 0 }}
                    style={{ height: 40, width: 95 }}
                  />
                ) : (
                  <Button
                    title="모임 주최"
                    onPress={() => {
                      setFormDate(getToday());
                      setFormTime(getNow());
                      setFormPrice("10000");
                      setFormLocation("");
                      setStartModalVisible(true);
                    }}
                    containerStyle={{ backgroundColor: theme.colors.mainBlue, height: 40, width: "100%" }}
                    textStyle={{ color: theme.colors.white, fontSize: 16, marginLeft: 0 }}
                    style={{ height: 40, width: 95 }}
                  />
                )}
              </ButtonContainer>
            )}

            <HeaderButton style={{ alignSelf: "flex-end", position: "absolute", bottom: 20, right: 20 }} onPress={leaveRoom}>
              <Ionicons name="exit-outline" size={28} color="#FF2E2E" />
            </HeaderButton>
          </SideMenuContainer>
        </Overlay>
      </Modal>
      <ChatModal
        visible={startModalVisible}
        formDate={formDate}
        setFormDate={setFormDate}
        formTime={formTime}
        setFormTime={setFormTime}
        formPrice={formPrice}
        setFormPrice={setFormPrice}
        formLocation={formLocation}
        setFormLocation={setFormLocation}
        onConfirm={handleStartMeeting}
        onCancel={() => setStartModalVisible(false)}
      />
    </KeyboardAvoidingView>
  );
};

export default Chat;

const ChatHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 40px 15px 5px 15px;
  border-bottom-width: 1px;
  border-bottom-color: #eee;
  background-color: white;
`;

const HeaderTitleWrapper = styled.View`
  flex: 1;
  align-items: center;
`;

const RoundIndicator = styled.Text`
  font-size: 13px;
  color: #999;
  margin-top: 2px;
  font-family: ${({ theme }) => theme.fonts.bold};
`;

const ChatTitleCentered = styled.Text`
  font-size: 17px;
  font-family: ${({ theme }) => theme.fonts.extraBold};
`;

const HeaderButton = styled.TouchableOpacity.attrs((props) => ({
  style: props.style,
}))``;

const ChatArea = styled.View`
  flex: 1;
  background-color: white;
`;

const MessageRow = styled.View`
  flex-direction: ${(props) => (props.alignRight ? "row-reverse" : "row")};
  align-items: flex-start;
  padding: 8px 16px;
`;

const AvatarWrapper = styled.View`
  margin-right: 8px;
  margin-top: 4px;
  align-self: flex-start;
`;

const ProfileImage = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #ccc;
`;

const MessageGroup = styled.View`
  max-width: 80%;
  align-self: ${(props) => (props.alignRight ? "flex-end" : "flex-start")};
`;

const BubbleRow = styled.View`
  flex-direction: ${(props) => (props.alignRight ? "row-reverse" : "row")};
  align-items: flex-end;
`;

const MessageTime = styled.Text`
  font-size: 10px;
  color: gray;
  margin-left: ${(props) => (props.alignRight ? "0px" : "6px")};
  margin-right: ${(props) => (props.alignRight ? "6px" : "0px")};
  margin-bottom: 2px;
  font-family: ${({ theme }) => theme.fonts.regular};
`;

const Sender = styled.Text`
  font-size: 14px;
  color: #333;
  font-family: ${({ theme }) => theme.fonts.bold};
  margin-left: 4px;
  margin-bottom: 5px;
`;

const MessageBubble = styled.View`
  background-color: ${(props) => (props.alignRight ? props.theme.colors.mainBlue : props.theme.colors.lightBlue)};
  padding: 10px 14px;
  border-radius: 12px;
  width: auto;
  flex-shrink: 1;
  align-self: ${(props) => (props.alignRight ? "flex-end" : "flex-start")};
`;

const MessageText = styled.Text`
  font-size: 14px;
  font-family: ${({ theme }) => theme.fonts.regular};
  color: ${(props) => (props.alignRight ? props.theme.colors.white : props.theme.colors.black)};
`;

const InputContainer = styled.View`
  flex-direction: row;
  padding: 12px;
  border-top-width: 1px;
  border-top-color: #ddd;
  background-color: white;
  padding-bottom: ${(props) => props.insets?.bottom || 12}px;
`;

const ChatInput = styled.TextInput`
  flex: 1;
  margin-left: 7px;
  margin-bottom: 3px;
  font-size: 14px;
  background-color: #fff;
`;

const SendButton = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  padding-left: 12px;
`;

const SideMenuContainer = styled.View`
  position: relative;
  right: 0;
  top: 0;
  width: 50%;
  height: 100%;
  background-color: #fff;
  border-left-width: 1px;
  border-left-color: #ddd;
  padding: 20px;
  flex-direction: column;
`;

const SideMenuTitle = styled.Text`
  font-size: 18px;
  padding-top: 60px;
  text-align: flex-start;
  font-family: ${({ theme }) => theme.fonts.extraBold};
`;

const ParticipantListContainer = styled.View`
  height: 300px;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const ParticipantList = styled.ScrollView``;

const ParticipantRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  width: 100%;
`;

const ParticipantImage = styled.Image`
  width: 28px;
  height: 28px;
  border-radius: 14px;
  margin-right: 10px;
  background-color: #ccc;
`;
const ParticipantItem = styled.Text`
  font-size: 16px;
  font-family: ${({ theme }) => theme.fonts.bold};
`;

const ButtonContainer = styled.View`
  padding-bottom: 20px;
`;

const Overlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.3);
  flex-direction: row;
  justify-content: flex-end;
`;

const StatusBadge = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.lightBlue};
  padding: 0.5px 7px;
  border-radius: 12px;
  margin-left: 10px;
`;

const StatusDot = styled.View`
  margin-right: 3px;
  margin-bottom: 2px;
`;

const StatusText = styled.Text`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.black};
  font-family: ${({ theme }) => theme.fonts.regular};
`;
