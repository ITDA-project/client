import React, { useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { Button, AlertModal } from "../components";
import styled, { ThemeContext } from "styled-components/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import axios from "axios";
import EncryptedStorage from "react-native-encrypted-storage";

const Container = styled.View`
  flex: 1;
  justify-content: flex-start;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.white};
  padding: 0 30px;
  padding-bottom: ${({ insets: { bottom } }) => bottom}px;
`;
const ProfileContainer = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-top: 30px;
  margin-bottom: 10px;
`;
const ProfileImage = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  margin-right: 20px;
  margin-bottom: 20px;
`;
const NameText = styled.Text`
  font-size: 16px;
  font-family: ${({ theme }) => theme.fonts.bold};
  color: ${({ theme }) => theme.colors.black};
  margin-bottom: 20px;
`;
const Form = styled.Text`
  width: 100%;
  font-size: 15px;
  font-family: ${({ theme }) => theme.fonts.regular};
  justify-content: flex-start;
  align-items: flex-start;
  margin-bottom: 30px;
  line-height: 23px;
`;
const ButtonContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const ApplicationDecision = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const theme = useContext(ThemeContext);

  const { formId, postId } = route.params;

  const [formData, setFormData] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [onConfirmAction, setOnConfirmAction] = useState(null);

  const fetchForm = async () => {
    try {
      const token = await EncryptedStorage.getItem("accessToken");
      const response = await axios.get(`http://10.0.2.2:8080/api/posts/${postId}/form/${formId}`, {
        headers: { access: token },
      });

      setFormData(response.data.data); // content, userName, userImage
    } catch (e) {
      console.error("신청폼 조회 실패", e);
      setAlertMessage("신청서를 불러오는 데 실패했습니다.");
      setAlertVisible(true);
    }
  };
  const updateFormStatus = async (status) => {
    try {
      const token = await EncryptedStorage.getItem("accessToken");

      await axios.patch(
        `http://10.0.2.2:8080/api/posts/${postId}/form/${formId}/status/${status}`,
        {},
        {
          headers: { access: token },
        }
      );

      //수락일 경우 채팅방 초대
      if (status === "accept") {
        try {
          await axios.post(
            "http://10.0.2.2:8080/api/chatroom/invite",
            {
              postId,
              username: formData.username,
            },
            { headers: { access: token }, "Content-Type": "application/json" }
          );
        } catch (inviteErr) {
          console.error("채팅방 초대 실패", inviteErr);
          // 초대 실패해도 신청 상태 변경은 이미 성공했으므로 경고만 표시
          Alert.alert("알림", "수락은 완료됐지만 채팅방 초대에 실패했습니다.");
        }
      }

      setAlertMessage(`신청서가 ${status === "accept" ? "수락" : "거절"}되었습니다.`);
      setOnConfirmAction(() => () => navigation.goBack());
      setAlertVisible(true);
    } catch (e) {
      console.error(`신청서 ${status} 실패`, e);
      setAlertMessage("처리 중 오류가 발생했습니다.");
      setAlertVisible(true);
    }
  };

  useEffect(() => {
    fetchForm();
  }, []);
  if (!formData) return null; // 혹은 로딩 인디케이터

  return (
    <Container insets={insets}>
      <ProfileContainer>
        <ProfileImage source={{ uri: formData.userImage || "https://ssl.pstatic.net/static/pwe/address/img_profile.png" }} />
        <NameText>{formData.userName}</NameText>
      </ProfileContainer>

      <Form>{formData.content}</Form>

      <ButtonContainer>
        <Button
          title="수락"
          onPress={() => updateFormStatus("accept")}
          containerStyle={{
            width: 82,
            height: 35,
            marginTop: 20,
            marginBottom: 0,
            marginRight: 50,
            paddingTop: 0,
            paddingBottom: 0,
          }}
          textStyle={{ marginLeft: 0, fontSize: 16 }}
        />
        <Button
          title="거절"
          onPress={() => updateFormStatus("refuse")}
          containerStyle={{
            width: 82,
            height: 35,
            marginTop: 20,
            marginBottom: 0,
            paddingTop: 0,
            paddingBottom: 0,
            backgroundColor: theme.colors.lightBlue,
          }}
          textStyle={{ marginLeft: 0, fontSize: 16, color: theme.colors.black }}
        />
      </ButtonContainer>
      <AlertModal
        visible={alertVisible}
        message={alertMessage}
        onConfirm={() => {
          setAlertVisible(false);
          if (onConfirmAction) onConfirmAction();
        }}
      />
    </Container>
  );
};

export default ApplicationDecision;
