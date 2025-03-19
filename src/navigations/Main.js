import React, { useContext } from 'react';
import { ThemeContext } from 'styled-components/native';
import { createStackNavigator} from '@react-navigation/stack';
import {MainPage,Chat,Notifications,Search,MyPage,AllPosts,Profile,EditProfile, PostDetail, MyPostDetail} from '../screens';
import Home from './Home';

const Stack=createStackNavigator();

const Main = () =>{
    //const theme=useContext(ThemeContext);
    
    return(
        <Stack.Navigator initialRouteName='Home' screenOptions={{headerShown: false,}} >
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="MainPage" component={MainPage}/>
            <Stack.Screen name="AllPosts" component={AllPosts}/>
            <Stack.Screen name="MyPage" component={MyPage}/>
            <Stack.Screen name="Profile" component={Profile}/>
            <Stack.Screen name="EditProfile" component={EditProfile}/>
            <Stack.Screen name="PostDetail" component={PostDetail}/>
            <Stack.Screen name="MyPostDetail" component={MyPostDetail}/>
        </Stack.Navigator>
    );
};
export default Main;