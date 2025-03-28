import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ThemeContext } from "styled-components/native";
import ApplicationForm from "../screens/ApplicationForm";
import ApplicationList from "../screens/ApplicationList";
import ApplicationDecision from "../screens/ApplicationDecision";
import { MaterialIcons } from "@expo/vector-icons";

const Stack = createStackNavigator();

const Application = () => {
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
      <Stack.Screen name="신청서 목록" component={ApplicationList} />
      <Stack.Screen name="신청서 작성" component={ApplicationForm} />
      <Stack.Screen name="신청서 확인" component={ApplicationDecision} />
    </Stack.Navigator>
  );
};

export default Application;
