import React, { useContext, useState } from "react";
import { Input, Button, AlertModal } from "../components";
import styled, { ThemeContext } from "styled-components/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import axios from "axios";
import EncryptedStorage from "react-native-encrypted-storage";
import * as Keychain from "react-native-keychain";
import { useAuth } from "../contexts/AuthContext";

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
  const { setAccessToken, setUser } = useAuth();

  // ✅ 상태는 컴포넌트 최상단에
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [onConfirmAction, setOnConfirmAction] = useState(null);

  const handleDeleteAccount = async () => {
    try {
      const accessToken = await EncryptedStorage.getItem("accessToken");
      const credentials = await Keychain.getGenericPassword();
      const refreshToken = credentials?.password;

      if (!accessToken || !refreshToken) {
        setAlertMessage("토큰 정보가 없습니다. 다시 로그인해주세요.");
        setAlertVisible(true);
        return;
      }

      try {
        await axios.delete("http://10.0.2.2:8080/api/auth/delete", {
          headers: {
            access: accessToken,
            "Content-Type": "application/json",
          },
          data: {
            refresh_token: refreshToken,
          },
        });

        await EncryptedStorage.removeItem("accessToken");
        await Keychain.resetGenericPassword();
        setAccessToken(null);
        setUser(null);

        setAlertMessage("회원 탈퇴가 완료되었습니다.");
        setOnConfirmAction(() => () => navigation.reset({ index: 0, routes: [{ name: "Home" }] }));
        setAlertVisible(true);
      } catch (error) {
        console.error("❌ 탈퇴 실패:", error);
        setAlertMessage("탈퇴 중 오류가 발생했습니다.");
        setAlertVisible(true);
      }
    } catch (error) {
      setAlertMessage("알 수 없는 오류가 발생했습니다.");
      setAlertVisible(true);
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
      {/* ✅ AlertModal 삽입 */}
      <AlertModal
        visible={alertVisible}
        message={alertMessage}
        onConfirm={() => {
          setAlertVisible(false);
          if (onConfirmAction) onConfirmAction();
        }}
      />
    </KeyboardAwareScrollView>
  );
};

export default DeleteAccount;
