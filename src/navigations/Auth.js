import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ThemeContext } from "styled-components/native";
import Signin from "../screens/Signin";
import SigninWithEmail from "../screens/SigninWithEmail";
import Signup from "../screens/Signup";
import FindPw from "../screens/FindPw";
import SignupDone from "../screens/SignupDone";
import DeleteAccount from "../screens/DeleteAccount";
import { MaterialIcons } from "@expo/vector-icons";

const Stack = createStackNavigator();

const Auth = () => {
  const theme = useContext(ThemeContext);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.white,
          elevation: 0, // 안드로이드 그림자 제거
          shadowOpacity: 0, // iOS 그림자 제거
          borderBottomWidth: 0, // iOS 선 제거
        },
        headerTitleAlign: "center",
        headerBackTitleVisible: false,
        headerTintColor: theme.colors.black,
        headerTitleStyle: {
          fontFamily: theme.fonts.bold,
          fontSize: 16,
        },
        headerLeft: ({ onPress, tintColor }) => <MaterialIcons name="keyboard-arrow-left" size={38} color={tintColor} onPress={onPress} />,
      }}
    >
      <Stack.Screen name="로그인" component={Signin} />
      <Stack.Screen name="이메일로 시작하기" component={SigninWithEmail} />
      <Stack.Screen name="회원가입" component={Signup} />
      <Stack.Screen name="비밀번호 찾기" component={FindPw} />
      <Stack.Screen
        name="회원가입 완료"
        component={SignupDone}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="회원탈퇴" component={DeleteAccount} />
    </Stack.Navigator>
  );
};

export default Auth;
