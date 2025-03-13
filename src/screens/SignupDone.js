import React from "react";
import { Button } from "../components";
import styled from "styled-components/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.white};
  padding: 0 30px;
  padding-top: ${({ insets: { top } }) => top}px;
  padding-bottom: ${({ insets: { bottom } }) => bottom + 50}px;
`;

const SignupDone = ({ navigation }) => {
  return (
    <Container>
      <Button title="확인" onPress={() => navigation.navigate("메인")} />
    </Container>
  );
};

export default SignupDone;
