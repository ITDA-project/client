import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import styled from "styled-components/native";

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

const chatRooms = [
  {
    id: "1",
    title: "함께 뜨개질해요!",
    lastMessage: "오늘 정말 재밌었어요!",
    time: "17:25",
    participants: ["신짱구", "김철수", "이훈이"],
  },
  {
    id: "2",
    title: "볼링 모임",
    lastMessage: "알겠습니다~",
    time: "11:53",
    participants: ["최지훈", "박영희", "홍길동"],
  },
];

const ChatList = () => {
  const navigation = useNavigation();

  const renderItem = ({ item }) => (
    <ChatItem
      onPress={() =>
        navigation.navigate("채팅방", {
          roomId: item.id,
          title: item.title,
          participants: item.participants,
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
