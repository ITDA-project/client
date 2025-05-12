import React, { useState, useContext, useEffect } from "react";
import { TouchableWithoutFeedback, Alert, Text } from "react-native";
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
  const [likeId, setLikeId] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);

  const [user, setUser] = useState(null);

  const fetchDetail = async () => {
    try {
      const accessToken = await EncryptedStorage.getItem("accessToken");

      const headers = accessToken ? { access: accessToken } : {};

      const res = await axios.get(`http://10.0.2.2:8080/api/posts/${postId}`, { headers });
      const useridid = res.data.data.userId;
      const data = res.data.data;

      console.log("📡 상세 데이터:", useridid);
      console.log("❤️ 좋아요 여부:", data.liked);

      setMeeting({
        postId: data.id,
        title: data.title,
        createdAt: data.createdAt.split("T")[0].split("-").join("."),
        content: data.content,
        location: data.location,
        memberMax: data.membersMax,
        recruitmentStart: data.createdAt.split("T")[0].split("-").join("-"),
        recruitmentEnd: data.dueDate,
        activityStart: data.activityStartDate,
        activityEnd: data.activityEndDate,
        deposit: data.warranty,
        category: data.category,
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
    } catch (e) {
      console.error("상세 데이터 로딩 실패", e);
    }
  };
  useEffect(() => {
    fetchDetail();
  }, []);

  const toggleLike = async () => {
    try {
      const accessToken = await EncryptedStorage.getItem("accessToken");

      if (!accessToken) {
        Alert.alert("로그인이 필요합니다");
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
        console.log("🗑️ 좋아요 삭제 성공:", res.data);
        if (res.status === 200) {
          setLiked(false);
          setLikes((prev) => prev - 1);
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
      Alert.alert("오류", "좋아요 처리 중 문제가 발생했습니다.");
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

    const [city, district] = meeting.location.split(" ");

    navigation.navigate("모임수정", {
      postId: meeting.postId,
      title: meeting.title,
      description: meeting.content,
      selectedCity: city,
      selectedDistrict: district,
      category: meeting.category,
      maxParticipants: meeting.memberMax,
      deposit: meeting.deposit,
      tags: meeting.tags.join(" "),
      recruitmentStart: meeting.recruitmentStart,
      recruitmentEnd: meeting.recruitmentEnd,
      activityStart: meeting.activityStart,
      activityEnd: meeting.activityEnd,
    });
  };

  const handleDelete = () => {
    setMenuVisible(false);
    Alert.alert("게시글 삭제", "정말 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        onPress: async () => {
          try {
            const accessToken = await EncryptedStorage.getItem("accessToken");
            if (!accessToken) {
              Alert.alert("로그인 필요", "삭제를 위해 로그인해주세요.");
              return;
            }

            const response = await axios.delete(`http://10.0.2.2:8080/api/posts/${postId}`, {
              headers: {
                access: `${accessToken}`,
              },
            });

            if (response.status === 200) {
              Alert.alert("삭제 완료", "게시글이 성공적으로 삭제되었습니다.");
              navigation.navigate("Home", { screen: "MainPage" });
            } else {
              Alert.alert("삭제 실패", "서버 응답이 올바르지 않습니다.");
            }
          } catch (error) {
            console.error("게시글 삭제 실패", error);
            Alert.alert("삭제 실패", "게시글 삭제 중 오류가 발생했습니다.");
          }
        },
      },
    ]);
  };

  if (!meeting || !user) {
    return <Text> 불러오는 중 ...</Text>;
  }
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
