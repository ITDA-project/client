import React, { useState, useContext, useEffect } from "react";
import { Button, ErrorMessage, AlertModal, Input } from "../components";
import styled, { ThemeContext } from "styled-components/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { validateEmail, removeWhitespace } from "../utils/utils";

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
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [authNum, setAuthNum] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordConfirmErrorMessage, setPasswordConfirmErrorMessage] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [isAuthVerified, setIsAuthVerified] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [isPwChanged, setIsPwChanged] = useState(false);

  useEffect(() => {
    setDisabled(!(email && authNum && password && passwordConfirm && !emailErrorMessage && !passwordConfirmErrorMessage && isAuthVerified));
  }, [email, authNum, password, passwordConfirm, emailErrorMessage, passwordConfirmErrorMessage, isAuthVerified]);

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const _handleEmailChange = (email) => {
    let changeEmail = removeWhitespace(email);

    // 한글 제거 (정규식)
    changeEmail = changeEmail.replace(/[ㄱ-ㅎㅏ-ㅣ가-힣]/g, "");

    setEmail(changeEmail);

    setEmailErrorMessage(validateEmail(changeEmail) ? "" : "이메일을 올바르게 입력해주세요");
  };

  const _handleAuthNumChange = (authNum) => {
    let changeAuthNum = authNum.replace(/[^0-9]/g, "");

    if (changeAuthNum.length > 6) {
      changeAuthNum = changeAuthNum.slice(0, 6);
    }

    setAuthNum(changeAuthNum);
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
              width: "74%",
            }}
          />
          <Button
            title={resendTimer > 0 ? `${resendTimer}초` : "전송"}
            onPress={async () => {
              try {
                const response = await fetch("http://10.0.2.2:8080/api/auth/password/find", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ email }),
                });

                const result = await response.json();

                if (response.ok) {
                  setAlertMessage(result.message);
                  setAlertVisible(true);
                  setResendTimer(180);
                } else {
                  setAlertMessage("이메일 전송에 실패했습니다.");
                  setAlertVisible(true);
                }
              } catch (error) {
                setAlertMessage(error.message);
                setAlertVisible(true);
              }
            }}
            disabled={!email || !!emailErrorMessage || resendTimer > 0}
            containerStyle={{
              width: 80,
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
        <RowContainer style={{ marginBottom: 17 }}>
          <Input
            label="인증번호"
            returnKeyType="next"
            value={authNum}
            onChangeText={_handleAuthNumChange}
            editable={!isAuthVerified}
            containerStyle={{
              marginRight: 7,
              width: "74%",
            }}
          />
          <Button
            title="확인"
            onPress={async () => {
              try {
                const response = await fetch("http://10.0.2.2:8080/api/auth/password/otp", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ email, otp: authNum }),
                });

                const result = await response.json();

                if (response.ok && result.data === true) {
                  setIsAuthVerified(true);
                  setAlertMessage(result.message);
                  setAlertVisible(true);
                } else {
                  setAlertMessage("올바르지 않은 번호입니다");
                  setAlertVisible(true);
                }
              } catch (error) {
                setAlertMessage(error.message);
                setAlertVisible(true);
              }
            }}
            disabled={isAuthVerified || !email || !!emailErrorMessage || authNum.length !== 6}
            containerStyle={{
              width: 80,
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
          onPress={async () => {
            try {
              const response = await fetch("http://10.0.2.2:8080/api/auth/password/find", {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
              });

              if (response.ok) {
                setIsPwChanged(true);
                setAlertMessage("비밀번호 변경 성공");
                setAlertVisible(true);
              } else {
                setAlertMessage("비밀번호 변경 실패");
                setAlertVisible(true);
              }
            } catch (error) {
              setAlertMessage(error.message);
              setAlertVisible(true);
            }
          }}
          disabled={disabled}
          containerStyle={{
            width: "100%",
            marginTop: 60,
          }}
          textStyle={{ marginLeft: 0 }}
        />
        <AlertModal
          visible={alertVisible}
          message={alertMessage}
          onConfirm={() => {
            setAlertVisible(false);
            if (isPwChanged) {
              setIsPwChanged(false);
              navigation.pop(1);
            }
          }}
        />
      </Container>
    </KeyboardAwareScrollView>
  );
};

export default FindPw;
