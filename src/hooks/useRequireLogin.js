import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../contexts/AuthContext";
import theme from "../theme";

const useRequireLogin = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const tabScreens = ["MyPage", "Chat", "Notifications"];

  const checkLogin = (nextScreen, params = {}) => {
    console.log("이동 요청:", nextScreen);

    if (!user) {
      console.log("로그인 안됨! 로그인 모달 표시");
      setModalVisible(true);
      return false;
    }

    console.log("로그인 상태! 네비게이션 이동: ", nextScreen);
    if (tabScreens.includes(nextScreen)) {
      navigation.navigate("Home", { screen: nextScreen });
    } else {
      navigation.navigate(nextScreen, params);
    }
    return true;
  };

  return {
    checkLogin,
    LoginAlert: () => (
      <Modal transparent animationType="fade" visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.overlay}>
          <View style={styles.alertBox}>
            <Text style={styles.title}>로그인이 필요합니다</Text>
            <Text style={styles.message}>이 기능을 사용하려면 로그인이 필요합니다.{"\n"}로그인하시겠습니까?</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate("로그인");
                }}
              >
                <Text style={styles.loginText}>로그인</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>취소</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    ),
  };
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  alertBox: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  title: {
    fontFamily: theme.fonts.bold,
    fontSize: 18,
    marginBottom: 10,
  },
  message: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  loginButton: {
    flex: 1,
    padding: 10,
    backgroundColor: theme.colors.mainBlue,
    borderRadius: 5,
    alignItems: "center",
    marginRight: 10,
  },
  cancelButton: {
    flex: 1,
    padding: 10,
    backgroundColor: theme.colors.grey,
    borderRadius: 5,
    alignItems: "center",
  },
  loginText: {
    fontFamily: theme.fonts.bold,
    color: "white",
  },
  cancelText: {
    fontFamily: theme.fonts.bold,
    color: "white",
  },
});

export default useRequireLogin;
