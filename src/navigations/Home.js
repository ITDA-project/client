import React,{useContext} from "react";
import {Image,View,Platform} from 'react-native';
import {ThemeContext} from 'styled-components/native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {MainPage,Search,Chat, Notifications,MyPage} from '../screens';
import homeIcon from '../../assets/icons/homeIcon.png';
import searchIcon from '../../assets/icons/searchIcon.png';
import chatIcon from '../../assets/icons/chatIcon.png';
import NotificationIcon from '../../assets/icons/NotificationIcon.png';
import profileIcon from '../../assets/icons/profileIcon.png';
import homeIconActive from '../../assets/icons/homeIcon_.png';
import searchIconActive from '../../assets/icons/searchIcon_.png';
import chatIconActive from '../../assets/icons/chatIcon_.png';
import NotificationIconActive from '../../assets/icons/NotificationIcon_.png';
import profileIconActive from '../../assets/icons/profileIcon_.png';



const Tab=createBottomTabNavigator();

const Home=()=>{ 
    
    const theme=useContext(ThemeContext);

    return(
        <Tab.Navigator initialRouteName="MainPage" 
        screenOptions={{
            tabBarShowLabel: false,
            headerShown: false,
            tabBarStyle: {
            height: Platform.OS === 'ios' ? 80 : 70,
            borderTopWidth: 1,
            borderTopColor: '#c1c1c1', 
            backgroundColor: '#fff', 
            paddingBottom: Platform.OS === 'ios' ? 20 : 10,
            paddingTop: 0,
            marginTop: 0,
            marginBottom: 0,
            left:0,
            right:0,
            bottom:0,
            justifyContent: 'center', // 아이템 사이에 균등한 공간 배분
            alignItems: 'center',    // 수직 중앙 정렬
            },
        }}>
            <Tab.Screen name="MainPage" component={MainPage} 
            options={{
                tabBarIcon: ({focused}) => (
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Image
                    source={focused ? homeIconActive : homeIcon}
                    style={{
                        width: 24,
                        height: 24,
                        tintColor: focused ? theme.tabBlue : theme.grey,
                        top: 10,
                    }} 
                    />
                </View>
                ),
            }}
            />
            <Tab.Screen name="Search" component={Search}
            options={{
                tabBarIcon: ({focused}) => (
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Image
                    source={focused ? searchIconActive : searchIcon}
                    style={{
                        width: 22,
                        height: 22,
                        tintColor: focused ? theme.tabBlue : theme.grey,
                        top:10,
                    }}
                    />
                </View>
                ),
            }}
            />
            <Tab.Screen name="Chat" component={Chat}
            options={{
                tabBarIcon: ({focused}) => (
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Image
                    source={focused ? chatIconActive : chatIcon}
                    style={{
                        width: 22,
                        height: 22,
                        tintColor: focused ? theme.tabBlue : theme.grey,
                        top: 10,
                    }}
                    />
                </View>
                ),
            }}
            />
            <Tab.Screen name="Notifications" component={Notifications}
            options={{
                tabBarIcon: ({focused}) => (
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Image
                    source={focused ? NotificationIconActive : NotificationIcon}
                    style={{
                        width: 20,
                        height: 22,
                        tintColor: focused ? theme.tabBlue : theme.grey,
                        top: 10,
                    }}
                    />
                </View>
                ),
            }}
            />
            <Tab.Screen name="MyPage" component={MyPage}
            options={{
                tabBarIcon: ({focused}) => (
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Image
                    source={focused ? profileIconActive : profileIcon}
                    style={{
                        width: 20,
                        height: 22,
                        tintColor: focused ? theme.tabBlue : theme.grey,
                        top:10,
                    }}
                    />
                </View>
                ),
            }}
            />
        </Tab.Navigator>
      
        
    );
};

export default Home;