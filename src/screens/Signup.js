import React, { useState, useContext, useEffect } from "react";
import { Button, ErrorMessage } from "../components";
import Input from "../components/Input";
import styled, { ThemeContext } from "styled-components/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { validateEmail, removeWhitespace } from "../utils";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.white};
  padding: 0 30px;
  padding-top: ${({ insets: { top } }) => top}px;
  padding-bottom: ${({ insets: { bottom } }) => bottom}px;
`;
const EmailContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const Signup = () => {
  const insets = useSafeAreaInsets();
  const theme = useContext(ThemeContext);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [phone, setPhone] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <KeyboardAwareScrollView
      extraScrollHeight={20}
      contentContainerStyle={{ flex: 1 }}
    >
      <Container insets={insets}>
        <EmailContainer>
          <Input
            label="이메일"
            placeholder="example@email.com"
            returnKeyType="next"
            value={email}
            containerStyle={{
              marginRight: 100,
            }}
          />
          <Button
            title="중복확인"
            onPress={() => console.log("중복확인")}
            containerStyle={{
              width: 80,
              height: 50,
              backgroundColor: theme.colors.mainBlue,
              marginTop: 0,
              marginBottom: 30,
              paddingTop: 0,
              paddingBottom: 0,
              paddingLeft: 0,
              paddingRight: 0,
            }}
            textStyle={{
              color: theme.colors.white,
              fontSize: 15,
              fontFamily: theme.fonts.bold,
            }}
          />
        </EmailContainer>
        <Input
          label="이름"
          returnKeyType="next"
          value={name}
          onChangeText={() => console.log("")}
        />
        <Input
          label="비밀번호"
          returnKeyType="next"
          value={password}
          onChangeText={() => console.log("")}
        />
        <Input
          label="비밀번호 확인"
          returnKeyType="next"
          value={passwordConfirm}
          onChangeText={() => console.log("")}
        />
        <ErrorMessage message={errorMessage} />
        <Input
          label="전화번호"
          returnKeyType="done"
          value={phone}
          onChangeText={() => console.log("")}
        />
        <Button title="가입" />
      </Container>
    </KeyboardAwareScrollView>
  );
};

export default Signup;
