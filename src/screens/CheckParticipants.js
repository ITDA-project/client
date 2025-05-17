import React, { useContext, useState } from "react";
import styled, { ThemeContext } from "styled-components/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { Button } from "../components";

const Wrapper = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.white};
`;

const Container = styled.View`
  flex: 1;
  padding: 40px 30px 120px;
  align-items: center;
  justify-content: flex-start;
`;

const MeetingDate = styled.Text`
  margin-top: 30px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.colors.black};
  font-size: 24px;
  font-family: ${({ theme }) => theme.fonts.bold};
`;

const MessageText = styled.Text`
  color: ${({ theme }) => theme.colors.grey};
  font-size: 18px;
  text-align: center;
  font-family: ${({ theme }) => theme.fonts.bold};
  margin-bottom: 10px;
`;

const ParticipantListContainer = styled.ScrollView`
  width: 100%;
  flex-grow: 0;
  margin-top: 40px;
`;

const ParticipantList = styled.View`
  width: 100%;
  align-items: center;
`;

const ParticipantRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
`;

const ParticipantImage = styled.Image`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  margin: 0 12px;
  background-color: #ccc;
`;

const ParticipantName = styled.Text`
  font-size: 16px;
  font-family: ${({ theme }) => theme.fonts.bold};
`;

const FooterContainer = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px 30px;
  margin-bottom: 20px;
  background-color: ${({ theme }) => theme.colors.white};
`;

const CheckParticipants = () => {
  const insets = useSafeAreaInsets();
  const theme = useContext(ThemeContext);
  const navigation = useNavigation();
  const route = useRoute();
  const { participants } = route.params;

  //결제여부 상태 저장
  const [Status, setStatus] = useState(participants.map((p) => ({ ...p, attended: false })));

  const toggleCheck = (index) => {
    const updated = [...Status];
    updated[index].attended = !updated[index].attended;
    setStatus(updated);
  };

  const handleSubmit = () => {
    const selected = actualStatus.filter((p) => p.attended);
    console.log("✅ 실제 참석한 사람:", selected);
    navigation.goBack();
  };

  return (
    <Wrapper>
      <Container insets={insets}>
        <MeetingDate>2025/05/26</MeetingDate>
        <MessageText>모임이 종료되었습니다!</MessageText>
        <MessageText>모임에 참여한 사람을 선택해 주세요.</MessageText>

        <ParticipantListContainer>
          <ParticipantList>
            {participants.map((p, i) => (
              <ParticipantRow key={i}>
                <MaterialIcons
                  name={checked[i] ? "check-box" : "check-box-outline-blank"}
                  size={24}
                  color={theme.colors.black}
                  onPress={() => toggleCheck(i)}
                />
                {p.image ? <ParticipantImage source={{ uri: p.image }} /> : <Feather name="user" size={28} color="#888" style={{ marginHorizontal: 12 }} />}
                <ParticipantName>{p.name}</ParticipantName>
              </ParticipantRow>
            ))}
          </ParticipantList>
        </ParticipantListContainer>
      </Container>

      <FooterContainer>
        <Button
          title="확인"
          onPress={handleSubmit}
          containerStyle={{ width: "100%", backgroundColor: theme.colors.mainBlue }}
          textStyle={{ marginLeft: 0, color: "white" }}
        />
      </FooterContainer>
    </Wrapper>
  );
};

export default CheckParticipants;
