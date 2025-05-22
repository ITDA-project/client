import React, { useState, useContext, useEffect } from "react";
import { View, Text, FlatList, KeyboardAvoidingView, Platform, Modal } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import styled from "styled-components/native";
import { MaterialIcons, Feather, Ionicons } from "@expo/vector-icons";
import { Button } from "../components";
import { ThemeContext } from "styled-components/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native";

const Chat = () => {
  const theme = useContext(ThemeContext);
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  const { title, participants, writerId, userId } = route.params;
  const [currentUserId, setCurrentUserId] = useState(null); //현재 사용자의 ID
  const [messages, setMessages] = useState([
    {
      id: 1,
      name: "신짱구",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQAdcZk8Uxff8hva1DX0f78gtUgkGuLDjlyUCBFbD-S7EEQx2DAQ&s=10&ec=72940544",
      text: "방장님 모임 만들어 주셔서 감사합니다!",
      time: "16:03",
    },
    {
      id: 2,
      name: "김철수",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJyyKfN-ICpUK3cQfrRkLvbF2yKXebXx6RqwLuhMlTiy8qtmF_rw&s=10&ec=72940544",
      text: "뜨린이였는데 많이 배워갑니다 ㅎㅎ 짱구님 덕분에 많이 도움이 됐어요",
      time: "17:23",
    },
    { id: 3, name: "김철수", text: "오늘 정말 재밌었어요!", time: "17:25" },
  ]);
  const [input, setInput] = useState("");
  const [sideMenuVisible, setSideMenuVisible] = useState(false);
  const [participantStatus, setParticipantStatus] = useState({});
  const [meetingActive, setMeetingActive] = useState(false);
  const [hostExists, setHostExists] = useState(true); //모임장 채팅방 내 존재 여부

  useEffect(() => {
    setCurrentUserId(1); //임시 currentUserId 백 연결 시 대체
    setMeetingActive(false);
    setParticipantStatus({});
  }, []);

  useEffect(() => {
    const exists = participants.some((p) => p.userId === writerId);
    setHostExists(exists);
  }, [participants, writerId]);

  const sendMessage = () => {
    if (!hostExists) return; // 방장이 없으면 전송 차단

    if (input.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        name: "나",
        text: input,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages([...messages, newMessage]);
      setInput("");
    }
  };

  const handleStartMeeting = () => {
    //결제페이지 코드 추가
    const updatedStatus = {};
    participants.forEach((p) => {
      updatedStatus[p.name] = p.status ?? "불참";
    });
    setParticipantStatus(updatedStatus);
    setMeetingActive(true);
  };

  const handlePaymentSuccess = (name) => {
    if (meetingActive) {
      setParticipantStatus((prev) => ({ ...prev, [name]: "참여" }));
    }
  }; //결제 완료 후 호출

  const handleEndMeeting = () => {
    setMeetingActive(false);
    setParticipantStatus({});

    const participantStatus = {};
    participants.forEach((p) => {
      if (p.status) {
        participantStatus[p.name] = p.status;
      }
    });
    navigation.navigate("참여확인", { participants, participantStatus });
  };

  const renderItem = ({ item, index }) => {
    const reversedMessages = messages.slice().reverse();
    const prevMessage = reversedMessages[index + 1];
    const isMe = item.name === "나";

    const isFirstOfGroup = !prevMessage || prevMessage.name !== item.name;
    const showTime = !prevMessage || prevMessage.time !== item.time || prevMessage.name !== item.name;
    const image = item.image || null;

    return (
      <MessageRow alignRight={isMe}>
        {!isMe && (
          <AvatarWrapper>
            {isFirstOfGroup ? (
              image ? (
                <ProfileImage source={{ uri: image }} />
              ) : (
                <Feather name="user" size={40} color="#888" />
              )
            ) : (
              <View style={{ width: 40, height: 40 }} /> // 공간 유지용 빈 뷰
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

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
      <ChatHeader>
        <HeaderButton onPress={() => navigation.goBack()}>
          <MaterialIcons name="keyboard-arrow-left" size={38} />
        </HeaderButton>

        <ChatTitleCentered>{title}</ChatTitleCentered>
        <HeaderButton onPress={() => setSideMenuVisible(true)}>
          <MaterialIcons name="menu" size={28} />
        </HeaderButton>
      </ChatHeader>

      <ChatArea>
        <FlatList data={messages.slice().reverse()} renderItem={renderItem} keyExtractor={(item) => item.id} inverted />
        <InputContainer insets={insets} style={{ backgroundColor: hostExists ? "#fff" : "#ccc", justifyContent: "center", alignItems: "center" }}>
          {hostExists ? (
            <>
              <ChatInput placeholder="메세지를 입력해보세요!" value={input} onChangeText={setInput} editable />
              <SendButton onPress={sendMessage}>
                <MaterialIcons name="send" size={24} />
              </SendButton>
            </>
          ) : (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialIcons name="error-outline" size={20} color="#fff" style={{ marginRight: 6 }} />
              <Text style={{ color: "#fff", fontSize: 16, marginBottom: 5 }}>종료된 채팅입니다</Text>
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
                {participants?.map((p, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => {
                      navigation.navigate("리뷰 등록", {
                        userId: p.userId,
                        name: p.name,
                        image: p.image,
                      });
                    }}
                    activeOpacity={0.7}
                  >
                    <ParticipantRow key={i}>
                      {p.image ? <ParticipantImage source={{ uri: p.image }} /> : <Feather name="user" size={28} color="#888" style={{ marginRight: 10 }} />}
                      <ParticipantItem>{p.name}</ParticipantItem>

                      {meetingActive && participantStatus[p.name] && (
                        <StatusBadge>
                          <StatusDot>
                            <Text style={{ color: "#FFD000" }}>{participantStatus[p.name] === "참여" ? "●" : "○"}</Text>
                          </StatusDot>
                          <StatusText>{participantStatus[p.name]}</StatusText>
                        </StatusBadge>
                      )}
                    </ParticipantRow>
                  </TouchableOpacity>
                ))}
              </ParticipantList>
            </ParticipantListContainer>

            {writerId === currentUserId && (
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
                    title="모임시작"
                    onPress={handleStartMeeting}
                    containerStyle={{ backgroundColor: theme.colors.mainBlue, height: 40, width: "100%" }}
                    textStyle={{ color: theme.colors.white, fontSize: 16, marginLeft: 0 }}
                    style={{ height: 40, width: 95 }}
                  />
                )}
              </ButtonContainer>
            )}

            <HeaderButton style={{ alignSelf: "flex-end", position: "absolute", bottom: 20, right: 20 }} onPress={() => console.log("채팅방 나가기")}>
              <Ionicons name="exit-outline" size={28} color="#FF2E2E" />
            </HeaderButton>
          </SideMenuContainer>
        </Overlay>
      </Modal>
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
  max-width: 100%;
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
  max-height: 300px;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const ParticipantList = styled.ScrollView``;

const ParticipantRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
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
  background-color: rgba(0, 0, 0, 0.3); /* 검은색 + 30% 투명도 */
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
