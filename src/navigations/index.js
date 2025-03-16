import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import Auth from "./Auth";
import Main from "./Main";

const Navigation = () => {
  return (
    <NavigationContainer>
      <Main />
    </NavigationContainer>
  );
};

export default Navigation;

