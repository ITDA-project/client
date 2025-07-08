import { useState, useCallback } from "react";
import { FlatList } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import styled from "styled-components/native";
import axios from "axios";
import EncryptedStorage from "react-native-encrypted-storage";

const Container = styled.View`
  flex: 1;
  background-color: white;
  padding: 5px;
`;

const Header = styled.Text`
  font-size: 18px;
  text-align: center;
  font-family: ${({ theme }) => theme.fonts.extraBold};
  padding: 5px;
  margin-top: 40px;
  margin-bottom: 10px;
`;

const ChatItem = styled.TouchableOpacity`
  padding: 15px;
  background-color: white;
`;

const ChatHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ChatTitle = styled.Text`
  font-size: 16px;
  font-family: ${({ theme }) => theme.fonts.bold};
`;

const ChatTime = styled.Text`
  font-size: 12px;
  font-family: ${({ theme }) => theme.fonts.regular};
  color: ${({ theme }) => theme.colors.grey};
`;

const ChatMessage = styled.Text`
  margin-top: 5px;
  font-size: 14px;
  font-family: ${({ theme }) => theme.fonts.regular};
  color: ${({ theme }) => theme.colors.grey};
`;

const Separator = styled.View`
  height: 1px;
  background-color: #e1e1e1;
`;

const EmptyContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding-bottom: 30px;
`;

const EmptyText = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.grey};
  font-family: ${({ theme }) => theme.fonts.bold};
`;

const ChatList = () => {
  const navigation = useNavigation();
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ──────────────────────── 채팅방 목록 조회 */
  const fetchChatRooms = useCallback(async () => {
    console.log("📡 fetchChatRooms 호출");
    try {
      setLoading(true);

      const accessToken = await EncryptedStorage.getItem("accessToken");
      if (!accessToken) {
        console.warn("⚠️ accessToken 없음");
        return;
      }

      const res = await axios.get("http://10.0.2.2:8080/api/chatroom", {
        headers: { access: accessToken },
      });

      console.log("✅ 응답 전체:", res.data);

      // ① 응답 구조(data → dtoList) 확인
      const list = Array.isArray(res.data?.dtoList) ? res.data.dtoList : [];

      console.log("🗒 dtoList 원본:", list);

      //중복제거
      const uniqueList = Array.from(
        new Map(list.map((c) => [c.id, c])) // key = c.id, value = c
      ).map(([_, v]) => v);

      // ② 화면에서 쓸 형태로 매핑
      const mapped = uniqueList.map((c) => ({
        id: String(c.id), // 채팅방 ID
        postId: c.postId ? String(c.postId) : "",
        writerId: c.userId,
        title: c.roomName ?? "채팅방",
        lastMessage: c.lastMessage ?? "",
        time: c.lastMessageAt ? c.lastMessageAt.slice(11, 16) : "",
        participants: c.participants ?? [],
      }));

      console.log(
        "🎛 매핑 결과:",
        mapped.map((x) => x.id)
      );

      setChatRooms(mapped);
    } catch (e) {
      console.error("❌ 채팅방 목록 조회 실패:", e.response?.data ?? e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ──────────────────────── 화면 포커스마다 새로고침 */
  useFocusEffect(
    useCallback(() => {
      fetchChatRooms();
    }, [fetchChatRooms])
  );

  const renderItem = ({ item }) => (
    <ChatItem
      onPress={() =>
        navigation.navigate("채팅방", {
          title: item.title,
          participants: item.participants,
          roomId: String(item.id),
        })
      }
    >
      <ChatHeader>
        <ChatTitle>{item.title}</ChatTitle>
        <ChatTime>{item.time}</ChatTime>
      </ChatHeader>
      <ChatMessage>{item.lastMessage}</ChatMessage>
    </ChatItem>
  );

  return (
    <Container>
      <Header>채팅목록</Header>

      {chatRooms.length === 0 ? (
        <EmptyContainer>
          <EmptyText>참여중인 모임이 없습니다</EmptyText>
        </EmptyContainer>
      ) : (
        <FlatList data={chatRooms} renderItem={renderItem} keyExtractor={(item) => item.id} ItemSeparatorComponent={() => <Separator />} />
      )}
    </Container>
  );
};

export default ChatList;
