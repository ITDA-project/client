import React, { useCallback, useState } from "react";
import styled from "styled-components/native";
import { FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
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
  min-height: 160px;
  justify-content: center;
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

const PlaceholderWrapper = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  height: 130px;
`;

const Placeholder = styled.Text`
  font-size: 16px;
  color: ${(props) => props.theme.colors.grey};
  font-family: ${({ theme }) => theme.fonts.regular};
  text-align: center;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const MyPage = () => {
  const navigation = useNavigation();

  // 사용자 정보 및 모임 데이터 상태
  const [user, setUser] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        try {
          const token = await EncryptedStorage.getItem("accessToken");
          if (!token) throw new Error("토큰 없음");

          const userInfoRes = await axios.get("http://10.0.2.2:8080/api/mypage/me", {
            headers: { access: token },
          });

          const userId = userInfoRes.data.data;
          setCurrentUserId({ userId });

          const profileRes = await axios.get("http://10.0.2.2:8080/api/mypage/full", {
            headers: { access: token },
          });

          const resData = profileRes.data.data;
          console.log("마이페이지 data: ", resData);
          const formatDate = (isoDate) => {
            const date = new Date(isoDate);
            return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, "0")}.${date.getDate().toString().padStart(2, "0")}`;
          };

          const myPostIds = resData.createdPosts?.map((post) => post.id) || [];

          setUser({
            name: resData.name,
            totalStar: resData.ratingAverage,
            image: resData.image,
          });

          setMeetings([
            {
              title: "신청한 모임",
              data:
                resData.joinedPosts?.map((post) => ({
                  ...post,
                  postId: post.id,
                  createdAt: formatDate(post.createdAt),
                  userId: post.userId,
                })) || [],
            },
            {
              title: "좋아한 모임",
              data:
                resData.likedPosts?.map((post) => ({
                  ...post,
                  postId: post.id,
                  createdAt: formatDate(post.createdAt),
                  userId: myPostIds.includes(post.id) ? userId : post.userId,
                })) || [],
            },
            {
              title: "내가 만든 모임",
              data:
                resData.createdPosts?.map((post) => ({
                  ...post,
                  postId: post.id,
                  createdAt: formatDate(post.createdAt),
                  userId: userId,
                })) || [],
            },
          ]);
        } catch (e) {
          console.warn("📛 마이페이지 정보 로딩 실패:", e);
          setUser({ name: "사용자", totalStar: 0 });
          setMeetings([
            { title: "신청한 모임", data: [] },
            { title: "좋아한 모임", data: [] },
            { title: "내가 만든 모임", data: [] },
          ]);
        } finally {
          setLoading(false);
        }
      };

      load();
    }, [])
  );
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
        <TouchableOpacity
          onPress={() => {
            if (currentUserId && currentUserId.userId) {
              navigation.navigate("프로필", { userId: currentUserId.userId });
            } else {
              // fallback: 유저 ID 없이 기본 프로필 보여주기
              navigation.navigate("프로필", { fallback: true });
            }
          }}
        >
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

            {item.data.length === 0 ? (
              <PlaceholderWrapper>
                <Placeholder>모임이 없습니다</Placeholder>
              </PlaceholderWrapper>
            ) : (
              item.data.map((meeting) => (
                <MeetingItem
                  key={`${meeting.postId}-${meeting.title}`}
                  onPress={() => {
                    console.log("🆔 meeting.userId:", meeting.userId, "🧑 currentUser.userId:", currentUserId.userId);

                    const isMine = String(meeting.userId) === String(currentUserId.userId);
                    const screen = isMine ? "MyPostDetail" : "PostDetail";

                    navigation.navigate(screen, meeting);
                  }}
                >
                  <MeetingTitle>{meeting.title}</MeetingTitle>
                  <MeetingDate>{meeting.createdAt}</MeetingDate>
                </MeetingItem>
              ))
            )}
          </Section>
        )}
      />
    </Container>
  );
};

export default MyPage;
