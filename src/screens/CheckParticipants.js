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

const RoundText = styled.Text`
  color: ${({ theme }) => theme.colors.black};
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

/* --- 새로 추가 --- */
const IconBox = styled.TouchableOpacity`
  width: 32px; /* 체크박스 영역 고정 */
  align-items: center;
`;

const AvatarBox = styled.View`
  width: 48px; /* 이미지 + 좌우 여백 포함 고정 */
  align-items: center;
`;

/* 기존 ParticipantRow는 폭 100%, align-items:center 유지 */
const ParticipantRow = styled.View`
  width: 100%;
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
  const { participants, participantStatus, currentRound } = route.params ?? {};

  //체크박스 선택 여부 상태 저장
  const [Status, setStatus] = useState(participants.map((p) => ({ ...p, attended: false })));

  const toggleCheck = (index) => {
    const updated = [...Status];
    updated[index].attended = !updated[index].attended;
    setStatus(updated);
  };

  const handleSubmit = () => {
    const actualParticipants = Status.filter((p) => p.attended) //체크된 사람만 필터링
      .map((p) => p.name); //이름만 추출
    const expectedParticipants = Object.entries(participantStatus ?? {})
      .filter(([_, status]) => status === "참여") //값이 "참여"인 항목만 필터링
      .map(([name]) => name); //이름만 추출

    //참여 예정자 중 실제 참석한 사람
    const matchedParticipants = actualParticipants.filter((name) => expectedParticipants.includes(name));
    console.log("💸 보증금 환불 대상:", matchedParticipants);
    navigation.goBack();
  };

  return (
    <Wrapper>
      <Container insets={insets}>
        <MeetingDate>2025/05/26</MeetingDate>
        <MessageText>
          <RoundText>{currentRound}회차</RoundText> 모임이 종료되었습니다!
        </MessageText>
        <MessageText>모임에 참여한 사람을 선택해 주세요.</MessageText>

        <ParticipantListContainer>
          <ParticipantList>
            {participants.map((p, i) => (
              <ParticipantRow key={i}>
                <IconBox onPress={() => toggleCheck(i)}>
                  <MaterialIcons name={Status[i].attended ? "check-box" : "check-box-outline-blank"} size={24} color={theme.colors.black} />
                </IconBox>

                <AvatarBox>{p.image ? <ParticipantImage source={{ uri: p.image }} /> : <Feather name="user" size={28} color="#888" />}</AvatarBox>

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
