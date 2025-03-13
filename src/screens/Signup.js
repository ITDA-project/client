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
  padding-bottom: ${({ insets: { bottom } }) => bottom}px;
`;
const EmailContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
const Gender = styled.View`
  width: 100%;
  margin-bottom: 30px;
`;
const Label = styled.Text`
  font-size: 15px;
  margin-bottom: 15px;
  color: ${({ theme }) => theme.colors.grey};
  font-family: ${({ theme }) => theme.fonts.regular};
`;
const GenderContainer = styled.View`
  flex-direction: row;
  width: 100%;
`;
const GenderOption = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-right: 100px;
`;
const GenderCircle = styled.View`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  border-width: 2px;
  border-color: ${({ theme, selected }) =>
    selected ? theme.colors.mainBlue : theme.colors.grey};
  align-items: center;
  justify-content: center;
  margin-right: 10px;
`;
const GenderInnerCircle = styled.View`
  width: 12px;
  height: 12px;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.colors.mainBlue};
`;
const GenderLabel = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.black};
`;

const Signup = () => {
  const insets = useSafeAreaInsets();
  const theme = useContext(ThemeContext);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordConfirmErrorMessage, setPasswordConfirmErrorMessage] =
    useState("");
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    setDisabled(
      !(
        email &&
        name &&
        password &&
        passwordConfirm &&
        phone &&
        gender &&
        !emailErrorMessage &&
        !passwordConfirmErrorMessage
      )
    );
  }, [
    email,
    name,
    password,
    passwordConfirm,
    phone,
    gender,
    emailErrorMessage,
    passwordConfirmErrorMessage,
  ]);

  const _handleEmailChange = (email) => {
    let changeEmail = removeWhitespace(email);

    // 한글 제거 (정규식)
    changeEmail = changeEmail.replace(/[ㄱ-ㅎㅏ-ㅣ가-힣]/g, "");

    setEmail(changeEmail);

    setEmailErrorMessage(
      validateEmail(changeEmail) ? "" : "이메일을 올바르게 입력해주세요"
    );
  };

  const _handleNameChange = (name) => {
    const changeName = removeWhitespace(name);
    setName(changeName);
  };

  const _handlePasswordChange = (password) => {
    const changePassword = removeWhitespace(password);
    setPassword(changePassword);
  };

  const _handlePasswordConfirmChange = (passwordConfirm) => {
    const changePasswordConfirm = removeWhitespace(passwordConfirm);
    setPasswordConfirm(changePasswordConfirm);

    setPasswordConfirmErrorMessage(
      password !== changePasswordConfirm ? "비밀번호가 일치하지 않습니다" : ""
    );
  };

  // 전화번호 핸들러 - 숫자만, 010으로 시작, 11자리 제한
  const _handlePhoneChange = (phone) => {
    let changePhone = phone.replace(/[^0-9]/g, "");

    if (!changePhone.startsWith("010")) {
      changePhone = "010";
    }

    if (changePhone.length > 11) {
      changePhone = changePhone.slice(0, 11);
    }

    setPhone(changePhone);
  };

  return (
    <KeyboardAwareScrollView
      extraScrollHeight={20}
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
    >
      <Container insets={insets}>
        <EmailContainer>
          <Input
            label="이메일"
            placeholder="example@email.com"
            returnKeyType="next"
            value={email}
            onChangeText={_handleEmailChange}
            containerStyle={{
              marginRight: 7,
              width: "77%",
            }}
          />
          <Button
            title="중복확인"
            onPress={() => console.log("중복확인")} //백이랑 연결하면 로직 추가. alert?
            disabled={!email || !!emailErrorMessage}
            containerStyle={{
              width: 70,
              alignItems: "center",
              justifyContents: "center",
              height: 50,
              backgroundColor: theme.colors.mainBlue,
              marginTop: 32,
              paddingTop: 0,
              paddingBottom: 0,
              paddingLeft: 0,
              paddingRight: 8,
            }}
            textStyle={{
              color: theme.colors.white,
              fontSize: 15,
              fontFamily: theme.fonts.bold,
            }}
          />
        </EmailContainer>
        <ErrorMessage
          message={emailErrorMessage}
          containerStyle={{ position: "absolute" }}
        />
        <Input
          label="이름"
          returnKeyType="next"
          value={name}
          onChangeText={_handleNameChange}
          containerStyle={{
            width: "100%",
            paddingBottom: 17,
          }}
        />
        <Input
          label="비밀번호"
          returnKeyType="next"
          value={password}
          onChangeText={_handlePasswordChange}
          isPassword={true}
          containerStyle={{
            width: "100%",
            paddingBottom: 17,
          }}
        />
        <Input
          label="비밀번호 확인"
          returnKeyType="next"
          value={passwordConfirm}
          onChangeText={_handlePasswordConfirmChange}
          isPassword={true}
          containerStyle={{
            width: "100%",
          }}
        />
        <ErrorMessage
          message={passwordConfirmErrorMessage}
          containerStyle={{
            position: "absolute",
            left: 40,
          }}
        />
        <Input
          label="전화번호"
          placeholder="01012345678"
          returnKeyType="done"
          value={phone}
          onChangeText={_handlePhoneChange}
          containerStyle={{
            width: "100%",
            paddingBottom: 17,
          }}
        />
        <Gender>
          <Label>성별</Label>
          <GenderContainer>
            <GenderOption onPress={() => setGender("여성")}>
              <GenderCircle selected={gender === "여성"}>
                {gender === "여성" && <GenderInnerCircle />}
              </GenderCircle>
              <GenderLabel>여성</GenderLabel>
            </GenderOption>

            <GenderOption onPress={() => setGender("남성")}>
              <GenderCircle selected={gender === "남성"}>
                {gender === "남성" && <GenderInnerCircle />}
              </GenderCircle>
              <GenderLabel>남성</GenderLabel>
            </GenderOption>
          </GenderContainer>
        </Gender>

        <Button
          title="가입"
          onPress={() => console.log("가입")}
          disabled={disabled}
          containerStyle={{
            width: "100%",
          }}
        />
      </Container>
    </KeyboardAwareScrollView>
  );
};

export default Signup;
