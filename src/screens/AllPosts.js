import React, { useState, useContext } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { ThemeContext } from "styled-components/native";
import Button from "../components/Button";
import useRequireLogin from "../hooks/useRequireLogin";

const AllPosts = ({ route }) => {
  const { checkLogin, LoginAlert } = useRequireLogin();
  const theme = useContext(ThemeContext);

  const currentUser = { userId: 1 }; // 로그인한 사용자 ID

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

  //Category,sort 불러오기
  /*useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("https://your-api.com/posts", {
          params: {
            category: category || undefined,
            sort: selectedSort,
          },
        });
        setMeetings(response.data);
      } catch (error) {
        console.error("게시글 불러오기 실패:", error);
      }
    };

    fetchPosts();
  }, [category, selectedSort]);*/

  const navigation = useNavigation();
  const { meetings = [], categories } = route.params || {};
  const [selectedSort, setSelectedSort] = useState("latest");

  // 정렬된 데이터 생성
  const sortedMeetings = [...meetings].sort((a, b) => {
    if (selectedSort === "latest") {
      return new Date(b.createdAt) - new Date(a.createdAt); // 최신순 (날짜 내림차순)
    } else {
      return b.likes - a.likes; // 인기순 (좋아요 내림차순)
    }
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
          {categories ? `'${categories}' 카테고리 모임` : "전체 모임"}
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
      <FlatList
        showsVerticalScrollIndicator={false}
        data={sortedMeetings}
        keyExtractor={(item) => item.postId.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.postItem}
            onPress={() => {
              if (item.userId === currentUser.userId) {
                navigation.navigate("MyPostDetail", {
                  postId: item.postId,
                  title: item.title,
                  createdAt: item.createdAt,
                  likes: item.likes,
                });
              } else {
                navigation.navigate("PostDetail", {
                  postId: item.postId,
                  title: item.title,
                  createdAt: item.createdAt,
                  likes: item.likes,
                });
              }
            }}
          >
            <Text style={styles.postTitle}>{item.title}</Text>
            <View style={styles.postInfo}>
              <Text style={styles.postDate}>{item.createdAt}</Text>
              <View style={styles.likesContainer}>
                <Feather name="heart" size={16} color="#ccc" />
                <Text style={styles.likesText}>{item.likes}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

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
