import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./Home";
import Main from "./Main";
import Auth from "./Auth";

const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Main />
    </NavigationContainer>
  );
};

export default Navigation;
