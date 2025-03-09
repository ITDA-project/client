import React, { useContext } from "react";
import { Image } from "react-native";
import { Button } from "../components";
import styled, { ThemeContext } from "styled-components/native";
import Logo from "../../assets/logo.svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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

  return (
    <Container insets={insets}>
      <Logo style={{ marginBottom: 50 }} />
      <DividerContainer>
        <Image source={require("../../assets/line.png")} />
        <DividerText>로그인/회원가입</DividerText>
        <Image source={require("../../assets/line.png")} />
      </DividerContainer>
      <Button
        title="카카오로 시작하기"
        onPress={() => console.log("카카오")} //백이랑 연결할 때 함수 만들기
        icon={require("../../assets/kakao.png")}
        containerStyle={{
          width: "100%",
          flexDirection: "row",
          backgroundColor: "#FFDE00",
          marginTop: 0,
          marginBottom: 30,
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0,
        }}
        textStyle={{
          color: "#3B1E1E",
          fontSize: 16,
          fontFamily: theme.fonts.bold,
        }}
      />
      <Button
        title="네이버로 시작하기"
        onPress={() => console.log("네이버")} //백이랑 연결할 때 함수 만들기
        icon={require("../../assets/naver.png")}
        containerStyle={{
          width: "100%",
          flexDirection: "row",
          backgroundColor: "#00C73C",
          marginTop: 0,
          marginBottom: 30,
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0,
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
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0,
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
