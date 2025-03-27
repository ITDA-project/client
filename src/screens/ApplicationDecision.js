import React, { useContext } from "react";
import { Button } from "../components";
import styled, { ThemeContext } from "styled-components/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Container = styled.View`
  flex: 1;
  justify-content: flex-start;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.white};
  padding: 0 30px;
  padding-bottom: ${({ insets: { bottom } }) => bottom}px;
`;
const ProfileContainer = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-top: 30px;
  margin-bottom: 10px;
`;
const ProfileImage = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  margin-right: 20px;
  margin-bottom: 20px;
`;
const NameText = styled.Text`
  font-size: 16px;
  font-family: ${({ theme }) => theme.fonts.bold};
  color: ${({ theme }) => theme.colors.black};
  margin-bottom: 20px;
`;
const Form = styled.Text`
  width: 100%;
  font-size: 15px;
  font-family: ${({ theme }) => theme.fonts.regular};
  justify-content: flex-start;
  align-items: flex-start;
  margin-bottom: 30px;
  line-height: 23px;
`;
const ButtonContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const ApplicationDecision = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const theme = useContext(ThemeContext);

  const { name, image } = route.params;

  return (
    <Container insets={insets}>
      <ProfileContainer>
        <ProfileImage source={image} />
        <NameText>{name}</NameText>
      </ProfileContainer>
      <Form>
        안녕하세요 저는 {name}입니다.{"\n"}쉬는 날 뜨개질을 하며 쉬는 게 취미인데{"\n"}다른 분들과 함께 공유하며 하고 싶어서{"\n"}신청했어요!
      </Form>

      <ButtonContainer>
        <Button
          title="수락"
          onPress={() => console.log("수락")}
          containerStyle={{
            width: 82,
            height: 35,
            marginTop: 20,
            marginBottom: 0,
            marginRight: 50,
            paddingTop: 0,
            paddingBottom: 0,
          }}
          textStyle={{ marginLeft: 0, fontSize: 16 }}
        />
        <Button
          title="거절"
          onPress={() => console.log("거절")}
          containerStyle={{
            width: 82,
            height: 35,
            marginTop: 20,
            marginBottom: 0,
            paddingTop: 0,
            paddingBottom: 0,
            backgroundColor: theme.colors.lightBlue,
          }}
          textStyle={{ marginLeft: 0, fontSize: 16, color: theme.colors.black }}
        />
      </ButtonContainer>
    </Container>
  );
};

export default ApplicationDecision;
