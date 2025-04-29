import React, { useContext } from "react";
import { ThemeContext } from "styled-components/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as Screens from "../screens/index";
import Home from "./Home";
import { MaterialIcons } from "@expo/vector-icons";

const Stack = createStackNavigator();

const Main = () => {
  const theme = useContext(ThemeContext);

  return (
    <Stack.Navigator
      initialRouteName="Home"
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
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Stack.Screen name="PostDetail" component={Screens.PostDetail} options={{ headerTitle: "" }} />
      <Stack.Screen name="MyPostDetail" component={Screens.MyPostDetail} options={{ headerTitle: "" }} />
      <Stack.Screen name="전체글" component={Screens.AllPosts} />
      <Stack.Screen name="프로필" component={Screens.Profile} />
      <Stack.Screen name="공개프로필" component={Screens.PublicProfile} />
      <Stack.Screen name="사진/경력 수정" component={Screens.EditProfile} />
      <Stack.Screen name="모임생성" component={Screens.CreatePost} />

      <Stack.Screen name="로그인" component={Screens.Signin} />
      <Stack.Screen name="이메일로 시작하기" component={Screens.SigninWithEmail} />
      <Stack.Screen name="회원가입" component={Screens.Signup} />
      <Stack.Screen name="비밀번호 찾기" component={Screens.FindPw} />
      <Stack.Screen
        name="회원가입 완료"
        component={Screens.SignupDone}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="모임수정"
        component={Screens.EditPost}
        options={{
          headerTitleAlign: "center",
          headerBackTitleVisible: false,
          headerTintColor: theme.colors.black,
          headerTitleStyle: {
            fontFamily: theme.fonts.bold,
            fontSize: 16,
          },
          headerLeft: ({ onPress, tintColor }) => <MaterialIcons name="keyboard-arrow-left" size={38} color={tintColor} onPress={onPress} />,
        }}
      />

      <Stack.Screen name="회원탈퇴" component={Screens.DeleteAccount} />

      <Stack.Screen name="신청서 목록" component={Screens.ApplicationList} />
      <Stack.Screen name="신청서 작성" component={Screens.ApplicationForm} />
      <Stack.Screen name="신청서 확인" component={Screens.ApplicationDecision} />

      <Stack.Screen name="리뷰 등록" component={Screens.ReviewForm} />
      <Stack.Screen name="채팅방" component={Screens.Chat} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default Main;
