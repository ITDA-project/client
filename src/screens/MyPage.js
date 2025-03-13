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
  font-weight: bold;
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
  font-weight: bold;
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
  font-weight: bold;
`;

const Section = styled.View`
  margin-top: 20px;
  margin-left: 10px;
  margin-bottom: 15px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  color:${(props) => props.theme.colors.grey};
`;

const MeetingItem = styled.TouchableOpacity`
  padding: 8px 0;
`;

const MeetingTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
`;

const MeetingDate = styled.Text`
  font-size: 14px;
  color:${(props) => props.theme.colors.grey};
  margin-top: 4px;
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
              { id: "1", title: "함께 뜨개질해요!", date: "2025.02.17" },
              { id: "2", title: "퇴근 후 한강 런닝 크루 모집", date: "2025.02.11" },
              { id: "3", title: "볼링 동호회 회원 모집", date: "2025.01.25" },
              { id: "7", title: "요가 클래스 모집", date: "2025.02.22" },
              { id: "8", title: "뮤지컬 관람 모임", date: "2025.02.28" },
              { id: "9", title: "영화 감상 모임", date: "2025.03.02" },
            ],
          },
          {
            title: "좋아한 모임",
            data: [
              { id: "4", title: "돈까스 맛집 탐방", date: "2025.01.20" },
              { id: "5", title: "함께 뜨개질해요!", date: "2025.02.17" },
              { id: "10", title: "보드게임 밤", date: "2025.02.15" },
              { id: "11", title: "주말 등산 모임", date: "2025.02.24" },
              { id: "12", title: "스페인어 스터디", date: "2025.03.05" },
              { id: "13", title: "커피 원두 공유회", date: "2025.03.10" },
            ],
          },
          {
            title: "내가 만든 모임",
            data: [
              { id: "6", title: "함께 뜨개질해요!", date: "2025.02.17" },
              { id: "14", title: "캠핑 동호회", date: "2025.03.12" },
              { id: "15", title: "프랑스어 회화 모임", date: "2025.03.18" },
              { id: "16", title: "다이어트 챌린지", date: "2025.03.20" },
              { id: "17", title: "독서 토론회", date: "2025.03.25" },
              { id: "18", title: "사진 촬영 동호회", date: "2025.03.28" },
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
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <Section>
            <SectionTitle>{item.title}</SectionTitle>
            {item.data.map((meeting) => (
              <MeetingItem key={meeting.id} onPress={() => console.log("게시글 상세")}>
                <MeetingTitle>{meeting.title}</MeetingTitle>
                <MeetingDate>{meeting.date}</MeetingDate>
              </MeetingItem>
            ))}
          </Section>
        )}
      />
    </Container>
  );
};

export default MyPage;

