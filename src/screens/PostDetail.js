import React, { useState, useContext } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Feather, AntDesign, Ionicons, FontAwesome6 } from "@expo/vector-icons";
import { styled, ThemeContext } from "styled-components/native";
import Button from "../components/Button";
import { TouchableOpacity } from "react-native";


const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: #fff;
`;
const Section = styled.View`
  min-height: 100px;
  margin-bottom: 10px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  font-family: ${({ theme }) => theme.fonts.extraBold};
  margin-top: 10px;
`;
const Date = styled.Text`
  color: ${({ theme }) => theme.colors.grey};
  font-size: 14px;
  font-family: ${({ theme }) => theme.fonts.regular};
  margin-top: 5px;
`;

const Content = styled.Text`
  font-size: 18px;
  font-family: ${({ theme }) => theme.fonts.regular};
  line-height: 30px;
  margin-top: 15px;
  margin-bottom: 20px;
`;

const Info = styled.Text`
  font-size: 16px;
  font-family: ${({ theme }) => theme.fonts.regular};
`;

const Divider = styled.View`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.grey};
  margin-top: 15px;
`;

const ProfileContainer = styled.View`
  flex-direction: column; /* 전체를 세로 정렬 */
  margin-top: 10px;
  margin-left: 10px;
  margin-right: 10px;
`;

const ProfileHeader = styled.View`
  flex-direction: row; /* 프로필 이미지 + "작성자" 라벨 + 닉네임을 가로 정렬 */
  align-items: center;
  margin-bottom: 5px;
`;

const ProfileImageContainer = styled.View`
  width: 50px;
  height: 50px;
  margin-right: 10px;
  border-radius: 30px;
  background-color: #ddd;
  align-items: center;
  justify-content: center;
`;

const ProfileImage = styled.Image`
  width: 100%;
  height: 100%;
  border-radius: 25px;
`;

const RowContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Label = styled.Text`
  font-size: 16px;
  font-family: ${({ theme }) => theme.fonts.regular};
  color: ${({ theme }) => theme.colors.grey};
  margin-right: 5px;
`;

const ProfileName = styled.Text`
  font-size: 18px;
  font-family: ${({ theme }) => theme.fonts.bold};
  color: #000;
`;

const ProfileIntro = styled.Text`
  font-size: 16px;
  color: #444;
  line-height: 22px; /* 줄 간격 조정 */
  margin-top: 15px;
`;

const Footer = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  margin-bottom: 10px;
  background-color: #fff;
  padding: 10px 20px;
  border-top-width: 1px;
  border-color: ${({ theme }) => theme.colors.grey};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const LikeButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-left: 5px;
`;

const LikeText = styled.Text`
  margin-left: 5px;
  font-size: 16px;
  color: ${({ liked }) => (liked ? "#FF6B6B" : "#000")};
`;

// 모임 상세 페이지
const PostDetail = () => {
  const theme = useContext(ThemeContext);
  const route = useRoute();
  const navigation = useNavigation();
  const {
    postId,
    title = "제목 없음",
    createdAt = "날짜 없음",
  } = route.params || {};
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(7);

  const toggleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  // 더미 데이터 (추후 API 연동 필요)
  const meeting = {
    postId,
    title,
    createdAt,
    content:
      "뜨개질이 취미이신 분? \n처음이지만 같이 해보실 분?\n모두모두 환영합니다! 😊",
    location: "서울 종로구",
    maxParticipants: "10",
    recruitmentStart: "2025.02.22",
    recruitmentEnd: "2025.03.01",
    activityStart: "2025.03.08",
    activityEnd: "202.04.08",
    deposit: "5,000원",
    tags: ["#취미", "#뜨개질", "#종로구"],
    likes: 7,
  };

  // 작성자 더미 데이터
  const user = {
    userId:1,
    name: "홍길동",
    career:
      "안녕하세요~ 홍길동입니다.\n2024년부터 독서 모임장으로 활동하고 있어요!",
    image: null, // 프로필 사진이 없을 경우 기본 아이콘 사용
  };

  return (
    <Container>
      <Section>
        <RowContainer
          style={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <Title>{meeting.title}</Title>
          <Ionicons
            name="share-outline"
            size={25}
            onPress={() => console.log("공유하기")}
          />
        </RowContainer>

        <Date>{meeting.createdAt}</Date>
        <Content>{meeting.content}</Content>
        <RowContainer style={{ marginBottom: 10 }}>
          <Ionicons
            name="location-outline"
            size={24}
            color={theme.colors.grey}
          />
          <Label style={{ marginRight: 40, marginLeft: 5 }}>지역</Label>
          <Info>{meeting.location}</Info>
        </RowContainer>

        <RowContainer style={{ marginBottom: 10 }}>
          <Ionicons name="people-outline" size={24} color={theme.colors.grey} />
          <Label style={{ marginRight: 13, marginLeft: 5 }}>모집인원</Label>
          <Info>{meeting.maxParticipants}</Info>
        </RowContainer>

        <RowContainer style={{ marginBottom: 10 }}>
          <Ionicons
            name="calendar-outline"
            size={24}
            color={theme.colors.grey}
          />
          <Label style={{ marginRight: 13, marginLeft: 5 }}>모집기간</Label>
          <Info>
            {meeting.recruitmentStart} ~ {meeting.recruitmentEnd}
          </Info>
        </RowContainer>

        <RowContainer style={{ marginBottom: 10 }}>
          <Ionicons name="timer-outline" size={24} color={theme.colors.grey} />
          <Label style={{ marginRight: 13, marginLeft: 5 }}>활동기간</Label>
          <Info>
            {meeting.activityStart} ~ {meeting.activityEnd}
          </Info>
        </RowContainer>

        <RowContainer style={{ marginBottom: 10 }}>
          <Feather name="dollar-sign" size={24} color={theme.colors.grey} />
          <Label style={{ marginRight: 26, marginLeft: 5 }}>보증금</Label>
          <Info>{meeting.deposit}</Info>
        </RowContainer>

        <Info style={{ color: "#3386CA", marginTop: 10 }}>
          {meeting.tags.join("  ")}
        </Info>

        <Divider />
      </Section>

      {/* 작성자 정보 섹션 */}
      <TouchableOpacity onPress={()=>navigation.navigate("공개프로필",{userId:user.userId})}>
        <ProfileContainer>
          <ProfileHeader>
            <ProfileImageContainer>
              {user.image ? (
                <ProfileImage source={{ uri: user.image }} />
              ) : (
                <Feather name="user" size={35} color="#888" />
              )}
            </ProfileImageContainer>

            <RowContainer>
              <Label>작성자</Label>
              <ProfileName>{user.name}</ProfileName>
            </RowContainer>
          </ProfileHeader>
          <ProfileIntro>{user.career}</ProfileIntro>
        </ProfileContainer>
      </TouchableOpacity>
      
      {/* 하단 좋아요 & 신청 버튼 고정 */}
      <Footer>
        <LikeButton onPress={toggleLike}>
          {liked ? (
            <AntDesign name="heart" size={28} color="#FF6B6B" /> // 꽉 찬 하트
          ) : (
            <Feather name="heart" size={28} color="#000" /> // 빈 하트
          )}
          <LikeText liked={liked}>{likes}</LikeText>
        </LikeButton>
        <Button
          title="신청하기"
          onPress={() => console.log("신청하기")}
          containerStyle={{ height: 50, width: 280 }}
          textStyle={{ marginLeft: 0 }}
          style={{ height: 50, width: 280 }}
        />
      </Footer>
    </Container>
  );
};

export default PostDetail;
