//탭바 화면

import React, { useContext } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { ThemeContext } from "styled-components/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { MainPage, Search, ChatList, Notifications, MyPage } from "../screens";
import useRequireLogin from "../hooks/useRequireLogin";
import homeIcon from "../../assets/icons/homeIcon.png";
import searchIcon from "../../assets/icons/searchIcon.png";
import chatIcon from "../../assets/icons/chatIcon.png";
import NotificationIcon from "../../assets/icons/NotificationIcon.png";
import profileIcon from "../../assets/icons/profileIcon.png";
import homeIconActive from "../../assets/icons/homeIcon_.png";
import searchIconActive from "../../assets/icons/searchIcon_.png";
import chatIconActive from "../../assets/icons/chatIcon_.png";
import NotificationIconActive from "../../assets/icons/NotificationIcon_.png";
import profileIconActive from "../../assets/icons/profileIcon_.png";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChatMain" component={Chat} />
      <Stack.Screen name="NotiMain" component={Notifications} />
      <Stack.Screen name="MyPageMain" component={MyPage} />
    </Stack.Navigator>
  );
};

const Home = () => {
  const theme = useContext(ThemeContext);
  const { checkLogin, LoginAlert } = useRequireLogin();

  return (
    <>
      <Tab.Navigator
        initialRouteName="MainPage"
        screenOptions={{
          tabBarShowLabel: false,
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="MainPage"
          component={MainPage}
          options={{
            tabBarIcon: ({ focused }) => (
              <Image
                source={focused ? homeIconActive : homeIcon} // 클릭되었을 때 이미지 변경
                style={{
                  width: 20,
                  height: 22,
                  tintColor: focused ? theme.tabBlue : theme.grey,
                }}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Search"
          component={Search}
          options={{
            tabBarIcon: ({ focused }) => (
              <Image
                source={focused ? searchIconActive : searchIcon} // 클릭되었을 때 이미지 변경
                style={{
                  width: 22,
                  height: 22,
                  tintColor: focused ? theme.tabBlue : theme.grey,
                }}
              />
            ),
          }}
        />
        <Tab.Screen
          name="ChatList"
          component={ChatList}
          options={{
            tabBarIcon: ({ focused }) => (
              <Image
                source={focused ? chatIconActive : chatIcon} // 클릭되었을 때 이미지 변경
                style={{
                  width: 22,
                  height: 22,
                  tintColor: focused ? theme.tabBlue : theme.grey,
                }}
              />
            ),
            tabBarButton: (props) => (
              <TouchableOpacity
                {...props}
                onPress={() => {
                  const isLoggedIn = checkLogin("Chat"); // 로그인 확인
                  if (isLoggedIn) props.onPress(); // 로그인 되어 있으면 기본 동작 수행
                }}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Notifications"
          component={Notifications}
          options={{
            tabBarIcon: ({ focused }) => (
              <Image
                source={focused ? NotificationIconActive : NotificationIcon} // 클릭되었을 때 이미지 변경
                style={{
                  width: 20,
                  height: 22,
                  tintColor: focused ? theme.tabBlue : theme.grey,
                }}
              />
            ),
            tabBarButton: (props) => (
              <TouchableOpacity
                {...props}
                onPress={() => {
                  const isLoggedIn = checkLogin("Notifications"); // 로그인 확인
                  if (isLoggedIn) props.onPress(); // 로그인 되어 있으면 기본 동작 수행
                }}
              />
            ),
          }}
        />
        <Tab.Screen
          name="MyPage"
          component={MyPage}
          options={{
            tabBarIcon: ({ focused }) => (
              <Image
                source={focused ? profileIconActive : profileIcon} // 클릭되었을 때 이미지 변경
                style={{
                  width: 20,
                  height: 22,
                  tintColor: focused ? theme.tabBlue : theme.grey,
                }}
              />
            ),
            tabBarButton: (props) => (
              <TouchableOpacity
                {...props}
                onPress={() => {
                  const isLoggedIn = checkLogin("MyPage"); // 로그인 확인
                  if (isLoggedIn) props.onPress(); // 로그인 되어 있으면 기본 동작 수행
                }}
              />
            ),
          }}
        />
      </Tab.Navigator>
      <LoginAlert />
    </>
  );
};

export default Home;
