import React, { useState, useContext, useEffect } from "react";
import { Button, ErrorMessage, AlertModal } from "../components";
import Input from "../components/Input";
import styled, { ThemeContext } from "styled-components/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { validateEmail, removeWhitespace } from "../utils/utils";
import api from "../api/api";

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
  border-color: ${({ theme, selected }) => (selected ? theme.colors.mainBlue : theme.colors.grey)};
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

const Signup = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const theme = useContext(ThemeContext);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordConfirmErrorMessage, setPasswordConfirmErrorMessage] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  useEffect(() => {
    setDisabled(!(email && name && password && passwordConfirm && phone && gender && !emailErrorMessage && !passwordConfirmErrorMessage));
  }, [email, name, password, passwordConfirm, phone, gender, emailErrorMessage, passwordConfirmErrorMessage]);

  const _handleEmailChange = (email) => {
    let changeEmail = removeWhitespace(email);

    // 한글 제거 (정규식)
    changeEmail = changeEmail.replace(/[ㄱ-ㅎㅏ-ㅣ가-힣]/g, "");

    setEmail(changeEmail);

    setEmailErrorMessage(validateEmail(changeEmail) ? "" : "이메일을 올바르게 입력해주세요");
  };

  const checkEmailDuplicate = async () => {
    try {
      const response = await api.post("/auth/signup/email/checkemail", {
        email: email,
      });

      if (response.data.data === true) {
        setModalMessage("사용 가능한 이메일입니다!");
        setModalVisible(true);
      } else {
        setModalMessage("이미 사용 중인 이메일입니다");
        setModalVisible(true);
      }
    } catch (error) {
      if (error.response) {
        setModalMessage("이미 사용 중인 이메일입니다");
        setModalVisible(true);
      } else {
        setModalMessage("이메일 확인 중 문제가 발생했습니다.");
        setModalVisible(true);
      }
    }
  };

  const _handleNameChange = (name) => {
    const changeName = removeWhitespace(name);
    setName(changeName);
  };

  const _handlePasswordChange = (password) => {
    const changePassword = removeWhitespace(password);
    setPassword(changePassword);

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*[0-9]).{8,}$/;
    if (!passwordRegex.test(changePassword)) {
      setPasswordErrorMessage("영어와 숫자를 혼합한 8자 이상이어야 합니다");
    } else {
      setPasswordErrorMessage("");
    }
  };

  const _handlePasswordConfirmChange = (passwordConfirm) => {
    const changePasswordConfirm = removeWhitespace(passwordConfirm);
    setPasswordConfirm(changePasswordConfirm);

    setPasswordConfirmErrorMessage(password !== changePasswordConfirm ? "비밀번호가 일치하지 않습니다" : "");
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

  const _handleSignup = async () => {
    try {
      const response = await api.post("/auth/signup/email", {
        email,
        name,
        //추후 휴대폰번호 추가 가능성
        password,
        gender,
      });

      console.log("회원가입 성공:", response.data); // 성공 메시지 출력
      navigation.navigate("회원가입 완료");
    } catch (error) {
      if (error.response) {
        // 서버에서 응답이 온 경우
        console.error("서버 오류:", error.response.data); // 서버에서 반환된 오류 메시지
      } else if (error.request) {
        // 서버에 요청을 보냈으나 응답을 받지 못한 경우
        console.error("네트워크 오류:", error.request); // 요청이 전달되지 않았을 때
      } else {
        // 다른 오류
        console.error("오류 발생:", error.message); // 일반적인 오류 메시지
      }
    }
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
            onPress={checkEmailDuplicate}
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
            }}
            textStyle={{
              width: 52,
              color: theme.colors.white,
              fontSize: 15,
              fontFamily: theme.fonts.bold,
              marginLeft: 0,
            }}
          />
        </EmailContainer>
        <ErrorMessage message={emailErrorMessage} containerStyle={{ position: "absolute" }} />
        <Input
          label="이름"
          returnKeyType="next"
          value={name}
          onChangeText={_handleNameChange}
          containerStyle={{
            width: "100%",
            paddingBottom: 17,
            paddingTop: 5,
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
            paddingTop: 5,
            marginBottom: 8,
          }}
        />
        <ErrorMessage message={passwordErrorMessage} />
        <Input
          label="비밀번호 확인"
          returnKeyType="next"
          value={passwordConfirm}
          onChangeText={_handlePasswordConfirmChange}
          isPassword={true}
          containerStyle={{
            width: "100%",
            paddingTop: 5,
            marginBottom: 8,
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
            paddingTop: 5,
          }}
        />
        <Gender>
          <Label>성별</Label>
          <GenderContainer>
            <GenderOption onPress={() => setGender("FEMALE")}>
              <GenderCircle selected={gender === "FEMALE"}>{gender === "FEMALE" && <GenderInnerCircle />}</GenderCircle>
              <GenderLabel>여성</GenderLabel>
            </GenderOption>

            <GenderOption onPress={() => setGender("MALE")}>
              <GenderCircle selected={gender === "MALE"}>{gender === "MALE" && <GenderInnerCircle />}</GenderCircle>
              <GenderLabel>남성</GenderLabel>
            </GenderOption>
          </GenderContainer>
        </Gender>

        <Button
          title="가입"
          onPress={_handleSignup}
          disabled={disabled}
          containerStyle={{
            width: "100%",
          }}
          textStyle={{ marginLeft: 0 }}
        />
        <AlertModal visible={modalVisible} message={modalMessage} onConfirm={() => setModalVisible(false)} />
      </Container>
    </KeyboardAwareScrollView>
  );
};

export default Signup;
