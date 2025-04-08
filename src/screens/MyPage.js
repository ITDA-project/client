import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components/native";
import { FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import EncryptedStorage from "react-native-encrypted-storage";
import { jwtDecode } from "jwt-decode";
// 스타일 정의
const Container = styled.View`
  flex: 1;
  background-color: #fff;
  padding: 20px;
`;

const MyPageSection = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 50px;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom-width: 1px;
  border-bottom-color: #ddd;
`;

const ProfileImageContainer = styled.View`
  width: 60px;
  height: 60px;
  margin-left: 10px;
  margin-right: 15px;
  border-radius: 30px;
  background-color: #ddd;
  align-items: center;
  justify-content: center;
`;

const ProfileImage = styled.Image`
  width: 100%;
  height: 100%;
  border-radius: 30px;
`;

const UserInfo = styled.View`
  flex: 1;
  margin-left: 5px;
`;

const UserRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const UserName = styled.Text`
  font-size: 20px;
  font-family: ${({ theme }) => theme.fonts.bold};
  color: ${(props) => props.theme.colors.mainBlue};
`;

const StarContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-left: 15px;
`;

const StarText = styled.Text`
  font-size: 14px;
  color: ${(props) => props.theme.colors.mainBlue};
  margin-left: 5px;
  font-family: ${({ theme }) => theme.fonts.extraBold};
`;

const Section = styled.View`
  margin-top: 10px;
  margin-left: 10px;
  margin-bottom: 15px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-family: ${({ theme }) => theme.fonts.bold};
  margin-bottom: 10px;
  color: #656565;
`;

const MeetingItem = styled.TouchableOpacity`
  padding: 8px 0;
`;

const MeetingTitle = styled.Text`
  font-size: 16px;
  font-family: ${({ theme }) => theme.fonts.extraBold};
`;

const MeetingDate = styled.Text`
  font-size: 14px;
  color: ${(props) => props.theme.colors.grey};
  font-family: ${({ theme }) => theme.fonts.regular};
  margin-top: 4px;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

// 현재 로그인한 사용자 (예시: user.id가 1이라고 가정)
const currentUser = { userId: 6, name: "홍길동" }; // ✅ 백엔드에서 가져오는 정보

const MyPage = () => {
  const navigation = useNavigation();

  // 사용자 정보 및 모임 데이터 상태
  const [user, setUser] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProfileData = async () => {
    console.log("🚀 fetchProfileData 실행됨");

    try {
      const accessToken = await EncryptedStorage.getItem("accessToken");
      console.log("🔑 accessToken:", accessToken);

      const decoded = jwtDecode(accessToken);
      console.log("🧩 decoded token:", decoded);

      const response = await axios.get("http://192.168.123.182:8080/api/mypage/full", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const resData = response.data.dtoList;
      console.log("📦 마이페이지 데이터 응답:", resData);

      const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, "0")}.${date.getDate().toString().padStart(2, "0")}`;
      };

      const meetingsData = [
        {
          title: "신청한 모임",
          data: resData.joinedPosts.map((post) => ({
            ...post,
            createdAt: formatDate(post.createdAt),
          })),
        },
        {
          title: "좋아한 모임",
          data: resData.likedPosts.map((post) => ({
            ...post,
            createdAt: formatDate(post.createdAt),
          })),
        },
        {
          title: "내가 만든 모임",
          data: resData.createdPosts.map((post) => ({
            ...post,
            createdAt: formatDate(post.createdAt),
          })),
        },
      ];

      setUser({
        name: resData.name,
        totalStar: resData.ratingAverage,
        image: resData.image,
      });

      setMeetings(meetingsData);
    } catch (error) {
      console.error("데이터 불러오기 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("👀 useEffect 실행됨 - 마이페이지");
    fetchProfileData();
  }, []);

  if (loading) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color="#007AFF" />
      </LoadingContainer>
    );
  }

  return (
    <Container>
      {/* 프로필 영역 */}
      <MyPageSection>
        <ProfileImageContainer>
          {user?.image ? <ProfileImage source={{ uri: user.image }} /> : <Feather name="user" size={30} color="#888" />}
        </ProfileImageContainer>
        <UserInfo>
          <UserRow>
            <UserName>{user?.name || "사용자"}</UserName>
            <StarContainer>
              <MaterialIcons name="star" size={18} color="#FFC107" />
              <StarText>{user?.totalStar || 0.0}</StarText>
            </StarContainer>
          </UserRow>
        </UserInfo>
        <TouchableOpacity onPress={() => navigation.navigate("프로필")}>
          <Feather name="chevron-right" size={24} color="#999" />
        </TouchableOpacity>
      </MyPageSection>

      {/* 모임 리스트 */}
      <FlatList
        data={meetings}
        keyExtractor={(item) => item.title} // ✅ 섹션 타이틀을 key로 사용
        renderItem={({ item }) => (
          <Section>
            <SectionTitle>{item.title}</SectionTitle>
            {item.data.map((meeting) => (
              <MeetingItem
                key={`${meeting.postId}-${meeting.title}`} // ✅ 중복 방지를 위해 id + title 조합
                onPress={() => {
                  if (meeting.userId === currentUser.userId) {
                    // ✅ 내가 작성한 게시글이면 MyPostDetail로 이동
                    navigation.navigate("MyPostDetail", {
                      postId: meeting.postId,
                      title: meeting.title,
                      createdAt: meeting.createdAt,
                    });
                  } else {
                    // ✅ 다른 사람이 작성한 게시글이면 PostDetail로 이동
                    navigation.navigate("PostDetail", {
                      postId: meeting.postId,
                      title: meeting.title,
                      createdAt: meeting.createdAt,
                    });
                  }
                }}
              >
                <MeetingTitle>{meeting.title}</MeetingTitle>
                <MeetingDate>{meeting.createdAt}</MeetingDate>
              </MeetingItem>
            ))}
          </Section>
        )}
      />
    </Container>
  );
};

export default MyPage;
