import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";

const RequireAuth = ({ children }) => {
  const { user } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (!user) {
      navigation.navigate("로그인"); // 로그인 안 되어 있으면 로그인 화면으로 이동
    }
  }, [user, navigation]);

  return user ? children : null;
};

export default RequireAuth;

// 로그인 해야만 접근 할 수 있는 페이지를 <RequireAuth> 로 감싸야 함
