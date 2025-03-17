import React, { useContext, useState } from "react";
import { Image, ActivityIndicator, Pressable } from "react-native";
import { Button } from "../components";
import styled, { ThemeContext } from "styled-components/native";
import Logo from "../../assets/logo.svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import qs from "qs";
import axios from "axios";
import { API_URL, KAKAO_NATIVE_APP_KEY } from "@env";
import KakaoLogins from "@react-native-seoul/kakao-login";

console.log(API_URL);
console.log(KAKAO_NATIVE_APP_KEY);
console.log(KakaoLogins);

// ✅ styled-components
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

  const loginWithKakao = async () => {
    try {
      setLoading(true);

      const token = await KakaoLogins.login();
      const profile = await KakaoLogins.getProfile();

      console.log("카카오 토큰:", token);
      console.log("카카오 프로필:", profile);

      // ✅ 백엔드로 액세스 토큰과 프로필 전달
      const backendRes = await axios.post(`${API_URL}/auth/kakao`, {
        accessToken: token.accessToken,
        profile,
      });

      console.log("백엔드 응답:", backendRes.data);

      // ✅ 로그인 성공 처리
      navigation.navigate("Main");
    } catch (error) {
      console.error("카카오 로그인 에러:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ 토큰 요청 및 백엔드 전달 함수
  const requestToken = async (code, redirectUri) => {
    setLoading(true);

    const tokenUrl = "https://kauth.kakao.com/oauth/token";

    const payload = qs.stringify({
      grant_type: "authorization_code",
      client_id: REST_API_KEY,
      redirect_uri: redirectUri,
      code,
    });

    try {
      // ✅ 카카오 토큰 요청
      const res = await axios.post(tokenUrl, payload, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      const { access_token } = res.data;
      console.log("✅ 카카오 액세스 토큰:", access_token);

      // ✅ 백엔드에 토큰 전달
      const backendRes = await axios.post(BACKEND_API_URL, {
        access_token,
      });

      console.log("✅ 백엔드 응답:", backendRes.data);

      // ✅ 로그인 성공 시 화면 이동
      navigation.navigate("Main"); // 네비게이션 스택에 따라 경로 수정
    } catch (error) {
      console.error("❌ 토큰 요청 실패:", error);
    } finally {
      setLoading(false);
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
        onPress={loginWithKakao}
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
