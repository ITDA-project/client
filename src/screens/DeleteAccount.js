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
const HighlightText2 = styled.Text`
  color: ${({ theme }) => theme.colors.red};
`;

const DeleteAccount = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const theme = useContext(ThemeContext);

  return (
    <KeyboardAwareScrollView
      extraScrollHeight={20}
      contentContainerStyle={{ flex: 1 }}
    >
      <Container insets={insets}>
        <MessageText>
          <HighlightText>모아모아</HighlightText>와 함께한 시간들이
        </MessageText>
        <MessageText>아쉬우셨나요?</MessageText>
        <MessageText style={{ marginTop: 50 }}>탈퇴 버튼 선택 시,</MessageText>
        <MessageText>
          계정은 <HighlightText2>삭제</HighlightText2>되며
        </MessageText>
        <MessageText>복구되지 않습니다</MessageText>
      </Container>
      <FooterContainer>
        <Button
          title="탈퇴"
          onPress={() => console.log("탈퇴")} //
          containerStyle={{
            backgroundColor: theme.colors.red,
            width: "100%",
            marginTop: 100,
          }}
        />
      </FooterContainer>
    </KeyboardAwareScrollView>
  );
};

export default DeleteAccount;
