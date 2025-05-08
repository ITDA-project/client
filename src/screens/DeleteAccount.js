import React, { useContext } from "react";
import { Alert } from "react-native";
import { Button } from "../components";
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

  const handleDeleteAccount = async () => {
    try {
      const accessToken = await EncryptedStorage.getItem("accessToken");
      const credentials = await Keychain.getGenericPassword();
      const refreshToken = credentials?.password;

      console.log("📦 accessToken: ", accessToken);

      if (!accessToken || !refreshToken) {
        Alert.alert("오류", "토큰 정보가 없습니다. 다시 로그인해주세요.");
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
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log("❌ 응답 코드:", error.response?.status);
          console.log("❌ 응답 메시지:", error.response?.data); // 여기에 에러 메시지 나올 수 있음
        }
      }

      // 로컬 토큰 제거
      await EncryptedStorage.removeItem("accessToken");
      await Keychain.resetGenericPassword();
      setAccessToken(null);
      setUser(null);

      Alert.alert("탈퇴 완료", "회원 탈퇴가 완료되었습니다.");
      navigation.reset({ index: 0, routes: [{ name: "Home" }] }); // 또는 로그인 화면 등으로 이동
    } catch (error) {
      console.error("회원 탈퇴 실패:", error);
      Alert.alert("탈퇴 실패", "알 수 없는 오류가 발생했습니다.");
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
    </KeyboardAwareScrollView>
  );
};

export default DeleteAccount;
