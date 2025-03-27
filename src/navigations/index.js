import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./Home";
import Main from "./Main";
import Auth from "./Auth";
import Application from "./Applicaton";

const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Application />
    </NavigationContainer>
  );
};

export default Navigation;
