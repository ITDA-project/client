import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { Animated, Text, TouchableOpacity, StyleSheet, View, Image } from "react-native";
import styled from "styled-components/native";

const NotificationOverlayContext = createContext();

export const NotificationOverlayProvider = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState(null);
  const translateY = useRef(new Animated.Value(-100)).current;

  const showNotification = ({ roomName, senderName, message }, onPress = null) => {
    setMessage({ roomName, senderName, message, onPress });
    setVisible(true);
  };

  const hideNotification = () => {
    setVisible(false);
    setMessage(null);
  };

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(3000),
        Animated.timing(translateY, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(hideNotification);
    }
  }, [visible]);

  return (
    <NotificationOverlayContext.Provider value={{ showNotification }}>
      <>
        {children}
        {visible && message && (
          <Animated.View style={[styles.banner, { transform: [{ translateY }] }]}>
            <TouchableOpacity onPress={message.onPress}>
              <View style={styles.row}>
                <Image source={require("../../assets/icon.png")} style={styles.icon} />
                <View style={styles.textContainer}>
                  <Text style={styles.title}>{message.roomName}</Text>
                  <Text style={styles.message}>
                    <Text style={styles.sender}>{message.senderName}: </Text>
                    {message.message}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        )}
      </>
    </NotificationOverlayContext.Provider>
  );
};

export const useNotificationOverlay = () => useContext(NotificationOverlayContext);

// 스타일 정의
const styles = StyleSheet.create({
  banner: {
    position: "absolute",
    top: 36,
    left: 20,
    right: 20,
    backgroundColor: "#d7d6d6ff",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    zIndex: 999,
    elevation: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 32,
    height: 32,
    marginRight: 12,
    borderRadius: 6,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: "#000",
    fontSize: 12,
    marginBottom: 0,
    fontWeight: "bold",
    lineHeight: 14,
  },
  sender: {
    fontWeight: "bold",
    color: "#000",
    fontSize: 14,
    lineHeight: 18,
  },
  message: {
    color: "#000",
    fontSize: 14,
    lineHeight: 18,
  },
});
