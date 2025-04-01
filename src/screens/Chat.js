import React from "react";
import { View, Text } from "react-native";
import RequireAuth from "../components/RequireAuth";

const Chat = () => {
  return (
    //RequireAuth 태그로 인해 로그인 상태가 아니면 로그인 화면이 뜸
    <RequireAuth>
      <View>
        <Text>Chat Screen</Text>
      </View>
    </RequireAuth>
  );
};

export default Chat;
