import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../contexts/AuthContext";

const useRequireLogin = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const tabScreens = ["MyPage", "ChatList", "Notifications"];

  const checkLogin = (nextScreen, params = {}) => {
    console.log("이동 요청:", nextScreen);

    if (!user) {
      console.log("로그인 안됨! 로그인 모달 표시");
      setLoginModalVisible(true); // 모달 상태만 true로 변경
      return false;
    }

    console.log("로그인 상태! 네비게이션 이동: ", nextScreen);
    if (tabScreens.includes(nextScreen)) {
      navigation.navigate("Home", { screen: nextScreen });
    } else {
      navigation.navigate(nextScreen, params);
    }
    return true;
  };

  return {
    checkLogin,
    loginModalVisible,
    setLoginModalVisible,
  };
};

export default useRequireLogin;
