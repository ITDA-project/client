import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Modal, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import theme from "../theme";

const notifications = [
  {
    id: 1,
    type: "application",
    message: "새로운 신청자가 있어요! 확인해보세요!",
    postTitle: "함께 뜨개질해요!",
  },
  {
    id: 2,
    type: "rejected",
    message: "신청이 거절되었습니다. 다른 모임에 신청해보세요!",
    postTitle: "주말 등산가요!",
  },
  {
    id: 3,
    type: "payment_complete",
    message: "결제가 완료되었어요! 모임을 즐길 준비가 되었어요.",
    postTitle: "일본어 스터디",
  },
  {
    id: 4,
    type: "payment_required",
    message: "새로운 결제 요청이 있어요! 참여하시겠어요?",
    postTitle: "일본어 스터디",
  },
];

const Notification = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState({ title: "", date: "", amount: 0 });

  const handlePress = (item) => {
    switch (item.type) {
      case "application":
        navigation.navigate("신청서 목록");
        break;
      case "rejected":
        navigation.navigate("전체글");
        break;
      case "payment_complete":
        console.log("결제 완료!");
        break;
      case "payment_required":
        setModalData({ title: item.postTitle, date: "2025/05/26", amount: 1 });
        setModalVisible(true);
        break;
      default:
        console.warn("Unknown type:", item.type);
        break;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>알림</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.notificationItem} onPress={() => handlePress(item)}>
            <View style={styles.messageBox}>
              <Text style={styles.postTitle}>{item.postTitle}</Text>
              <Text style={styles.messageText}>{item.message}</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#999" />
          </TouchableOpacity>
        )}
      />

      {/* 결제 정보 확인 모달 */}
      <Modal transparent animationType="fade" visible={modalVisible}>
        <View style={styles.overlay}>
          <View style={styles.modalBox}>
            <Text style={styles.title}>{modalData.title}</Text>
            <Text style={styles.date}>{modalData.date}</Text>
            <Text style={styles.amount}>{modalData.amount.toLocaleString()}원</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate("결제", {
                    amount: modalData.amount,
                    title: modalData.title,
                  });
                }}
              >
                <Text style={styles.confirmText}>수락</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>거절</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", padding: 5 },
  header: {
    fontSize: 18,
    textAlign: "center",
    fontFamily: theme.fonts.extraBold,
    padding: 5,
    marginTop: 40,
    marginBottom: 10,
  },
  notificationItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  messageBox: { flex: 1 },
  postTitle: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    marginBottom: 5,
  },
  messageText: {
    fontSize: 14,
    color: theme.colors.grey,
    fontFamily: theme.fonts.regular,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalBox: {
    width: 300,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontFamily: theme.fonts.bold,
    fontSize: 16,
    marginBottom: 6,
    textAlign: "center",
  },
  date: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: "gray",
    marginBottom: 6,
  },
  amount: {
    fontFamily: theme.fonts.bold,
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  confirmButton: {
    width: "40%",
    backgroundColor: theme.colors.mainBlue,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    margin: 5,
  },
  cancelButton: {
    width: "40%",
    backgroundColor: "#e6f0fa",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    margin: 5,
  },
  confirmText: {
    fontFamily: theme.fonts.bold,
    color: "white",
  },
  cancelText: {
    fontFamily: theme.fonts.bold,
    color: theme.colors.mainBlue,
  },
});

export default Notification;
