import React, { useContext, useState, useMemo } from "react";
import styled, { ThemeContext } from "styled-components/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { Button } from "../components";
import EncryptedStorage from "react-native-encrypted-storage";
import axios from "axios";

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

const EmptyText = styled.Text`
  position: absolute;
  top: 55%;
  font-size: 16px;
  color: #a1a1a1;
  text-align: center;
  font-family: ${({ theme }) => theme.fonts.regular};
`;

const CheckParticipants = () => {
  const insets = useSafeAreaInsets();
  const theme = useContext(ThemeContext);
  const navigation = useNavigation();
  const route = useRoute();
  const { participants, participantStatus, currentRound, sessionDate, roomId, sessionId } = route.params ?? {};

  const paidParticipants = useMemo(() => {
    return participants.filter((p) => participantStatus[p.userId] === "참여");
  }, [participants, participantStatus]);

  const [Status, setStatus] = useState(() => paidParticipants.map((p) => ({ ...p, attended: false })));

  const toggleCheck = (index) => {
    const updated = [...Status];
    updated[index].attended = !updated[index].attended;
    setStatus(updated);
  };

  const handleSubmit = async () => {
    const actualParticipants = Status.filter((p) => p.attended).map((p) => p.userId);

    try {
      const token = await EncryptedStorage.getItem("accessToken");
      // ⭐ 이 곳에서 모임 종료 API를 호출합니다.
      await axios.post(
        "http://10.0.2.2:8080/api/sessions/end",
        {
          roomId,
          sessionId,
          // ⭐ 실제 참여자를 백엔드로 보내야 할 경우 이 부분을 추가해야 합니다.
          // actualParticipants
        },
        {
          headers: { access: token, "Content-Type": "application/json" },
        }
      );

      // API 호출 성공 후, 이전 화면으로 돌아갑니다.
      navigation.goBack();
    } catch (e) {
      console.error("모임 종료 실패:", e.response?.data ?? e.message);
      // 실패 시 사용자에게 알림을 주는 로직 추가 가능
    }
  };

  return (
    <Wrapper>
      <Container insets={insets}>
        <MeetingDate>{sessionDate || "날짜 정보 없음"}</MeetingDate>
        <MessageText>
          <RoundText>{currentRound}회차</RoundText> 모임이 종료되었습니다!
        </MessageText>
        {paidParticipants.length === 0 ? (
          <EmptyText>결제한 사람이 없습니다.</EmptyText>
        ) : (
          <>
            <MessageText>모임에 참여한 사람을 선택해 주세요.</MessageText>
            <ParticipantListContainer>
              <ParticipantList>
                {paidParticipants.map((p, i) => (
                  <ParticipantRow key={i}>
                    <IconBox onPress={() => toggleCheck(i)}>
                      <MaterialIcons name={Status[i].attended ? "check-box" : "check-box-outline-blank"} size={24} color={theme.colors.black} />
                    </IconBox>
                    <AvatarBox>
                      {p.image ? (
                        <ParticipantImage source={{ uri: p.image }} />
                      ) : (
                        // 👇 이 부분을 수정합니다.
                        <ParticipantImage source={{ uri: "https://ssl.pstatic.net/static/pwe/address/img_profile.png" }} />
                      )}
                    </AvatarBox>
                    <ParticipantName>{p.name}</ParticipantName>
                  </ParticipantRow>
                ))}
              </ParticipantList>
            </ParticipantListContainer>
          </>
        )}
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
