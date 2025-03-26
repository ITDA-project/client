import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components/native";
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";


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
  margin-bottom:20px;
  padding-bottom: 10px;
  border-bottom-width: 1px;
  border-bottom-color: #ddd;
`;

const ProfileImageContainer = styled.View`
  width: 60px;
  height: 60px;
  margin-left:10px;
  margin-right:15px;
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
  font-family: ${({theme}) => theme.fonts.bold};
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
  font-family: ${({theme}) => theme.fonts.extraBold};
`;

const Section = styled.View`
  margin-top: 10px;
  margin-left: 10px;
  margin-bottom: 15px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-family: ${({theme}) => theme.fonts.bold};
  margin-bottom: 10px;
  color:#656565;
`;

const MeetingItem = styled.TouchableOpacity`
  padding: 8px 0;
`;

const MeetingTitle = styled.Text`
  font-size: 16px;
  font-family: ${({theme}) => theme.fonts.extraBold};
`;

const MeetingDate = styled.Text`
  font-size: 14px;
  color:${(props) => props.theme.colors.grey};
  font-family: ${({theme}) => theme.fonts.regular};
  margin-top: 4px;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

// 현재 로그인한 사용자 (예시: user.id가 1이라고 가정)
const currentUser = { userId:6, name: "홍길동" }; // ✅ 백엔드에서 가져오는 정보


const MyPage = () => {
  const navigation = useNavigation();
  
  // 사용자 정보 및 모임 데이터 상태
  const [user, setUser] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  // 백엔드에서 데이터 가져오는 함수 (현재는 가짜 데이터 사용)
  const fetchProfileData = async () => {
    try {
      
      // 더미 데이터 (백엔드 연결 시 삭제)
      const data = {
        user: {
          name: "홍길동",
          totalStar: 4.5,
          profileImage: "https://via.placeholder.com/50", // 프로필 이미지 (테스트용)
        },
        meetings: [
          {
            title: "신청한 모임",
            data: [
              { creatorId:1,postId: "1", title: "함께 뜨개질해요!", createdAt: "2025.02.17" },
              { creatorId:2,postId: "2", title: "퇴근 후 한강 런닝 크루 모집", createdAt: "2025.02.11" },
              { creatorId:3,postId: "3", title: "볼링 동호회 회원 모집", createdAt: "2025.01.25" },
              { creatorId:4,postId: "7", title: "요가 클래스 모집", createdAt: "2025.02.22" },
              { creatorId:5,postId: "8", title: "뮤지컬 관람 모임", createdAt: "2025.02.28" },
              { creatorId:7,postId: "9", title: "영화 감상 모임", createdAt: "2025.03.02" },
            ],
          },
          {
            title: "좋아한 모임",
            data: [
              { userId:8,postId: "4", title: "돈까스 맛집 탐방", createdAt: "2025.01.20" },
              { userId:9,postId: "5", title: "함께 뜨개질해요!", createdAt: "2025.02.17" },
              { userId:10,postId: "10", title: "보드게임 밤", createdAt: "2025.02.15" },
              { userId:11,postId: "11", title: "주말 등산 모임", createdAt: "2025.02.24" },
              { userId:12,postId: "12", title: "스페인어 스터디", createdAt: "2025.03.05" },
              { userId:13,postId: "13", title: "커피 원두 공유회", createdAt: "2025.03.10" },
            ],
          },
          {
            title: "내가 만든 모임",
            data: [
              {userId:6, postId: "6", title: "함께 뜨개질해요!", createdAt: "2025.02.17" },
              { userId:6,postId: "14", title: "캠핑 동호회", createdAt: "2025.03.12" },
              { userId:6,postId: "15", title: "프랑스어 회화 모임", createdAt: "2025.03.18" },
              { userId:6,postId: "16", title: "다이어트 챌린지", createdAt: "2025.03.20" },
              { userId:6,postId: "17", title: "독서 토론회", createdAt: "2025.03.25" },
              { userId:6,postId: "18", title: "사진 촬영 동호회", createdAt: "2025.03.28" },
            ],
          },
        ],
      };

      setUser(data.user);
      setMeetings(data.meetings);
    } catch (error) {
      console.error("데이터 불러오기 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  /*
  const fetchProfileData = async () => {
  try {
    const response = await axios.get("https://your-api.com/profile");
    setUser(response.data.user);
    setMeetings(response.data.meetings);
  } catch (error) {
    console.error("데이터 불러오기 실패:", error);
  } finally {
    setLoading(false);
  }
};
  */
  useEffect(() => {
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
            {user.image ? (
                <ProfileImage source={{ uri: user.image }} />
                ) : (
                <Feather name="user" size={30} color="#888" />
                )}
        </ProfileImageContainer>
        <UserInfo>
          <UserRow>
            <UserName>{user.name}</UserName>
            <StarContainer>
              <MaterialIcons name="star" size={18} color="#FFC107" />
              <StarText>{user.totalStar}</StarText>
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
            if (meeting.userId === currentUser.userId) { // ✅ 내가 작성한 게시글이면 MyPostDetail로 이동
              navigation.navigate("MyPostDetail", { 
                postId: meeting.postId, 
                title: meeting.title, 
                createdAt: meeting.createdAt 
              });
            } else { // ✅ 다른 사람이 작성한 게시글이면 PostDetail로 이동
              navigation.navigate("PostDetail", { 
                postId: meeting.postId, 
                title: meeting.title, 
                createdAt: meeting.createdAt 
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

