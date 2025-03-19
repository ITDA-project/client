import React,{useState} from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRoute } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import styled from "styled-components/native";
import Button from "../components/Button";
import Header from "../components/Header";

const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: #fff;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const Info = styled.Text`
  font-size: 16px;
  margin-bottom: 5px;
`;

const RowContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
`;

const LikeText = styled.Text`
  margin-left: 5px;
  font-size: 16px;
  color: ${({ liked }) => (liked ? "#FF6B6B" : "#000")};
`;



// 모임 상세 페이지
const PostDetail = () => {
  const route = useRoute();
  const { id, title = "제목 없음", created_at = "날짜 없음" } = route.params || {};
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(7);

  const toggleLike = () => {
    setLikes(liked ? likes - 1 : likes + 1);
    setLiked(!liked);
  };
  // 더미 데이터 (추후 API 연동 필요)
  const meeting = {
    id,
    title,
    created_at,
    location: "서울 강남구",
    maxParticipants: 10,
    recruitmentPeriod: "2025.02.01 ~ 2025.02.15",
    activityPeriod: "2025.02.20 ~ 2025.03.20",
    deposit: "10,000원",
    tags: ["#뜨개질", "#취미", "#소모임"],
    likes: 7,
  };

  return (
    <Container>
    
        <Header title=""/>

        <Title>{meeting.title}</Title>
        <Info>📍 지역: {meeting.location}</Info>
        <Info>👥 모집 인원: {meeting.maxParticipants}명</Info>
        <Info>🗓 모집 기간: {meeting.recruitmentPeriod}</Info>
        <Info>🎯 활동 기간: {meeting.activityPeriod}</Info>
        <Info>💰 보증금: {meeting.deposit}</Info>
        <Info>🏷 태그: {meeting.tags.join(", ")}</Info>

        <RowContainer>
            <Feather name="heart" size={24} color={liked ? "#FF6B6B" : "#000"} />
            <LikeText>{meeting.likes}</LikeText>
            <Button title="신청하기" onPress={()=>console.log("신청하기")}/>
        </RowContainer>
    </Container>
  );
};

export default PostDetail;
