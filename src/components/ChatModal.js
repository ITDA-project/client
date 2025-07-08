import React, { useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import theme from "../theme";

const MeetingInfoModal = ({ visible, formDate, setFormDate, formTime, setFormTime, formPrice, setFormPrice, onConfirm, onCancel }) => (
  <Modal transparent animationType="fade" visible={visible}>
    <View style={styles.overlay}>
      <View style={styles.modalBox}>
        <Text style={styles.title}>모임 정보 입력</Text>

        <Text style={styles.label}>날짜</Text>
        <TextInput style={styles.input} value={formDate} onChangeText={setFormDate} />

        <Text style={styles.label}>시간</Text>
        <TextInput style={styles.input} value={formTime} onChangeText={setFormTime} />

        <Text style={styles.label}>보증금</Text>
        <TextInput style={styles.input} value={formPrice} onChangeText={setFormPrice} keyboardType="numeric" />

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm}>
            <Text style={styles.confirmTxt}>확인</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
            <Text style={styles.cancelTxt}>취소</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalBox: { width: 280, backgroundColor: "#fff", borderRadius: 10, padding: 20 },
  title: { fontFamily: theme.fonts.extraBold, fontSize: 18, marginBottom: 12, textAlign: "center" },
  label: { fontFamily: theme.fonts.bold, fontSize: 14, marginTop: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 8, marginTop: 4 },
  buttonRow: { flexDirection: "row", justifyContent: "flex-end", marginTop: 20, gap: 10 },
  confirmBtn: { backgroundColor: theme.colors.mainBlue, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5 },
  cancelBtn: { backgroundColor: "#ddd", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5 },
  confirmTxt: { color: "#fff", fontFamily: theme.fonts.bold, fontSize: 16 },
  cancelTxt: { color: "#333", fontFamily: theme.fonts.bold, fontSize: 16 },
});

export default MeetingInfoModal;
