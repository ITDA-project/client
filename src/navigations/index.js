import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Auth from "./Auth";
import Main from "./Main";

const Stack = createStackNavigator(); 

const Navigation = () => {
  return (
    <NavigationContainer>
      <Auth/>

    </NavigationContainer>
  );
};

export default Navigation;

