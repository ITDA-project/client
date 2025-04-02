import { useEffect } from "react";
import { Alert } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";

const RequireAuth = ({ children }) => {
  const { user } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (!user) {
      Alert.alert("로그인이 필요합니다", "이 기능을 사용하려면 로그인이 필요합니다. 로그인하시겠습니까?", [
        { text: "취소", style: "cancel" },
        { text: "로그인", onPress: () => navigation.navigate("로그인") },
      ]);
    }
  }, [user, navigation]);

  return user ? children : null;
};

export default RequireAuth;
