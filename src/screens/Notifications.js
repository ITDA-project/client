import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Modal, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import theme from "../theme";
import axios from "axios";
import EncryptedStorage from "react-native-encrypted-storage";

const Notification = () => {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState({ title: "", date: "", amount: 0 });

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const token = await EncryptedStorage.getItem("accessToken");

      const res = await axios.get("http://10.0.2.2:8080/api/notifications", {
        headers: {
          access: token,
        },
      });
      setNotifications(res.data.data); // `ApiResponse<List<NotificationResponseDto>>` 구조
    } catch (error) {
      console.error("알림 조회 실패:", error);
      Alert.alert("오류", "알림을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handlePress = (item) => {
    switch (item.type) {
      case "FORM_APPROVED":
        if (item.roomId) {
          navigation.navigate("채팅방", { roomId: item.roomId });
        } else {
          Alert.alert("오류", "채팅방 정보를 찾을 수 없습니다.");
        }
        break;
      case "FORM_REJECTED":
        navigation.navigate("전체글");
        break;
      case "FORM_APPLY":
        console.log("PostId from Notification item:", item.postId);
        if (!item.postId) {
          Alert.alert("오류", "신청서 postId가 없습니다.");
          return;
        }
        navigation.navigate("신청서 목록", { postId: item.postId });
        break;
      case "PAYMENT_COMPLETE":
        Alert.alert("결제완료", "모아모아와 함께 모임에 참여해주세요!");
        break;
      case "PAYMENT_REQUESTED":
        setModalData({ title: item.title, date: "2025/05/26", amount: 10000 }); //날짜, 금액 전달 수정 필요
        setModalVisible(true);
        break;
      default:
        console.warn("알 수 없는 알림 타입:", item.type);
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
              <Text style={styles.postTitle}>{item.title}</Text>
              <Text style={styles.messageText}>{item.body}</Text>
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
