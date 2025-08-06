import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import theme from "../theme";

const LoginModal = ({ visible, onClose }) => {
  const navigation = useNavigation();

  const handleLoginPress = () => {
    onClose(); // 모달 닫기
    navigation.navigate("로그인"); // 로그인 화면으로 이동
  };

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.alertBox}>
          <Text style={styles.title}>로그인이 필요합니다</Text>
          <Text style={styles.message}>로그인 하시겠습니까?</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.loginButton} onPress={handleLoginPress}>
              <Text style={styles.loginText}>로그인</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
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
    fontSize: 16,
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

export default LoginModal;
