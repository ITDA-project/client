import React, { useContext, useState, useMemo, useEffect } from "react";
import styled, { ThemeContext } from "styled-components/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { Button } from "../components";
import EncryptedStorage from "react-native-encrypted-storage";
import api from "../api/api";

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

const IconBox = styled.TouchableOpacity`
  width: 32px;
  align-items: center;
`;

const AvatarBox = styled.View`
  width: 48px;
  align-items: center;
`;

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

  const checkedParticipants = useMemo(() => {
    return Status.filter((p) => p.attended);
  }, [Status]);

  useEffect(() => {
    console.log("실시간으로 체크된 참여자 목록:");
    if (checkedParticipants.length > 0) {
      checkedParticipants.forEach((p) => {
        console.log(`- 이름: ${p.name}, userId: ${p.userId}`);
      });
    } else {
      console.log("체크된 참여자가 없습니다.");
    }
  }, [checkedParticipants]);

  const handleSubmit = async () => {
    try {
      const token = await EncryptedStorage.getItem("accessToken");

      // ⭐ 환불 대상자는 체크된(checked) 참여자들입니다.
      const refundTargets = checkedParticipants;

      console.log(
        "환불 대상자:",
        refundTargets.map((p) => p.name)
      );

      // 환불 대상자에 대한 환불 처리
      if (refundTargets.length > 0) {
        await Promise.all(
          refundTargets.map(async (p) => {
            // 불참자의 결제 정보(impUid, amount)를 가져오는 API 호출
            const refundInfoResponse = await api.post(
              "/payments/info",
              {
                userId: p.userId,
                sessionId,
                somoimId: roomId,
              },
              {
                headers: { access: token, "Content-Type": "application/json" },
              }
            );

            const { amount, impUid } = refundInfoResponse.data.data;
            console.log(`- ${p.name}의 환불 정보: amount=${amount}, impUid=${impUid}`);

            // 가져온 환불 정보를 포함하여 환불 API 호출
            return api.post(
              "/payments/refund",
              {
                amount,
                impUid,
              },
              {
                headers: { access: token, "Content-Type": "application/json" },
              }
            );
          })
        );
      }

      // 모든 환불 처리가 완료된 후에 모임 종료 API를 호출합니다.
      await api.post(
        "/sessions/end",
        { roomId, sessionId },
        {
          headers: { access: token, "Content-Type": "application/json" },
        }
      );

      console.log("모든 환불 처리와 세션 종료가 완료되었습니다.");
      navigation.goBack();
    } catch (e) {
      console.error("세션 종료 처리 실패:", e.response?.data ?? e.message);
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
