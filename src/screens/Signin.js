import React, { useContext, useEffect, useState } from "react";
import { Image, ActivityIndicator } from "react-native";
import { Button } from "../components";
import styled, { ThemeContext } from "styled-components/native";
import Logo from "../../assets/logo.svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { login, getProfile as getKakaoProfile } from "@react-native-seoul/kakao-login";
import NaverLogin from "@react-native-seoul/naver-login";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import EncryptedStorage from "react-native-encrypted-storage";
import * as Keychain from "react-native-keychain";

const consumerKey = "jXwhTHdVTq8o67R0hwKd";
const consumerSecret = "0N1OGuLkjK";
const appName = "moamoa";
const serviceUrlScheme = "com.csj1430.moamoa";

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
  const [result, setResult] = useState("");
  const [success, setSuccessResponse] = useState(null);
  const [failure, setFailureResponse] = useState(null);
  const [getProfileRes, setGetProfileRes] = useState(null);

  const { setUser, setAccessToken } = useAuth();

  useEffect(() => {
    NaverLogin.initialize({
      appName,
      consumerKey,
      consumerSecret,
      serviceUrlScheme,
      serviceUrlSchemeIOS: serviceUrlScheme,
      disableNaverAppAuthIOS: true,
    });
  }, []);

  const signinWithKakao = async () => {
    try {
      setLoading(true);

      // 1. 카카오 로그인
      const token = await login();

      const loginData = {
        accessToken: token.accessToken,
        idToken: token.idToken,
        refreshToken: token.refreshToken,
      };

      console.log("카카오에서 가져온 카카오 로그인 데이터", token);

      // 2. 카카오 프로필 가져오기
      const profile = await getKakaoProfile();

      // 3. 필요한 정보 추출
      const userData = {
        email: profile.email,
        name: profile.name,
        gender: profile.gender,
        id: profile.id,
        phonenumber: profile.phoneNumber,
      };

      console.log("백엔드로 보낼 카카오 데이터", userData);

      //4. 백엔드로 전달 (axios 사용)
      const response = await axios.post("http://10.0.2.2:8080/api/auth/signup/kakao", userData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // 5. JWT 저장 (access token은 헤더, refresh token은 응답 데이터)
      const accessToken = response.headers.authorization;
      const refreshToken = response.data.refresh_token;

      console.log("백엔드 응답", response.data);

      if (accessToken) {
        await EncryptedStorage.setItem("accessToken", accessToken);
        setAccessToken(accessToken);

        const storedAccessToken = await EncryptedStorage.getItem("accessToken");
        console.log("저장된 엑세스 토큰: ", storedAccessToken);
      } else {
        console.log("access가 존재하지 않습니다");
      }

      if (refreshToken) {
        await Keychain.setGenericPassword("refreshToken", refreshToken);

        const credentials = await Keychain.getGenericPassword();

        if (credentials) {
          console.log("저장된 리프레쉬 토큰: ", credentials.password);
        }
      } else {
        console.error("refresh_token이 존재하지 않습니다");
      }

      setUser(response.data);
      // 6. 메인 화면 이동
      navigation.navigate("Home");
    } catch (err) {
      console.error("카카오 로그인 실패", err);
    } finally {
      setLoading(false);
    }
  };

  const signinWithNaver = async () => {
    try {
      setLoading(true);

      // 1. 네이버 로그인
      const { successResponse } = await NaverLogin.login({
        appName,
        consumerKey,
        consumerSecret,
        serviceUrlScheme,
      });

      if (!successResponse) {
        throw new Error("네이버 로그인 실패");
      }

      const loginData = {
        accessToken: successResponse.accessToken,
        idToken: successResponse.idToken,
        refreshToken: successResponse.refreshToken,
      };

      console.log("네이버에서 가져온 네이버 로그인 데이터", loginData);

      // 2. 네이버 프로필 가져오기
      const profileResult = await NaverLogin.getProfile(successResponse.accessToken);

      if (!profileResult || profileResult.resultcode !== "00") {
        throw new Error("네이버 프로필 가져오기 실패");
      }

      // 3. 필요한 정보 추출
      const userData = {
        email: profileResult.response.email,
        name: profileResult.response.name,
        gender: profileResult.response.gender,
        id: profileResult.response.id,
        phonenumber: profileResult.response.mobile_e164,
      };

      console.log("백엔드로 보낼 네이버 데이터", userData);

      // 4. 백엔드로 전달 (axios 사용)
      const response = await axios.post("http://10.0.2.2:8080/api/auth/signup/naver", userData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("백엔드 응답", response.data);

      const accessToken = response.headers.authorization;
      const refreshToken = response.data.refresh_token;

      if (accessToken) {
        await EncryptedStorage.setItem("accessToken", accessToken);
        setAccessToken(accessToken);
        console.log("저장된 액세스 토큰:", await EncryptedStorage.getItem("accessToken"));
      } else {
        console.warn("access_token이 없습니다.");
      }

      if (refreshToken) {
        await Keychain.setGenericPassword("refreshToken", refreshToken);
        console.log("저장된 리프레쉬 토큰:", (await Keychain.getGenericPassword()).password);
      } else {
        console.warn("refresh_token이 없습니다.");
      }

      setUser(response.data);
      // 6. 메인 화면 이동
      navigation.navigate("Home");
    } catch (err) {
      console.error("네이버 로그인 실패", err);
    } finally {
      setLoading(false);
    }
  };

  //나중에 로그아웃 페이지로 옮겨
  const logoutWithNaver = async () => {
    try {
      await NaverLogin.logout();
      setSuccessResponse(null);
      setFailureResponse(null);
      setGetProfileRes(null);
    } catch (e) {
      console.error(e);
    }
  };
  const deleteToken = async () => {
    try {
      await NaverLogin.deleteToken();
      setSuccessResponse(null);
      setFailureResponse(null);
      setGetProfileRes(null);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Container insets={insets}>
      {loading && <ActivityIndicator size="large" color={theme.colors.red} style={{ position: "absolute", top: "50%", zIndex: 2 }} />}

      <Logo style={{ marginBottom: 50 }} />

      <DividerContainer>
        <Image source={require("../../assets/line.png")} />
        <DividerText>로그인/회원가입</DividerText>
        <Image source={require("../../assets/line.png")} />
      </DividerContainer>

      <Button
        title="카카오로 시작하기"
        onPress={signinWithKakao}
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

      <Button
        title="네이버로 시작하기"
        onPress={signinWithNaver}
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
