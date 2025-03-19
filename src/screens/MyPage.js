import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components/native";
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";



// 스타일 정의
const Container = styled.View`
  flex: 1;
  background-color: #fff;
  padding: 20px;
`;

const Header = styled.View`
  align-items: center;
  margin-top: 40px;
`;

const HeaderTitle = styled.Text`
  font-size: 18px;
  font-family: ${({theme}) => theme.fonts.bold};
`;

const MyPageSection = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 30px;
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
  margin-top: 20px;
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
const currentUser = { id:6, name: "홍길동" }; // ✅ 백엔드에서 가져오는 정보


const MyPage = () => {
  const navigation = useNavigation();
  
  // 사용자 정보 및 모임 데이터 상태
  const [user, setUser] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  // 백엔드에서 데이터 가져오는 함수 (현재는 가짜 데이터 사용)
  const fetchProfileData = async () => {
    try {
      // 여기에 실제 API 요청 코드 추가 (예: fetch 또는 axios 사용)
      // const response = await fetch("https://your-api.com/profile");
      // const data = await response.json();

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
              { creatorId:1,id: "1", title: "함께 뜨개질해요!", created_at: "2025.02.17" },
              { creatorId:2,id: "2", title: "퇴근 후 한강 런닝 크루 모집", created_at: "2025.02.11" },
              { creatorId:3,id: "3", title: "볼링 동호회 회원 모집", created_at: "2025.01.25" },
              { creatorId:4,id: "7", title: "요가 클래스 모집", created_at: "2025.02.22" },
              { creatorId:5,id: "8", title: "뮤지컬 관람 모임", created_at: "2025.02.28" },
              { creatorId:7,id: "9", title: "영화 감상 모임", created_at: "2025.03.02" },
            ],
          },
          {
            title: "좋아한 모임",
            data: [
              { creatorId:8,id: "4", title: "돈까스 맛집 탐방", created_at: "2025.01.20" },
              { creatorId:9,id: "5", title: "함께 뜨개질해요!", created_at: "2025.02.17" },
              { creatorId:10,id: "10", title: "보드게임 밤", created_at: "2025.02.15" },
              { creatorId:11,id: "11", title: "주말 등산 모임", created_at: "2025.02.24" },
              { creatorId:12,id: "12", title: "스페인어 스터디", created_at: "2025.03.05" },
              { creatorId:13,id: "13", title: "커피 원두 공유회", created_at: "2025.03.10" },
            ],
          },
          {
            title: "내가 만든 모임",
            data: [
              {creatorId:6, id: "6", title: "함께 뜨개질해요!", created_at: "2025.02.17" },
              { creatorId:6,id: "14", title: "캠핑 동호회", created_at: "2025.03.12" },
              { creatorId:6,id: "15", title: "프랑스어 회화 모임", created_at: "2025.03.18" },
              { creatorId:6,id: "16", title: "다이어트 챌린지", created_at: "2025.03.20" },
              { creatorId:6,id: "17", title: "독서 토론회", created_at: "2025.03.25" },
              { creatorId:6,id: "18", title: "사진 촬영 동호회", created_at: "2025.03.28" },
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
      <Header>
        <HeaderTitle>마이페이지</HeaderTitle>
      </Header>


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
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
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
          key={`${meeting.id}-${meeting.title}`} // ✅ 중복 방지를 위해 id + title 조합
          onPress={() => {
            if (meeting.creatorId === currentUser.id) { // ✅ 내가 작성한 게시글이면 MyPostDetail로 이동
              navigation.navigate("MyPostDetail", { 
                id: meeting.id, 
                title: meeting.title, 
                created_at: meeting.created_at 
              });
            } else { // ✅ 다른 사람이 작성한 게시글이면 PostDetail로 이동
              navigation.navigate("PostDetail", { 
                id: meeting.id, 
                title: meeting.title, 
                created_at: meeting.created_at 
              });
            }
          }}
        >
          <MeetingTitle>{meeting.title}</MeetingTitle>
          <MeetingDate>{meeting.created_at}</MeetingDate>
        </MeetingItem>
      ))}
    </Section>
  )}
/>
    </Container>
  );
};

export default MyPage;

