import React, { useContext } from "react";
import { Image, View } from "react-native";
import { ThemeContext } from "styled-components/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MainPage, Search, Chat, Notifications, MyPage } from "../screens";
import {
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
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

const Home = () => {
  const theme = useContext(ThemeContext);

  return (
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
        name="Chat"
        component={Chat}
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
        }}
      />
    </Tab.Navigator>
  );
};

export default Home;
