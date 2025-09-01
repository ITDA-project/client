import React, { useState, useEffect } from "react";
import { Input, Button, AlertModal } from "../components";
import styled from "styled-components/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";

// ✅ 1. 분리된 API 함수를 가져옵니다.
import { submitApplicationAPI } from "../api/applications";

// ❌ 아래 import는 더 이상 이 파일에 필요 없습니다.
// import axios from "axios";
// import EncryptedStorage from "react-native-encrypted-storage";

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
  const { postId, onComplete } = route.params;

  const [form, setForm] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [onConfirmAction, setOnConfirmAction] = useState(null);

  useEffect(() => {
    setDisabled(form.trim().length === 0);
  }, [form]);

  // ✅ 2. handleSubmit 함수가 훨씬 깔끔해집니다.
  const handleSubmit = async () => {
    try {
      // 이제 api.js의 인터셉터가 토큰을 자동으로 처리해주므로
      // EncryptedStorage에서 직접 토큰을 가져올 필요가 없습니다.
      await submitApplicationAPI(postId, { content: form });

      setAlertMessage("지원서가 성공적으로 제출되었습니다.");
      setOnConfirmAction(() => () => {
        if (onComplete) onComplete();
        navigation.goBack();
      });
      setAlertVisible(true);
    } catch (error) {
      // api.js의 인터셉터가 401 에러(토큰 없음, 만료 등)를 받으면
      // 로그인 화면으로 보내는 등의 처리를 할 수 있습니다.
      // 여기서는 서버에서 오는 메시지 기반으로 분기 처리합니다.
      const message = error?.response?.data?.message || error.message;
      console.error("신청서 제출 실패:", message);

      if (message.includes("이미 신청폼을 제출")) {
        setAlertMessage("이미 해당 모임에 신청서를 제출하셨습니다.");
      } else if (error.response?.status === 401) {
        setAlertMessage("로그인이 필요합니다.");
        setOnConfirmAction(() => () => navigation.navigate("Login"));
      } else {
        setAlertMessage("제출 중 문제가 발생했습니다.");
      }
      setAlertVisible(true);
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
      <AlertModal
        visible={alertVisible}
        message={alertMessage}
        onConfirm={() => {
          setAlertVisible(false);
          if (onConfirmAction) {
            onConfirmAction();
            setOnConfirmAction(null); // 액션 실행 후 초기화
          }
        }}
      />
    </Container>
  );
};

export default ApplicationForm;
