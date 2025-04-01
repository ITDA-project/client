import React, { useContext } from "react";
import { Button } from "../components";
import styled, { ThemeContext } from "styled-components/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.white};
  padding: 0 30px;
  padding-bottom: ${({ insets: { bottom } }) => bottom + 50}px;
`;
const FooterContainer = styled.View`
  position: absolute;
  padding: 0 30px;
  bottom: 0;
  padding-bottom: 50px;
  align-items: center;
  width: 100%;
`;
const MessageText = styled.Text`
  margin-top: 10px;
  color: ${({ theme }) => theme.colors.grey};
  font-size: 24px;
  text-align: center;
  font-family: ${({ theme }) => theme.fonts.bold};
`;
const HighlightText = styled.Text`
  color: ${({ theme }) => theme.colors.mainBlue};
`;

const SignupDone = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const theme = useContext(ThemeContext);

  return (
    <KeyboardAwareScrollView extraScrollHeight={20} contentContainerStyle={{ flex: 1 }}>
      <Container insets={insets}>
        <MessageText>회원가입이 완료되었습니다!</MessageText>

        <MessageText>
          <HighlightText>모아모아</HighlightText>와 함께
        </MessageText>

        <MessageText>즐거운 모임을 즐겨보아요</MessageText>
      </Container>
      <FooterContainer>
        <Button
          title="확인"
          onPress={() => navigation.pop(3)}
          containerStyle={{
            width: "100%",
            marginTop: 100,
          }}
          textStyle={{ marginLeft: 0 }}
        />
      </FooterContainer>
    </KeyboardAwareScrollView>
  );
};

export default SignupDone;
