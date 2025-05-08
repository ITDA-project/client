import React, { useState, useEffect } from "react";
import { Alert } from "react-native";
import { Input, Button } from "../components";
import styled from "styled-components/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import axios from "axios";
import EncryptedStorage from "react-native-encrypted-storage";
import { useRoute } from "@react-navigation/native";

const Container = styled.View`
  flex: 1;
  justify-content: flex-start;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.white};
  padding: 0 30px;
  padding-bottom: ${({ insets: { bottom } }) => bottom}px;
`;

const ApplicationForm = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const { postId } = route.params;

  const [form, setForm] = useState("");
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    setDisabled(form.trim().length === 0);
  }, [form]);

  const handleSubmit = async () => {
    try {
      const accessToken = await EncryptedStorage.getItem("accessToken");

      console.log("Access Token:", accessToken);

      if (!accessToken) {
        Alert.alert("로그인 필요", "로그인이 필요합니다.", [{ text: "확인", onPress: () => navigation.navigate("Login") }]);
        return;
      }
      const response = await axios.post(
        `http://10.0.2.2:8080/api/posts/${postId}/form`,
        { content: form },
        {
          headers: {
            access: accessToken,
            "Content-Type": "application/json",
          },
        }
      );

      Alert.alert("지원서 제출 완료", "지원서가 성공적으로 제출되었습니다.", [{ text: "확인", onPress: () => navigation.goBack() }]);
    } catch (error) {
      const message = error?.response?.data?.message || error.message;

      console.error("신청서 제출 실패:", message);

      if (message.includes("이미 신청폼을 제출")) {
        Alert.alert("중복 제출", "이미 해당 모임에 신청서를 제출하셨습니다.");
      } else {
        Alert.alert("에러", "제출 중 문제가 발생했습니다.");
      }
    }
  };

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
        onPress={handleSubmit}
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

export default ApplicationForm;
