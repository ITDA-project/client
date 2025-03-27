import React, { useState, useEffect } from "react";
import { Input, Button } from "../components";
import styled from "styled-components/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Container = styled.View`
  flex: 1;
  justify-content: flex-start;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.white};
  padding: 0 30px;
  padding-bottom: ${({ insets: { bottom } }) => bottom}px;
`;

const ApplicationDecision = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const [form, setForm] = useState("");
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    setDisabled(form.trim().length === 0);
  }, [form]);

  return (
    <Container insets={insets}>
      <Input
        returnKeyType="done"
        value={form}
        onChangeText={(text) => setForm(text)}
        placeholder="자기소개 및 지원동기"
        containerStyle={{ width: "100%" }}
        textStyle={{ height: 230 }}
        multiline={true}
        numberOfLines={10}
      />
      <Button
        title="제출"
        onPress={() => console.log("제출")}
        disabled={disabled}
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

export default ApplicationDecision;
