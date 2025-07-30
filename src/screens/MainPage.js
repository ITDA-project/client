import React, { useCallback, useContext, useEffect, useState } from "react";
import { Image, View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { ThemeContext, styled } from "styled-components/native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import Logo from "../../assets/logo.svg";
import axios from "axios";
import EncryptedStorage from "react-native-encrypted-storage";

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
  const [currentUserId, setCurrentUserId] = useState(null);

  const fetchUserInfo = async () => {
    try {
      const token = await EncryptedStorage.getItem("accessToken");
      console.log("🔑 accessToken:", token);
      const response = await axios.get("http://10.0.2.2:8080/api/mypage/me", {
        headers: {
          access: `${token}`,
        },
      });
      setCurrentUserId(response.data.data);
    } catch (error) {
      console.log("유저 정보 가져오기 실패:", error);
    }
  };

  const fetchMainData = async () => {
    try {
      setLoading(true);

      const [latestRes, popularRes] = await Promise.all([
        axios.get("http://10.0.2.2:8080/api/posts/list", {
          params: { sort: "createdAt", size: 3 },
        }),
        axios.get("http://10.0.2.2:8080/api/posts/list", {
          params: { sort: "likesCount", size: 3 },
        }),
      ]);

      const latestList = latestRes?.data?.dtoList ?? [];
      const popularList = popularRes?.data?.dtoList ?? [];

      console.log("📦 최신 모임:", latestRes.data);
      console.log("📦 인기 모임:", popularRes.data);

      setLatestMeetings(latestList);
      setPopularMeetings(popularList);
    } catch (error) {
      console.error("❌ 메인 페이지 데이터 로딩 실패:", error);
      setLatestMeetings([]); // fallback
      setPopularMeetings([]);
    } finally {
      setLoading(false);
    }
  };
  useFocusEffect(
    useCallback(() => {
      fetchUserInfo();
      fetchMainData();
    }, [])
  );

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
      minHeight: 120,
      justifyContent: "center",
      marginBottom: 10,
    },
    sectionHeader: {
      flexDirection: "row", // 가로 정렬
      justifyContent: "space-between", // 양 끝 정렬
      alignItems: "center", // 수직 중앙 정렬
    },
    sectionTitle: { fontSize: 20, fontFamily: theme.fonts.bold, marginTop: 25, marginBottom: 2, color: "#656565" },

    viewAllButton: { fontSize: 16, marginLeft: "auto", fontFamily: theme.fonts.bold },

    listItem: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: "#ddd" },
    listTitle: { fontSize: 16, fontFamily: theme.fonts.extraBold, color: theme.grey },
    listInfo: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
    listDate: { color: "#888", fontFamily: theme.fonts.regular },
    likesContainer: { flexDirection: "row", alignItems: "center", marginLeft: "auto", justifyContent: "center" },
    likesText: { marginLeft: 5, color: "#979C9E", fontFamily: theme.fonts.bold },
  });

  //Section 컴포넌트
  const Section = ({ title, showViewAll, onViewAllPress, children }) => (
    <View style={{ marginBottom: 40 }}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {showViewAll && (
          <TouchableOpacity onPress={onViewAllPress}>
            <Text style={styles.viewAllButton}>{`전체글 >`}</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );

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
        <View style={{ minHeight: 100, alignItems: "center", justifyContent: "center", marginVertical: 20, paddingBottom: 10 }}>
          <Text style={{ fontSize: 16, color: "#888", fontFamily: theme.fonts.regular }}>모아모아의 첫 모임을 생성해보세요!</Text>
        </View>
      );
    }

    return (
      <View style={{ minHeight: 150 }}>
        {data.map((item) => (
          <TouchableOpacity
            key={item.postId}
            style={styles.listItem}
            onPress={() => {
              console.log("📌 postId:", item.postId, "item.userId:", item.userId, "currentUserId:", currentUserId);

              const screen = currentUserId && String(item.userId) === String(currentUserId) ? "MyPostDetail" : "PostDetail";
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

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between", paddingBottom: 100 }}>
        <Section title="최신 모임" showViewAll onViewAllPress={() => navigation.navigate("전체글", { category: null, sort: "createdAt" })}>
          <PostList data={latestMeetings} />
        </Section>

        <Section title="주간 TOP3 모임">
          <PostList data={popularMeetings} />
        </Section>
      </ScrollView>
    </View>
  );
};
export default MainPage;
