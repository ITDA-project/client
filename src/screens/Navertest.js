import React, { useState } from "react";
import { SafeAreaView, Button, View, ScrollView } from "react-native";
import NaverLogin from "@react-native-seoul/naver-login";

const consumerKey = "";
const consumerSecret = "";
const appName = "moaoa";
const serviceUrlScheme = "navertest";

const Navertest = () => {
  const [success, setSuccessResponse] = useState(null);
  const [failure, setFailureResponse] = useState(null);

  const login = async () => {
    try {
      const { failureResponse, successResponse } = await NaverLogin.login({
        appName,
        consumerKey,
        consumerSecret,
        serviceUrlScheme,
      });
      setSuccessResponse(successResponse);
      setFailureResponse(failureResponse);

      if (successResponse) {
        const profileResult = await NaverLogin.getProfile(
          successResponse.accessToken
        );
        console.log("GetProfile Response:", profileResult);
      }
    } catch (e) {
      console.error("Login or GetProfile Error:", e);
    }
  };

  const logout = async () => {
    try {
      await NaverLogin.logout();
      setSuccessResponse(null);
      setFailureResponse(null);
    } catch (e) {
      console.error(e);
    }
  };

  const deleteToken = async () => {
    try {
      await NaverLogin.deleteToken();
      setSuccessResponse(null);
      setFailureResponse(null);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <SafeAreaView
      style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, padding: 24 }}
      >
        <Button title={"Login"} onPress={login} />
        <Gap />
        <Button title={"Logout"} onPress={logout} />
        <Gap />
        {success && (
          <View>
            <Button title="Delete Token" onPress={deleteToken} />
            <Gap />
          </View>
        )}
        <Gap />
        {failure && console.log("Failure Response:", failure)}
      </ScrollView>
    </SafeAreaView>
  );
};

const Gap = () => <View style={{ marginTop: 24 }} />;

export default Navertest;
