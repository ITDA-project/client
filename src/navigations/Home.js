//탭바 화면

import React, { useContext, useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Image, TouchableOpacity, View, Text } from "react-native";
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
import axios from "axios";
import EncryptedStorage from "react-native-encrypted-storage";

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

  const [unreadCount, setUnreadCount] = useState(0);

  const onReadAll = useCallback(() => {
    setUnreadCount(0);
  }, []);

  const NotificationsWrapper = useCallback((props) => <Notifications {...props} onReadAll={onReadAll} />, [onReadAll]);

  useFocusEffect(
    useCallback(() => {
      const fetchUnread = async () => {
        const token = await EncryptedStorage.getItem("accessToken");
        try {
          const { data } = await axios.get("http://10.0.2.2:8080/api/notifications", {
            headers: { access: token },
          });
          const list = Array.isArray(data?.data) ? data.data : [];
          const count = list.filter((n) => !n.read).length;
          setUnreadCount(count);
        } catch (e) {
          console.log("🔔 알림 가져오기 실패", e);
        }
      };
      fetchUnread();
    }, [])
  );

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
          component={NotificationsWrapper}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={{ width: 24, height: 24 }}>
                <Image
                  source={focused ? NotificationIconActive : NotificationIcon}
                  style={{
                    width: 20,
                    height: 22,
                    tintColor: focused ? theme.tabBlue : theme.grey,
                  }}
                />
                {unreadCount > 0 && (
                  <View
                    style={{
                      position: "absolute",
                      right: -6,
                      top: -4,
                      backgroundColor: "red",
                      borderRadius: 10,
                      minWidth: 16,
                      paddingHorizontal: 4,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={{ color: "white", fontSize: 10, fontWeight: "bold" }}>{unreadCount > 99 ? "99+" : unreadCount}</Text>
                  </View>
                )}
              </View>
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
