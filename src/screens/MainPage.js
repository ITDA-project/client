import React, { useContext, useEffect, useState } from "react";
import { Image, View, Text, TextInput, FlatList, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from "react-native";
import { ThemeContext, styled } from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import Logo from "../../assets/logo.svg";
import axios from "axios";

const LogoContainer = styled.View`
  align-items: center;
  margin-top: 60px;
  margin-bottom: 40px;
`;

// 메인 페이지
const MainPage = () => {
  const theme = useContext(ThemeContext);
  const navigation = useNavigation(); //네비게이션 사용

  const [latestMeetings, setLatestMeetings] = useState([]);
  const [popularMeetings, setPopularMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUser = { userId: 1 }; // 로그인된 유저 ID (예시)

  const fetchMainData = async () => {
    try {
      setLoading(true);

      const [latestRes, popularRes] = await Promise.all([
        axios.get("http://192.168.123.182:8080/api/posts/list", {
          params: { sort: "createdAt", size: 3 },
        }),
        axios.get("http://192.168.123.182:8080/api/posts/list", {
          params: { sort: "likesCount", size: 3 },
        }),
      ]);

      setLatestMeetings(latestRes.data.dtoList);
      setPopularMeetings(popularRes.data.dtoList);
    } catch (error) {
      console.error("메인 페이지 데이터 로딩 실패:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchMainData();
  }, []);

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff", padding: 20 },
    title: { fontSize: 30, fontFamily: theme.fonts.bold, textAlign: "center", marginBottom: 20 },

    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 2,
      borderRadius: 10,
      paddingHorizontal: 10,
      borderColor: theme.colors.mainBlue,
    },
    searchInput: { flex: 1, height: 60 },
    searchIcon: { marginLeft: 5 },

    categoryContainer: {
      marginTop: 30, // 검색창과 카테고리 간의 간격
      marginBottom: 10,
      flexDirection: "row",
      justifyContent: "space-between", // 아이콘 사이에 공간을 자동으로 분배
      paddingHorizontal: 10,
    },
    categoryItem: {
      flexDirection: "column",
      alignItems: "center",
      marginRight: 30, // 카테고리 아이콘 사이의 간격
      justifyContent: "center",
      alignItems: "center",
      width: 40,
    },
    categoryText: {
      marginLeft: 10, // 아이콘과 텍스트 간의 여백
      textAlign: "center",
      marginTop: 10,
      fontSize: 14,
      color: theme.colors.grey,
      fontFamily: theme.fonts.bold,
    },
    sectionContent: {
      minHeight: 110, // 또는 원하는 높이
      justifyContent: "center",
    },
    sectionHeader: {
      flexDirection: "row", // 가로 정렬
      justifyContent: "space-between", // 양 끝 정렬
      alignItems: "center", // 수직 중앙 정렬
    },
    sectionTitle: { fontSize: 20, fontFamily: theme.fonts.bold, marginTop: 25, marginBottom: 10, color: "#656565" },

    viewAllButton: { fontSize: 16, marginLeft: "auto", fontFamily: theme.fonts.bold },

    listItem: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: "#ddd" },
    listTitle: { fontSize: 16, fontFamily: theme.fonts.extraBold, color: theme.grey },
    listInfo: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
    listDate: { color: "#888", fontFamily: theme.fonts.regular },
    likesContainer: { flexDirection: "row", alignItems: "center", marginLeft: "auto", justifyContent: "center" },
    likesText: { marginLeft: 5, color: "#979C9E", fontFamily: theme.fonts.bold },
  });

  const category = [
    { id: "1", name: "취미", code: "HOBBY", image: require("../../assets/icons/categoriHobby.png") },
    { id: "2", name: "운동", code: "EXERCISE", image: require("../../assets/icons/categoriExercise.png") },
    { id: "3", name: "또래", code: "FRIEND", image: require("../../assets/icons/categoriFriend.png") },
    { id: "4", name: "공부", code: "STUDY", image: require("../../assets/icons/categoriStudy.png") },
    { id: "5", name: "음악", code: "MUSIC", image: require("../../assets/icons/categoriMusic.png") },
    { id: "6", name: "게임", code: "GAME", image: require("../../assets/icons/categoriGame.png") },
  ];

  // 게시글 목록 컴포넌트
  const PostList = ({ data }) => {
    //배열인지 확인
    if (!Array.isArray(data) || data.length === 0) {
      return (
        <View style={{ alignItems: "center", marginVertical: 20 }}>
          <Text style={{ fontSize: 16, color: "#888", fontFamily: theme.fonts.regular }}>모아모아의 첫 모임을 생성해보세요!</Text>
        </View>
      );
    }

    return (
      <View>
        {data.map((item) => (
          <TouchableOpacity
            key={item.postId}
            style={styles.listItem}
            onPress={() => {
              const screen = item.userId === currentUser.userId ? "MyPostDetail" : "PostDetail";
              navigation.navigate(screen, item);
            }}
          >
            <Text style={styles.listTitle}>{item.title}</Text>
            <View style={styles.listInfo}>
              <Text style={styles.listDate}>{item.createdAt?.split("T")[0].split("-").join(".")}</Text>
              <View style={styles.likesContainer}>
                <Feather name="heart" size={16} color="#979C9E" />
                <Text style={styles.likesText}>{item.likesCount}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
      <LogoContainer>
        <Logo width={130} height={30} />
      </LogoContainer>

      {/* 검색창 */}
      <TouchableOpacity onPress={() => navigation.navigate("Search")}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="검색"
            editable={false} // 직접 입력은 막고
            pointerEvents="none" // 터치 이벤트도 무시해서 TouchableOpacity에서만 처리되도록 함
          />
          <Feather name="search" size={26} color={theme.colors.mainBlue} style={styles.searchIcon} />
        </View>
      </TouchableOpacity>

      {/* 카테고리 (Flaticon 기반 아이콘 적용) */}
      <View style={{ marginTop: 30, marginBottom: 10 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={true} contentContainerStyle={{ paddingHorizontal: 10 }}>
          {category.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.categoryItem}
              onPress={() =>
                navigation.navigate("전체글", {
                  category: item.code,
                  categoryName: item.name,
                })
              }
            >
              <Image source={item.image} style={{ width: 35, height: 35 }} resizeMode="contain" />
              <Text style={styles.categoryText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 최신 모임 섹션 */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>최신 모임</Text>
          <TouchableOpacity onPress={() => navigation.navigate("전체글", { category: null, sort: "createdAt" })}>
            <Text style={styles.viewAllButton}>{`전체글 >`}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionContent}>
          <PostList data={latestMeetings} />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>주간 TOP3 모임</Text>
        </View>

        <View style={styles.sectionContent}>
          <PostList data={popularMeetings} />
        </View>
      </ScrollView>
    </View>
  );
};
export default MainPage;
