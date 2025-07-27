import React, { useState, useContext, useEffect } from "react";
import { useRoute, useNavigation, useIsFocused } from "@react-navigation/native";
import { Feather, AntDesign, Ionicons } from "@expo/vector-icons";
import { styled, ThemeContext } from "styled-components/native";
import { Button, AlertModal } from "../components";
import { TouchableOpacity, Text } from "react-native";
import useRequireLogin from "../hooks/useRequireLogin";
import axios from "axios";
import EncryptedStorage from "react-native-encrypted-storage";

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
const DateText = styled.Text`
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
  const { checkLogin, LoginAlert } = useRequireLogin();
  const theme = useContext(ThemeContext);
  const route = useRoute();
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const { postId } = route.params || {};

  const [meeting, setMeeting] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likeId, setLikeId] = useState(null);
  const [likes, setLikes] = useState(0);
  const [user, setUser] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isApplied, setIsApplied] = useState(false);

  const fetchDetail = async () => {
    try {
      const accessToken = await EncryptedStorage.getItem("accessToken");

      const headers = accessToken ? { access: accessToken } : {};

      const res = await axios.get(`http://10.0.2.2:8080/api/posts/${postId}`, { headers });
      const data = res.data.data;

      console.log("📡 상세 데이터:", res);

      console.log("❤️ 좋아요 여부:", data.liked);
      console.log("📄 신청서 ID:", data.formId);

      setMeeting({
        postId: data.id,
        title: data.title,
        createdAt: data.createdAt.split("T")[0].split("-").join("."),
        content: data.content,
        location: data.location,
        maxParticipants: data.membersMax,
        recruitmentStart: data.createdAt.split("T")[0].split("-").join("-"),
        recruitmentEnd: data.dueDate,
        activityStart: data.activityStartDate,
        activityEnd: data.activityEndDate,
        deposit: data.warranty,
        tags: [`#${data.category}`],
        likes: data.likesCount,
        likeId: data.likeId,
      });
      setUser({
        userId: data.userId,
        name: data.userName,
        career: data.userCareer,
        image: data.userImage,
      });
      setLikes(data.likesCount);
      setLiked(data.liked ?? false);
      setIsApplied(!!data.formId);
    } catch (e) {
      console.error("상세 데이터 로딩 실패", e);
    }
  };
  useEffect(() => {
    if (isFocused) {
      fetchDetail();
    }
  }, [isFocused]);

  const toggleLike = async () => {
    try {
      const accessToken = await EncryptedStorage.getItem("accessToken");

      if (!accessToken) {
        setAlertMessage("로그인이 필요합니다");
        setAlertVisible(true);
        return;
      }

      if (!liked) {
        console.log("📡 좋아요 요청 보내는 중...");
        const res = await axios.post(
          `http://10.0.2.2:8080/api/posts/${postId}/likes`,
          {},
          {
            headers: { access: `${accessToken}` },
          }
        );
        console.log("👍 좋아요 등록 성공:", res.data);

        if (res.status === 201) {
          setLiked(true);
          setLikes((prev) => prev + 1);
        }
      } else {
        const res = await axios.delete(`http://10.0.2.2:8080/api/posts/${postId}/likes`, {
          headers: { access: `${accessToken}` },
        });

        if (res.status === 200) {
          setLiked(false);
          setLikes((prev) => prev - 1);

          setTimeout(() => {
            fetchDetail(); // 딜레이 후 동기화
          }, 2000); // 1초 뒤에 데이터 재요청
        }
      }
    } catch (error) {
      console.error("❌ 좋아요 처리 중 오류 발생:", error?.message || error);
      if (error.response) {
        console.log("📡 서버 응답 상태 코드:", error.response.status);
        console.log("📡 서버 응답 데이터:", error.response.data);
      } else if (error.request) {
        console.log("📡 요청은 갔지만 응답이 없음:", error.request);
      } else {
        console.log("📡 설정 중 오류:", error.message);
      }
      setAlertMessage("좋아요 처리 중 문제가 발생했습니다.");
      setAlertVisible(true);
    }
  };

  if (!meeting || !user) {
    return <Text>불러오는 중...</Text>; // 또는 ActivityIndicator
  }
  const recruitmentDeadline = new Date(`${meeting.recruitmentEnd}T23:59:59`);
  const isRecruitmentClosed = recruitmentDeadline < new Date();

  return (
    <Container>
      <Section>
        <RowContainer style={{ justifyContent: "space-between", alignItems: "center" }}>
          <Title>{meeting.title}</Title>
          <Ionicons name="share-outline" size={25} onPress={() => console.log("공유하기")} />
        </RowContainer>

        <DateText>{meeting.createdAt}</DateText>
        <Content>{meeting.content}</Content>
        <RowContainer style={{ marginBottom: 10 }}>
          <Ionicons name="location-outline" size={24} color={theme.colors.grey} />
          <Label style={{ marginRight: 40, marginLeft: 5 }}>지역</Label>
          <Info>{meeting.location}</Info>
        </RowContainer>

        <RowContainer style={{ marginBottom: 10 }}>
          <Ionicons name="people-outline" size={24} color={theme.colors.grey} />
          <Label style={{ marginRight: 13, marginLeft: 5 }}>모집인원</Label>
          <Info>{meeting.maxParticipants}</Info>
        </RowContainer>

        <RowContainer style={{ marginBottom: 10 }}>
          <Ionicons name="calendar-outline" size={24} color={theme.colors.grey} />
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

        <Info style={{ color: "#3386CA", marginTop: 10 }}>{meeting.tags.join("  ")}</Info>

        <Divider />
      </Section>

      {/* 작성자 정보 섹션 */}

      <TouchableOpacity onPress={() => navigation.navigate("공개프로필", { userId: user.userId })}>
        <ProfileContainer>
          <ProfileHeader>
            <ProfileImageContainer>
              {user.image ? <ProfileImage source={{ uri: user.image }} /> : <Feather name="user" size={35} color="#888" />}
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
          title={isRecruitmentClosed ? "모집마감" : isApplied ? "신청완료" : "신청하기"}
          onPress={() => {
            if (!isRecruitmentClosed) {
              checkLogin("신청서 작성", {
                postId,
                onComplete: () => {
                  setIsApplied(true);
                },
              });
            }
          }}
          disabled={isRecruitmentClosed || isApplied}
          containerStyle={{
            height: 50,
            width: 280,
            backgroundColor: theme.colors.mainBlue,
          }}
          textStyle={{ marginLeft: 0 }}
          style={{ height: 50, width: 280 }}
        />
        <LoginAlert />
      </Footer>
      <AlertModal
        visible={alertVisible}
        message={alertMessage}
        onConfirm={() => {
          setAlertVisible(false);
        }}
      />
    </Container>
  );
};

export default PostDetail;
