import React from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../contexts/AuthContext";

const useRequireLogin = () => {
  const navigation = useNavigation();
  const { user } = useAuth(); // ✅ AuthContext에서 유저 정보 가져오기

  const checkLogin = (nextScreen, params = {}) => {
    if (!user) {
      // 로그인 안 되어 있으면
      Alert.alert("로그인이 필요합니다", "이 기능을 사용하려면 로그인이 필요합니다. 로그인하시겠습니까?", [
        { text: "취소", style: "cancel" },
        { text: "로그인", onPress: () => navigation.navigate("로그인") },
      ]);
      return false;
    }
    navigation.navigate(nextScreen, params); // 로그인되어 있으면 다음 화면으로 이동
    return true;
  };

  return checkLogin;
};

export default useRequireLogin;
