import React, { useContext, useState } from "react";
import { Button, AlertModal } from "../components";
import styled, { ThemeContext } from "styled-components/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import axios from "axios";
import EncryptedStorage from "react-native-encrypted-storage";
import * as Keychain from "react-native-keychain";
import { isTokenExpired } from "../utils/auth";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.white};
  padding: 0 30px;
  padding-bottom: ${({ insets: { bottom } }) => bottom + 50}px;
`;
const FooterContainer = styled.View`
  position: absolute;
  padding: 0 30px;
  bottom: 0;
  padding-bottom: 50px;
  align-items: center;
  width: 100%;
`;
const MessageText = styled.Text`
  margin-top: 10px;
  color: ${({ theme }) => theme.colors.grey};
  font-size: 24px;
  text-align: center;
  font-family: ${({ theme }) => theme.fonts.bold};
`;
const HighlightText = styled.Text`
  color: ${({ theme }) => theme.colors.mainBlue};
`;
const HighlightText2 = styled.Text`
  color: ${({ theme }) => theme.colors.red};
`;

const DeleteAccount = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const theme = useContext(ThemeContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleDeleteAccount = async () => {
    try {
      let accessToken = await EncryptedStorage.getItem("accessToken");
      const credentials = await Keychain.getGenericPassword();
      const refreshToken = credentials ? credentials.password : null;

      console.log("보내는 엑세스 토큰: ", accessToken);
      console.log("보내는 리프레쉬 토큰: ", refreshToken);

      // accessToken이 만료되었는지 확인
      if (!accessToken || isTokenExpired(accessToken)) {
        const response = await axios.post("http://10.0.2.2:8080/reissue", {
          refresh_token: refreshToken,
        });
        accessToken = response.headers["access"];
        await EncryptedStorage.setItem("accessToken", accessToken);
      }

      await axios.post(
        "http://10.0.2.2:8080/api/auth/delete",
        {
          refresh_token: refreshToken,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // 탈퇴 후 토큰 제거
      await EncryptedStorage.removeItem("accessToken");
      await Keychain.resetGenericPassword();

      setModalMessage("정상적으로 탈퇴되었습니다.");
      setModalVisible(true);

      // 1초 후 홈으로 이동
      setTimeout(() => {
        navigation.replace("Home");
      }, 1000);
    } catch (error) {
      const status = error?.response?.status;
      if (status === 400) {
        setModalMessage("유효하지 않은 요청입니다.");
      } else if (status === 401) {
        setModalMessage("인증이 만료되었습니다. 다시 로그인해주세요.");
      } else {
        setModalMessage("탈퇴 중 문제가 발생했습니다.\n다시 시도해주세요.");
      }
      setModalVisible(true);
      console.error("탈퇴 실패", error);
    }
  };

  return (
    <KeyboardAwareScrollView extraScrollHeight={20} contentContainerStyle={{ flex: 1 }}>
      <Container insets={insets}>
        <MessageText>
          <HighlightText>모아모아</HighlightText>와 함께한 시간들이
        </MessageText>
        <MessageText>아쉬우셨나요?</MessageText>
        <MessageText style={{ marginTop: 50 }}>탈퇴 버튼 선택 시,</MessageText>
        <MessageText>
          계정은 <HighlightText2>삭제</HighlightText2>되며
        </MessageText>
        <MessageText>복구되지 않습니다</MessageText>
      </Container>
      <FooterContainer>
        <Button
          title="탈퇴"
          onPress={handleDeleteAccount}
          containerStyle={{
            backgroundColor: theme.colors.red,
            width: "100%",
            marginTop: 100,
          }}
          textStyle={{ marginLeft: 0 }}
        />
      </FooterContainer>
      <AlertModal visible={modalVisible} message={modalMessage} onConfirm={() => setModalVisible(false)} />
    </KeyboardAwareScrollView>
  );
};

export default DeleteAccount;
