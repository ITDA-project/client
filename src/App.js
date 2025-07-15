import React, { useEffect, useCallback, useState } from "react";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider } from "styled-components";
import theme from "./theme";
import Navigation from "./navigations";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { Provider as PaperProvider } from "react-native-paper";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationOverlayProvider } from "./components/NotificationOverlay"; // ✅ 상대경로 확인
import WebSocketManager from "./components/WebSocketManager";
import { NavigationContainer } from "@react-navigation/native";
import { navigationRef } from "./navigations/navigationRef";

SplashScreen.preventAutoHideAsync();

const App = () => {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync({
          NanumSquare_acB: require("../assets/fonts/NanumSquare_acB.ttf"),
          NanumSquare_acR: require("../assets/fonts/NanumSquare_acR.ttf"),
          NanumSquare_acEB: require("../assets/fonts/NanumSquare_acEB.ttf"),
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <NotificationOverlayProvider>
      <AuthProvider>
        <PaperProvider>
          <ThemeProvider theme={theme}>
            <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
              <StatusBar style="auto" />
              <Navigation />
              <WebSocketManager />
            </View>
          </ThemeProvider>
        </PaperProvider>
      </AuthProvider>
    </NotificationOverlayProvider>
  );
};

export default App;
