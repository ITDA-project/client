import React, { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, Modal, StyleSheet, Alert } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import theme from "../theme";
import axios from "axios";
import EncryptedStorage from "react-native-encrypted-storage";
import { formatTime, formatDate } from "../utils/utils";

const Notification = ({ onReadAll }) => {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState({ title: "", date: "", time: "", location: "", amount: 0 });

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = await EncryptedStorage.getItem("accessToken");
      const res = await axios.get("http://10.0.2.2:8080/api/notifications", {
        headers: { access: token },
      });
      console.log("🔔 알림 조회 성공:", res.data.data);
      setNotifications(res.data.data);
    } catch (error) {
      console.error("알림 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = await EncryptedStorage.getItem("accessToken");
      await axios.patch("http://10.0.2.2:8080/api/notifications/read-all", null, {
        headers: { access: token },
      });
      console.log("✅ 전체 읽음 처리 완료");
    } catch (e) {
      console.log("❌ 알림 읽음 처리 실패", e);
    }
  };

  // 알림 아이템 전체를 넘겨받아 세션 정보를 가져오는 새로운 함수
  const fetchSessionInfo = async (item) => {
    // roomId 대신 item 전체를 받도록 변경
    try {
      const token = await EncryptedStorage.getItem("accessToken");
      const roomId = item.postId; // postId를 roomId로 가정

      // !!! 이 부분을 수정해야 합니다 !!!
      // 백엔드 컨트롤러에 정의된 올바른 API URL로 수정
      const url = `http://10.0.2.2:8080/api/sessions/chatroom/${roomId}/active`;
      console.log(`📡 세션 정보 요청 URL: ${url}`); // 요청 URL을 로그로 확인

      const res = await axios.get(url, {
        headers: { access: token },
      });

      const sessionInfo = res.data.data;

      // 진행 중인 세션이 없는 경우
      if (!sessionInfo) {
        Alert.alert("알림", "진행 중인 세션이 없습니다.");
        setModalVisible(false); // 세션이 없으면 모달을 닫습니다.
        return;
      }

      console.log(`✅ 세션 정보 조회 성공 (roomId: ${roomId}):`, sessionInfo);

      // 모달에 표시할 데이터를 업데이트합니다.
      setModalData({
        title: item.title, // 알림에 있는 제목을 사용
        date: sessionInfo.sessionDate || "날짜 정보 없음",
        time: sessionInfo.sessionTime || "시간 정보 없음",
        location: sessionInfo.location || "장소 정보 없음",
        amount: sessionInfo.price || 0,
        somoimId: sessionInfo.somoimId || roomId, // somoimId가 없으면 roomId 사용
        sessionId: sessionInfo.sessionNumber,
      });
      setModalVisible(true);
    } catch (error) {
      console.error(`❌ 세션 정보 조회 실패 (roomId: ${item.postId}):`, error);
      Alert.alert("오류", "세션 정보를 불러오지 못했습니다.");
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
      markAllAsRead();
      onReadAll?.();
    }, [])
  );

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
        // postId를 roomId로 가정하고 세션 정보를 조회합니다.
        if (item.postId) {
          fetchSessionInfo(item);
        } else {
          Alert.alert("오류", "모임 정보를 찾을 수 없습니다.");
        }
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
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>알림이 존재하지 않습니다</Text>
            </View>
          )
        }
        contentContainerStyle={notifications.length === 0 ? styles.emptyWrapper : null}
      />

      {/* 결제 정보 확인 모달 */}
      <Modal transparent animationType="fade" visible={modalVisible}>
        <View style={styles.overlay}>
          <View style={styles.modalBox}>
            <Text style={styles.title}>{modalData.title}</Text>
            <Text style={styles.date}>{formatDate(modalData.date)}</Text>
            <Text style={styles.time}>{formatTime(modalData.time)}</Text>
            <Text style={styles.location}>{modalData.location}</Text>
            <Text style={styles.amount}>{modalData.amount.toLocaleString()}원</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => {
                  setModalVisible(false);
                  console.log("진짜 직전에 결제페이지로 넘길 데이터", modalData.amount, modalData.title, modalData.somoimId, modalData.sessionId);
                  // 모달에 저장된 roomId를 결제 페이지로 넘겨줍니다.
                  navigation.navigate("결제", {
                    amount: modalData.amount,
                    title: modalData.title,
                    somoimId: modalData.somoimId, // somoimId로 값을 전달
                    sessionId: modalData.sessionId,
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
    fontSize: 20,
    marginBottom: 15,
    textAlign: "center",
  },
  date: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: "gray",
    marginBottom: 6,
  },
  time: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: "gray",
    marginBottom: 6,
  },
  location: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: "gray",
    marginBottom: 20,
  },
  amount: {
    fontFamily: theme.fonts.bold,
    fontSize: 17,
    textAlign: "center",
    marginBottom: 30,
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
  emptyWrapper: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 30,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.grey,
    fontFamily: theme.fonts.bold,
  },
});

export default Notification;
