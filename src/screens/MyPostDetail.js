import React, { useState, useContext } from "react";
import { TouchableWithoutFeedback, Alert } from "react-native";
import { useRoute } from "@react-navigation/native";
import { Feather, AntDesign, Ionicons, FontAwesome6 } from "@expo/vector-icons";
import { styled, ThemeContext } from "styled-components/native";
import Button from "../components/Button";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { ScrollView } from "react-native-gesture-handler";
import useRequireLogin from "../hooks/useRequireLogin";
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

const MoreMenu = styled.View`
  position: absolute;
  top: 40px;
  right: 0px;
  background-color: #fff;
  border: 1px;
  border-color: ${({ theme }) => theme.colors.grey};
  border-radius: 8px;
  padding: 5px;
  z-index: 10;
`;

const MenuItem = styled.TouchableOpacity`
  padding: 10px 15px;
`;

const MenuText = styled.Text`
  font-size: 14px;
  font-family: ${({ theme }) => theme.fonts.regular};
  color: ${({ danger }) => (danger ? "red" : "#000")};
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
const MyPostDetail = () => {
  const theme = useContext(ThemeContext);
  const route = useRoute();
  const navigation = useNavigation();

  const { checkLogin, LoginAlert } = useRequireLogin();
  const { postId } = route.params || {};

  const [meeting, setMeeting] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [menuVisible, setMenuVisible] = useState(false);

  const fetchMeeting = async () => {
    try {
      const token = await EncryptedStorage.getItem("accessToken");
      const response = await axios.get(`http://192.168.123.182:8080/api/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data.data;
      setMeeting(data);
      setLiked(data.liked || false);
      setLikes(data.likesCount);
    } catch (error) {
      console.error("게시글 상세 데이터 로드 실패:", error);
    }
  };

  useEffect(() => {
    fetchMeeting();
  }, [postId]);

  const toggleLike = async () => {
    try {
      const token = await EncryptedStorage.getItem("accessToken");
      if (!liked) {
        await axios.post(`http://192.168.123.182:8080/posts/${postId}/likes`, null, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLiked(true);
        setLikes((prev) => prev + 1);
      } else {
        await axios.delete(`http://192.168.123.182:8080/likes/${meeting.likeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLiked(false);
        setLikes((prev) => prev - 1);
      }
    } catch (error) {
      console.error("좋아요 처리 실패:", error);
    }
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const closeMenu = () => {
    setMenuVisible(false);
  };

  const handleEdit = () => {
    setMenuVisible(false);
    navigation.navigate("모임수정", {
      postId: meeting.postId,
      title: meeting.title,
      description: meeting.content,
      selectedCity: "서울", // 예시로 넣은 값
      selectedDistrict: "종로구", // 예시로 넣은 값
      category: "취미", // 실제로는 state나 API에서 받아야 함
      maxParticipants: meeting.memberMax,
      deposit: meeting.deposit,
      tags: meeting.tags.join(" "),
      recruitmentStart: meeting.recruitmentStart,
      recruitmentEnd: meeting.recruitmentEnd,
      activityStart: meeting.activityStart,
      activityEnd: meeting.activityEnd,
    });
  };

  /*const deletePost = async (postId) => {
  const response = await axios.delete(`https://your-api-url.com/posts/${postId}`);
  return response.data;
};*/

  const handleDelete = () => {
    setMenuVisible(false);
    Alert.alert("게시글 삭제", "정말 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      { text: "삭제", onPress: () => console.log("게시글 삭제") },
      /*async () => {
        try {
          await deletePost(postId); // 삭제 API 호출
          Alert.alert("삭제 완료", "게시글이 삭제되었습니다.");
          navigation.goBack(); // 이전 화면으로 이동 (또는 원하는 화면으로)
        } catch (error) {
          console.error("게시글 삭제 실패", error);
          Alert.alert("삭제 실패", "게시글 삭제 중 오류가 발생했습니다.");
        }
      } 
    },*/
    ]);
  };

  // 작성자 더미 데이터
  const user = {
    name: "홍길동",
    career: "안녕하세요~ 홍길동입니다.\n2024년부터 독서 모임장으로 활동하고 있어요!",
    image: null, // 프로필 사진이 없을 경우 기본 아이콘 사용
  };

  return (
    <TouchableWithoutFeedback onPress={closeMenu}>
      <Container>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          <Section>
            <RowContainer style={{ justifyContent: "space-between", alignItems: "center" }}>
              <Title>{meeting.title}</Title>
              <RowContainer>
                <Ionicons style={{ marginRight: 10 }} name="share-outline" size={25} onPress={() => console.log("공유하기")} />
                <Feather name="more-horizontal" size={25} color="#000" onPress={toggleMenu} />
              </RowContainer>
            </RowContainer>

            {menuVisible && (
              <MoreMenu>
                <MenuItem onPress={handleEdit}>
                  <MenuText>수정</MenuText>
                </MenuItem>
                <Divider style={{ marginTop: 0, PointerEvent: "none" }} />
                <MenuItem onPress={handleDelete}>
                  <MenuText danger>삭제</MenuText>
                </MenuItem>
              </MoreMenu>
            )}
            <Date>{meeting.createdAt}</Date>
            <Content>{meeting.content}</Content>
            <RowContainer style={{ marginBottom: 10 }}>
              <Ionicons name="location-outline" size={24} color={theme.colors.grey} />
              <Label style={{ marginRight: 40, marginLeft: 5 }}>지역</Label>
              <Info>{meeting.location}</Info>
            </RowContainer>

            <RowContainer style={{ marginBottom: 10 }}>
              <Ionicons name="people-outline" size={24} color={theme.colors.grey} />
              <Label style={{ marginRight: 13, marginLeft: 5 }}>모집인원</Label>
              <Info>{meeting.memberMax}</Info>
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
        </ScrollView>
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
            title="신청 목록 확인"
            onPress={() => checkLogin("신청서 목록")}
            containerStyle={{ height: 50, width: 280 }}
            textStyle={{ marginLeft: 0 }}
            style={{ height: 50, width: 280 }}
          />
          <LoginAlert />
        </Footer>
      </Container>
    </TouchableWithoutFeedback>
  );
};

export default MyPostDetail;
