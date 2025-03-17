import React, { useContext, useState } from "react";
import { Image, ActivityIndicator } from "react-native";
import { Button } from "../components";
import styled, { ThemeContext } from "styled-components/native";
import Logo from "../../assets/logo.svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import KakaoLogins from "@react-native-seoul/kakao-login";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.white};
  padding: 0 30px;
  padding-top: ${({ insets: { top } }) => top}px;
  padding-bottom: ${({ insets: { bottom } }) => bottom}px;
`;

const DividerContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

const DividerText = styled.Text`
  font-size: 15px;
  font-family: ${({ theme }) => theme.fonts.regular};
  color: ${({ theme }) => theme.colors.grey};
  margin: 0px 20px;
`;

const Signin = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const theme = useContext(ThemeContext);

  const [loading, setLoading] = useState(false);

  const _handleKakaoLogin = async () => {
    try {
      setLoading(true); // 로딩 시작
      const token = await KakaoLogins.login();
      console.log("카카오 토큰:", token);

      const profile = await KakaoLogins.getProfile();
      console.log("카카오 프로필:", profile);

      Alert.alert("로그인 성공!", `안녕하세요, ${profile.nickname}님!`);
    } catch (err) {
      console.error("카카오 로그인 에러:", err);
      Alert.alert("로그인 실패", err?.message || "알 수 없는 오류");
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  return (
    <Container insets={insets}>
      {loading && (
        <ActivityIndicator
          size="large"
          color={theme.colors.red}
          style={{ position: "absolute", top: "50%", zIndex: 2 }}
        />
      )}

      <Logo style={{ marginBottom: 50 }} />

      <DividerContainer>
        <Image source={require("../../assets/line.png")} />
        <DividerText>로그인/회원가입</DividerText>
        <Image source={require("../../assets/line.png")} />
      </DividerContainer>

      {/* ✅ 카카오 로그인 버튼 */}
      <Button
        title="카카오로 시작하기"
        onPress={_handleKakaoLogin}
        icon={require("../../assets/kakao.png")}
        containerStyle={{
          width: "100%",
          flexDirection: "row",
          backgroundColor: "#FFDE00",
          marginTop: 0,
          marginBottom: 30,
        }}
        textStyle={{
          color: "#3B1E1E",
          fontSize: 16,
          fontFamily: theme.fonts.bold,
        }}
      />

      {/* ✅ 네이버 로그인 (추후 연동) */}
      <Button
        title="네이버로 시작하기"
        onPress={() => console.log("네이버 로그인 준비 중!")}
        icon={require("../../assets/naver.png")}
        containerStyle={{
          width: "100%",
          flexDirection: "row",
          backgroundColor: "#00C73C",
          marginTop: 0,
          marginBottom: 30,
        }}
        textStyle={{
          color: "#ffffff",
          fontSize: 16,
          fontFamily: theme.fonts.bold,
        }}
      />

      {/* ✅ 이메일 회원가입 */}
      <Button
        title="이메일로 시작하기"
        onPress={() => navigation.navigate("이메일로 시작하기")}
        icon={require("../../assets/mail.png")}
        containerStyle={{
          width: "100%",
          flexDirection: "row",
          backgroundColor: "#E3F0FF",
          marginTop: 0,
          marginBottom: 60,
        }}
        textStyle={{
          color: "#3F9AFE",
          fontSize: 16,
          fontFamily: theme.fonts.bold,
        }}
      />
    </Container>
  );
};

export default Signin;
