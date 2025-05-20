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
    postId: "101", // 게시글 ID 추가
    writerId: "user123", // 게시글 작성자 ID 추가
    title: "함께 뜨개질해요!",
    lastMessage: "오늘 정말 재밌었어요!",
    time: "17:25",
    participants: [
      {
        name: "신짱구",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQAdcZk8Uxff8hva1DX0f78gtUgkGuLDjlyUCBFbD-S7EEQx2DAQ&s=10&ec=72940544",
        status: "참여",
      },
      {
        name: "김철수",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJyyKfN-ICpUK3cQfrRkLvbF2yKXebXx6RqwLuhMlTiy8qtmF_rw&s=10&ec=72940544",
        status: "참여",
      },
      { name: "이훈이", image: null, status: null },
      { name: "이훈삼", image: null, status: null },
      { name: "이훈사", image: null, status: null },
      { name: "이훈오", image: null, status: null },
    ],
  },
  {
    id: "2",
    postId: "102",
    writerId: "user456",
    title: "볼링 모임",
    lastMessage: "알겠습니다~",
    time: "11:53",
    participants: [
      { name: "홍길동", image: null, status: null },
      { name: "최지훈", image: null, status: "참여" },
    ],
  },
];

const ChatList = () => {
  const navigation = useNavigation();

  const renderItem = ({ item }) => (
    <ChatItem
      onPress={() =>
        navigation.navigate("채팅방", {
          title: item.title,
          participants: item.participants,
          postId: item.postId,
          writerId: item.writerId,
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
