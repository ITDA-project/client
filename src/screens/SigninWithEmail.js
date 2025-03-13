import React, { useState, useContext, useEffect } from "react";
import { Button, ErrorMessage } from "../components";
import LostPw from "../components/LostPw";
import Input from "../components/Input";
import styled, { ThemeContext } from "styled-components/native";
import Logo from "../../assets/logo.svg";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { validateEmail, removeWhitespace } from "../utils";
import { Keyboard } from "react-native";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.white};
  padding: 0 30px;
  padding-top: ${({ insets: { top } }) => top}px;
  padding-bottom: ${({ insets: { bottom } }) => bottom + 50}px;
`;
const FooterContainer = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding-bottom: 50px;
  align-items: center;
  width: 100%;
`;

const SigninWithEmail = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const theme = useContext(ThemeContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    setDisabled(!(email && password && !errorMessage));
  }, [email, password, errorMessage]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const _handleEmailChange = (email) => {
    const changeEmail = removeWhitespace(email);
    setEmail(changeEmail);

    setErrorMessage(
      validateEmail(changeEmail) ? "" : "이메일을 올바르게 입력해주세요"
    );
  };

  const _handlePasswordChange = (password) => {
    const changePassword = removeWhitespace(password);
    setPassword(changePassword);

    setErrorMessage(changePassword != "" ? "" : "비밀번호를 입력해주세요");
  };

  const _handleSigninBtnPress = async () => {
    //백이랑 연결하고 나서 회원정보가 일치하지 않는다는 에러 메세지 추가할 것
    console.log("로그인버튼 누름");

    if (!validateEmail(email)) {
      setErrorMessage("이메일을 올바르게 입력해주세요");
      return;
    }

    if (password === "") {
      setErrorMessage("비밀번호를 입력해주세요");
      return;
    }

    setErrorMessage("");

    navigation.navigate("main");
  };

  return (
    <KeyboardAwareScrollView
      extraScrollHeight={20}
      contentContainerStyle={{ flex: 1 }}
    >
      <Container insets={insets}>
        <Logo style={{ marginBottom: 50 }} />
        <Input
          label="이메일"
          placeholder="example@email.com"
          returnKeyType="next"
          value={email}
          onChangeText={_handleEmailChange}
          containerStyle={{
            width: "100%",
          }}
        />
        <Input
          label="비밀번호"
          returnKeyType="done"
          value={password}
          onChangeText={_handlePasswordChange}
          isPassword={true}
          containerStyle={{
            width: "100%",
          }}
        />
        <LostPw
          title="비밀번호를 잊으셨나요?"
          onPress={() => navigation.navigate("비밀번호 찾기")}
          containerStyle={{ alignItems: "flex-end" }}
        />
        <Button
          title="로그인"
          onPress={_handleSigninBtnPress}
          disabled={disabled}
          containerStyle={{
            width: "100%",
            marginTop: 50,
          }}
        />
        <ErrorMessage message={errorMessage} />
      </Container>

      {!isKeyboardVisible && (
        <FooterContainer>
          <Button
            title="아직 회원이 아니시라면?"
            onPress={() => navigation.navigate("회원가입")}
            containerStyle={{
              height: 25,
              marginTop: 0,
              marginBottom: 0,
              paddingTop: 0,
              paddingBottom: 0,
              backgroundColor: "transparent",
            }}
            textStyle={{
              color: theme.colors.grey,
              fontSize: 15,
              fontFamily: theme.fonts.regular,
            }}
          />
          <Button
            title="이메일로 회원가입"
            onPress={() => navigation.navigate("회원가입")}
            containerStyle={{
              height: 25,
              marginTop: 0,
              marginBottom: 0,
              paddingTop: 0,
              paddingBottom: 0,
              backgroundColor: "transparent",
            }}
            textStyle={{
              color: theme.colors.black,
              fontSize: 16,
              fontFamily: theme.fonts.bold,
            }}
          />
        </FooterContainer>
      )}
    </KeyboardAwareScrollView>
  );
};

export default SigninWithEmail;
