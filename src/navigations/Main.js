import React, { useContext } from 'react';
import { ThemeContext } from 'styled-components/native';
import { createStackNavigator} from '@react-navigation/stack';
import {MainPage,Chat,Notifications,Search,MyPage,AllPosts,Profile,EditProfile} from '../screens';
import Home from './Home';
import { MaterialIcons } from "@expo/vector-icons";


const Stack=createStackNavigator();

const Main = () =>{
    const theme=useContext(ThemeContext);
    
    return(
        <Stack.Navigator initialRouteName='Home'  >
            <Stack.Screen name="Home" component={Home} options={{ headerShown: false }}/>
            <Stack.Screen name="MainPage" component={MainPage} options={{ headerShown: false }}/>
            <Stack.Screen name="전체글" 
            component={AllPosts}
             options={{
                      headerTitleAlign: "center",
                      headerBackTitleVisible: false,
                      headerTintColor: theme.colors.black,
                      headerTitleStyle: {
                        fontFamily: theme.fonts.bold,
                        fontSize: 16,
                      },
                      headerLeft: ({ onPress, tintColor }) => (
                        <MaterialIcons
                          name="keyboard-arrow-left"
                          size={38}
                          color={tintColor}
                          onPress={onPress}
                        />
                      ),
                    }}
                  />
            <Stack.Screen name="MyPage" component={MyPage}/>
            <Stack.Screen name="프로필" component={Profile}
            options={{
                headerTitleAlign: "center",
                headerBackTitleVisible: false,
                headerTintColor: theme.colors.black,
                headerTitleStyle: {
                  fontFamily: theme.fonts.bold,
                  fontSize: 16,
                },
                headerLeft: ({ onPress, tintColor }) => (
                  <MaterialIcons
                    name="keyboard-arrow-left"
                    size={38}
                    color={tintColor}
                    onPress={onPress}
                  />
                ),
              }}/>
            <Stack.Screen name="EditProfile" component={EditProfile}/>
        </Stack.Navigator>
    );
};
export default Main;