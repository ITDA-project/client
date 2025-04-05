import React, { useState, useContext, useEffect } from "react";
import { Button, ErrorMessage } from "../components";
import Input from "../components/Input";
import styled, { ThemeContext } from "styled-components/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { validateEmail, removeWhitespace } from "../utils";
import axios from "axios";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.white};
  padding: 0 30px;
  padding-bottom: ${({ insets: { bottom } }) => bottom}px;
`;
const RowContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const FindPw = () => {
  const insets = useSafeAreaInsets();
  const theme = useContext(ThemeContext);

  const [email, setEmail] = useState("");
  const [authNum, setAuthNum] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordConfirmErrorMessage, setPasswordConfirmErrorMessage] = useState("");
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    setDisabled(!(email && authNum && password && passwordConfirm && !emailErrorMessage && !passwordConfirmErrorMessage));
  }, [email, authNum, password, passwordConfirm, emailErrorMessage, passwordConfirmErrorMessage]);

  const _handleEmailChange = (email) => {
    let changeEmail = removeWhitespace(email);

    // 한글 제거 (정규식)
    changeEmail = changeEmail.replace(/[ㄱ-ㅎㅏ-ㅣ가-힣]/g, "");

    setEmail(changeEmail);

    setEmailErrorMessage(validateEmail(changeEmail) ? "" : "이메일을 올바르게 입력해주세요");
    //등록된 이메일이 아닙니다. 오류 메세지 백이랑 연결 시 추가
  };

  const sendEmailOtp = async () => {
    try {
      const res = await axios.post("http://10.0.2.2:8080/api/auth/password/find", {
        email,
      });

      // 여기서 상태 코드나 응답 구조를 보고 체크해줘야 해
      if (res.status === 200) {
        alert("이메일로 인증번호를 전송했습니다.");
      } else {
        alert("이메일 전송에 실패했습니다.");
      }
    } catch (err) {
      console.log("인증번호 전송 에러:", err.response?.data || err.message);
      alert("인증번호 전송 실패");
    }
  };

  const _handleAuthNumChange = (authNum) => {
    let changeAuthNum = authNum.replace(/[^0-9]/g, "");

    if (changeAuthNum.length > 6) {
      changeAuthNum = changeAuthNum.slice(0, 6);
    }

    setAuthNum(changeAuthNum);
  };

  const verifyOtp = async () => {
    try {
      const res = await axios.patch("http://10.0.2.2:8080/api/auth/password/find", {
        email,
        otpNumber: parseInt(authNum),
        password,
      });

      if (res.data.success) {
        alert("인증번호가 확인되었습니다.");
      } else {
        alert("인증번호가 일치하지 않습니다.");
      }
    } catch (err) {
      alert("인증번호 확인 실패");
    }
  };

  const _handlePasswordChange = (password) => {
    const changePassword = removeWhitespace(password);

    setPassword(changePassword);
  };

  const _handlePasswordConfirmChange = (passwordConfirm) => {
    const changePasswordConfirm = removeWhitespace(passwordConfirm);
    setPasswordConfirm(changePasswordConfirm);

    setPasswordConfirmErrorMessage(password !== changePasswordConfirm ? "비밀번호가 일치하지 않습니다" : "");
  };

  const ChangeBtn = () => {
    console.log("변경버튼 누름");
  };

  return (
    <KeyboardAwareScrollView extraScrollHeight={20} contentContainerStyle={{ flex: 1 }}>
      <Container insets={insets}>
        <RowContainer>
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
            title="전송"
            onPress={sendEmailOtp}
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
              color: theme.colors.white,
              fontSize: 15,
              fontFamily: theme.fonts.bold,
              marginLeft: 0,
            }}
          />
        </RowContainer>
        <ErrorMessage message={emailErrorMessage} containerStyle={{ position: "absolute" }} />

        <RowContainer style={{ paddingBottom: 17 }}>
          <Input
            label="인증번호"
            returnKeyType="next"
            value={authNum}
            onChangeText={_handleAuthNumChange}
            containerStyle={{
              marginRight: 7,
              width: "77%",
            }}
          />
          <Button
            title="확인"
            onPress={verifyOtp} // 업데이트되면 변경
            disabled={!authNum}
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
              color: theme.colors.white,
              fontSize: 15,
              fontFamily: theme.fonts.bold,
              marginLeft: 0,
            }}
          />
        </RowContainer>
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
        <Button
          title="변경"
          onPress={ChangeBtn}
          disabled={disabled}
          containerStyle={{
            width: "100%",
            marginTop: 60,
          }}
          textStyle={{ marginLeft: 0 }}
        />
      </Container>
    </KeyboardAwareScrollView>
  );
};

export default FindPw;
