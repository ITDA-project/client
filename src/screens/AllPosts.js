import React, { useState, useContext, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { ThemeContext } from "styled-components/native";
import Button from "../components/Button";
import useRequireLogin from "../hooks/useRequireLogin";
import axios from "axios";

const AllPosts = ({ route }) => {
  const { checkLogin, LoginAlert } = useRequireLogin();
  const theme = useContext(ThemeContext);
  const navigation = useNavigation();

  const { category, categoryName } = route.params || {};
  const [meetings, setMeetings] = useState([]);
  const [selectedSort, setSelectedSort] = useState("latest");
  const [loading, setLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [cursor, setCursor] = useState(null);
  const currentUser = { userId: 1 }; // 로그인한 사용자 ID

  const fetchMeetings = async (isInitial = false) => {
    if (loading || (!hasNextPage && !isInitial)) return;
    setLoading(true);

    try {
      const params = {
        sort: selectedSort === "popular" ? "likesCount" : "createdAt",
        size: 10,
      };

      if (category) params.category = category;
      if (!isInitial && cursor) params.cursor = cursor;

      console.log("📡 axios 요청 파라미터:", params); // 디버깅용
      console.log("✅ 요청에 사용되는 category:", category);
      const response = await axios.get("http://192.168.123.182:8080/api/posts/list", {
        params,
      });

      const newPosts = response.data.dtoList;

      if (newPosts.length > 0) {
        setMeetings((prev) => (isInitial ? newPosts : [...prev, ...newPosts]));
        setCursor(newPosts[newPosts.length - 1].postId);
        setHasNextPage(newPosts.length === 10);
      } else {
        setHasNextPage(false);
      }
    } catch (error) {
      console.error("게시글 불러오기 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMeetings([]);
    setCursor(null);
    setHasNextPage(true);
    fetchMeetings(true);
  }, [selectedSort, category]);

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 20 },

    sortContainer: {
      flexDirection: "row",
      marginTop: 10,
      marginBottom: 10,
      marginLeft: 230,
    },
    sortButton: {
      height: 25,
      width: 60,
      borderRadius: 20,
      backgroundColor: "#E9E9E9",
      marginRight: 5,
      justifyContent: "center",
      alignItems: "center",
    },
    sortText: {
      fontSize: 14,
      color: "#8C8C8C",
      fontFamily: theme.fonts.regular,
    },

    selectedSort: { backgroundColor: theme.colors.tabBlue },
    selectedText: { color: theme.colors.mainBlue },

    postItem: {
      paddingBottom: 15,
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: "#eee",
    },
    postTitle: { fontSize: 18, fontFamily: theme.fonts.extraBold },
    postInfo: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 5,
    },
    postDate: {
      color: theme.colors.grey,
      fontFamily: theme.fonts.regular,
      marginTop: 3,
    },

    likesContainer: { flexDirection: "row", alignItems: "center" },
    likesText: {
      marginLeft: 5,
      color: "#979C9E",
      fontFamily: theme.fonts.bold,
    },

    ButtonContainer: {
      position: "absolute",
      bottom: 30,
      right: 5,
      paddingHorizontal: 20,
      paddingVertical: 10,
      justifyContent: "center",
      alignItems: "center",
    },
  });

  return (
    <View style={styles.container}>
      {/* 선택된 카테고리 표시 */}
      <View style={{ marginTop: 15, marginBottom: 5 }}>
        <Text
          style={{
            fontSize: 20,
            fontFamily: theme.fonts.extraBold,
            color: "#333",
          }}
        >
          {categoryName ? `'${categoryName}' 카테고리 모임` : "전체 모임"}
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontFamily: theme.fonts.regular,
            color: theme.colors.grey,
            marginTop: 4,
          }}
        >
          총 {meetings.length}개의 모임이 있습니다
        </Text>
      </View>

      {/* 정렬 버튼 */}
      <View style={styles.sortContainer}>
        <TouchableOpacity style={[styles.sortButton, selectedSort === "latest" && styles.selectedSort]} onPress={() => setSelectedSort("latest")}>
          <Text style={[styles.sortText, selectedSort === "latest" && styles.selectedText]}>최신순</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.sortButton, selectedSort === "popular" && styles.selectedSort]} onPress={() => setSelectedSort("popular")}>
          <Text style={[styles.sortText, selectedSort === "popular" && styles.selectedText]}>인기순</Text>
        </TouchableOpacity>
      </View>

      {/* 게시글 리스트 */}
      {meetings.length === 0 && !loading ? (
        <View style={{ marginTop: 50, alignItems: "center" }}>
          <Text style={{ fontSize: 16, color: "#888", fontFamily: theme.fonts.regular }}>모아모아의 첫 모임을 생성해보세요!</Text>
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={meetings}
          keyExtractor={(item) => item.postId.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.postItem}
              onPress={() => {
                const screen = item.userId === currentUser.userId ? "MyPostDetail" : "PostDetail";
                navigation.navigate(screen, item);
              }}
            >
              <Text style={styles.postTitle}>{item.title}</Text>
              <View style={styles.postInfo}>
                <Text style={styles.postDate}>{item.createdAt?.split("T")[0].split("-").join(".")}</Text>
                <View style={styles.likesContainer}>
                  <Feather name="heart" size={16} color="#ccc" />
                  <Text style={styles.likesText}>{item.likesCount}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          onEndReached={() => fetchMeetings()}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            loading && (
              <View style={{ paddingVertical: 20 }}>
                <ActivityIndicator size="small" color={theme.colors.mainBlue} />
              </View>
            )
          }
        />
      )}

      {/* 글쓰기 버튼 */}
      <View style={styles.ButtonContainer}>
        <Button
          title="글쓰기"
          onPress={() => checkLogin("모임생성")}
          containerStyle={{ height: 40, width: 95 }}
          textStyle={{ fontSize: 16, marginLeft: 0 }}
          style={{ height: 40, width: 95 }}
        />
        <LoginAlert />
      </View>
    </View>
  );
};

export default AllPosts;
