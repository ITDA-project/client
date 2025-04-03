import React, { useContext, useState, useEffect } from "react";
import { Button, Input } from "../components";
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

const ReviewForm = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const theme = useContext(ThemeContext);

  const [form, setForm] = useState("");
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    setDisabled(form.trim().length === 0);
  }, [form]);

  return (
    <Container insets={insets}>
      <ProfileContainer>
        <ProfileImage />
        <NameText></NameText>
      </ProfileContainer>
      <Input
        returnKeyType="done"
        value={form}
        onChangeText={(text) => setForm(text)}
        placeholder="리뷰를 남겨주세요! 어떤 사용자였나요?"
        containerStyle={{ width: "100%" }}
        textStyle={{ height: 230 }}
        multiline={true}
        numberOfLines={10}
      />
      <Button
        title="제출"
        disabled={disabled}
        onPress={() => console.log("제출")}
        containerStyle={{
          width: 82,
          height: 35,
          marginTop: 20,
          marginBottom: 0,
          paddingTop: 0,
          paddingBottom: 0,
        }}
        textStyle={{ marginLeft: 0, fontSize: 16 }}
      />
    </Container>
  );
};

export default ReviewForm;
