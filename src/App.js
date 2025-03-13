import React from "react";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider } from "styled-components";
import theme from "./theme";
import Navigation from "./navigations";
import * as Font from "expo-font";
import { useFonts } from "expo-font";
import AppLoading from "expo-app-loading";

const loadFonts = () => {
  return Font.loadAsync({
    NanumSquare_acB: require("../assets/fonts/NanumSquare_acB.ttf"),
    NanumSquare_acR: require("../assets/fonts/NanumSquare_acR.ttf"),
  });
};

const App = () => {
  const [fontsLoaded] = useFonts({
    NanumSquare_acB: require("../assets/fonts/NanumSquare_acB.ttf"),
    NanumSquare_acR: require("../assets/fonts/NanumSquare_acR.ttf"),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }
  return (
    <ThemeProvider theme={theme}>
      <StatusBar style="auto" />
      <Navigation />
    </ThemeProvider>
  );
};

export default App;
