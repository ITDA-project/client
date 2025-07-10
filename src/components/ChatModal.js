import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, TextInput, StyleSheet, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import theme from "../theme";

/* util ─ 문자열 → Date 변환 helper */
const dateStringToDate = (yyyyMmDd) => {
  const [y, m, d] = yyyyMmDd.split("-").map(Number);
  return new Date(y, m - 1, d);
};

const timeStringToDate = (hhMm) => {
  const [h, m] = hhMm.split(":").map(Number);
  const base = new Date();
  base.setHours(h, m, 0, 0);
  return base;
};

const ChatModal = ({ visible, formDate, setFormDate, formTime, setFormTime, formPrice, setFormPrice, onConfirm, onCancel }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const isoDate = selectedDate.toISOString().split("T")[0];
      setFormDate(isoDate);
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const hour = selectedTime.getHours().toString().padStart(2, "0");
      const minute = selectedTime.getMinutes().toString().padStart(2, "0");
      setFormTime(`${hour}:${minute}`);
    }
  };

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <Text style={styles.title}>모임 정보 입력</Text>

          <Text style={styles.label}>날짜</Text>
          <TouchableOpacity style={styles.selector} onPress={() => setShowDatePicker(true)}>
            <Text style={styles.selectorText}>{formDate}</Text>
          </TouchableOpacity>

          <Text style={styles.label}>시간</Text>
          <TouchableOpacity style={styles.selector} onPress={() => setShowTimePicker(true)}>
            <Text style={styles.selectorText}>{formTime}</Text>
          </TouchableOpacity>

          <Text style={styles.label}>보증금 (숫자)</Text>
          <TextInput style={[styles.selector, { paddingVertical: 8 }]} value={formPrice} onChangeText={setFormPrice} keyboardType="numeric" />

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm}>
              <Text style={styles.confirmTxt}>확인</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <Text style={styles.cancelTxt}>취소</Text>
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              value={dateStringToDate(formDate)}
              onChange={handleDateChange}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              mode="time"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              value={timeStringToDate(formTime)}
              onChange={handleTimeChange}
              is24Hour
            />
          )}
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
  modalBox: {
    width: 280,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  title: {
    fontFamily: theme.fonts.extraBold,
    fontSize: 18,
    marginBottom: 12,
    textAlign: "center",
  },
  label: {
    fontFamily: theme.fonts.bold,
    fontSize: 14,
    marginTop: 10,
  },
  selector: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginTop: 4,
  },
  selectorText: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: "#333",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
    gap: 10,
  },
  confirmBtn: {
    backgroundColor: theme.colors.mainBlue,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelBtn: {
    backgroundColor: "#ddd",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  confirmTxt: {
    color: "#fff",
    fontFamily: theme.fonts.bold,
    fontSize: 16,
  },
  cancelTxt: {
    color: "#333",
    fontFamily: theme.fonts.bold,
    fontSize: 16,
  },
});

export default ChatModal;
