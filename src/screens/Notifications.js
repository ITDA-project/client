import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import styled from "styled-components/native";
import { Feather } from "@expo/vector-icons";

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

const NotificationItem = styled.TouchableOpacity`
  padding: 15px;
  border-bottom-width: 1px;
  border-bottom-color: #eee;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const MessageBox = styled.View`
  flex: 1;
`;

const PostTitle = styled.Text`
  font-size: 16px;
  font-family: ${({ theme }) => theme.fonts.bold};

  margin-bottom: 5px;
`;

const MessageText = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.grey};
  font-family: ${({ theme }) => theme.fonts.regular};
`;

// 알림 더미 데이터
const notifications = [
  {
    id: 1,
    type: "application",
    message: "새로운 신청자가 있어요! 확인해보세요!",
    postTitle: "함께 뜨개질해요!",
  },
  {
    id: 2,
    type: "rejected",
    message: "신청이 거절되었습니다. 다른 모임에 신청해보세요!",
    postTitle: "주말 등산가요!",
  },
  {
    id: 3,
    type: "payment_complete",
    message: "결제가 완료되었어요! 모임을 즐길 준비가 되었어요.",
    postTitle: "일본어 스터디",
  },
];

const NotificationScreen = () => {
  const navigation = useNavigation();

  const handlePress = (type) => {
    switch (type) {
      case "application":
        navigation.navigate("신청서 목록");
        break;
      case "rejected":
        navigation.navigate("전체글");
        break;
      case "payment_complete":
        console.log("결제완료!");
        //navigation.navigate("MyPostDetail");
        break;
      case "payment_required":
        console.log("결제요청! 결제페이지로 이동");
        //navigation.navigate("PaymentScreen");
        break;
      default:
        console.warn("Unknown type:", type);
        break;
    }
  };

  return (
    <Container>
      <Header>알림</Header>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <NotificationItem onPress={() => handlePress(item.type)}>
            <MessageBox>
              <PostTitle>{item.postTitle}</PostTitle>
              <MessageText>{item.message}</MessageText>
            </MessageBox>
            <Feather name="chevron-right" size={20} color="#999" />
          </NotificationItem>
        )}
      />
    </Container>
  );
};

export default NotificationScreen;
