import React, { useContext, useCallback, useState } from "react";
import { Platform, ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import styled from "styled-components/native";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { ThemeContext } from "styled-components/native";
import { Button, Review, LoginModal } from "../components";
import { useAuth } from "../contexts/AuthContext";
import api from "../api/api";
import EncryptedStorage from "react-native-encrypted-storage";

// 스타일
const Container = styled.View`
  flex: 1;
  background-color: #fff;
  padding: 0 20px;
  padding-top: 10px;
`;

const ProfileContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const ProfileImage = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  margin-left: 10px;
  margin-right: 15px;
`;

const UserInfo = styled.View`
  margin-left: 10px;
  flex-direction: row;
  align-items: center;
`;

const UserName = styled.Text`
  font-size: 20px;
  font-family: ${({ theme }) => theme.fonts.bold};
  margin-right: 15px;
  color: ${({ theme }) => theme.colors.mainBlue};
`;

const StarContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const StarText = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.mainBlue};
  font-family: ${({ theme }) => theme.fonts.extraBold};
  margin-left: 5px;
`;

const EditButton = styled.View`
  margin-top: 10px;
  margin-bottom: 10px;
  align-items: center;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-family: ${({ theme }) => theme.fonts.bold};
  color: #656565;
  margin-bottom: 8px;
`;

const ScrollSection = styled.View`
  flex: ${Platform.OS === "ios" ? 2 : 2};
  margin: 10px 5px 0 5px;
`;

const ScrollArea = styled.ScrollView`
  flex: 1;
`;

const CareerText = styled.Text`
  font-size: 15px;
  font-family: ${({ theme }) => theme.fonts.regular};
  color: ${({ theme }) => theme.colors.black};
`;

const PlaceholderWrapper = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  height: 100px;
`;

const Placeholder = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.grey};
  font-family: ${({ theme }) => theme.fonts.bold};
  text-align: center;
`;

const Divider = styled.View`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.lightGrey};
  margin-bottom: 10px;
`;

const ReviewSection = styled.View`
  flex: ${Platform.OS === "ios" ? 3 : 3};
  margin: 10px 5px 0 5px;
`;

const ButtonContainer = styled.View`
  padding: 5px 10px 20px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 15px;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Profile = ({ navigation, route }) => {
  const theme = useContext(ThemeContext);
  const { signout } = useAuth();

  const userId = route?.params?.userId;
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        try {
          const token = await EncryptedStorage.getItem("accessToken");
          if (!token) throw new Error("토큰 없음");

          const res = await api.get("/mypage/me", {
            headers: { access: token },
          });

          const userId = res.data.data;
          if (!userId) throw new Error("userId 없음");

          const profileRes = await api.get(`/profile/${userId}`, {
            headers: { access: token },
          });

          const { name, image, career, ratingAverage } = profileRes.data.data;
          setUser({
            name,
            image,
            career,
            totalStar: ratingAverage?.toFixed(1) ?? "0.0",
          });

          const reviewRes = await api.get(`/review/${userId}`, {
            headers: { access: token },
          });

          const mapped = reviewRes.data.dtoList.map((r) => ({
            star: r.star,
            sentence: r.sentence,
            createdAt: r.createdAt?.split("T")[0].split("-").join("."),
          }));

          setReviews(mapped);
        } catch (error) {
          console.warn("⚠️ 프로필 로딩 실패:", error.message);

          if (error.message === "토큰 없음") {
            // 토큰이 없으면 로그인 화면으로 이동
            setIsModalVisible(true);
          } else {
            setUser({
              name: "사용자",
              image: null,
              career: "",
              totalStar: "0.0",
            });
            setReviews([]);
          }
        } finally {
          setIsLoading(false);
        }
      };

      load();
    }, [])
  );

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  if (isLoading) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color="#007AFF" />
      </LoadingContainer>
    );
  }

  /*
  if (!user) {
    return (
      <Container>
        <Placeholder>유저 정보를 불러올 수 없습니다</Placeholder>
      </Container>
    );
  }
  */

  return (
    <>
      <Container>
        {user && (
          <>
            {/* 상단 프로필 */}
            <ProfileContainer>
              {user?.image ? (
                <ProfileImage source={{ uri: user.image }} />
              ) : (
                <ProfileImage source={{ uri: "https://ssl.pstatic.net/static/pwe/address/img_profile.png" }} />
              )}
              <UserInfo>
                <UserName>{user.name}</UserName>
                <StarContainer>
                  <MaterialIcons name="star" size={18} color="#FFC107" />
                  <StarText>{user.totalStar}</StarText>
                </StarContainer>
              </UserInfo>
            </ProfileContainer>

            <EditButton>
              <Button
                title="사진 / 경력 수정"
                onPress={() => navigation.navigate("사진/경력 수정")}
                containerStyle={{ height: 40, width: "100%" }}
                textStyle={{ fontSize: 16 }}
                style={{ height: 40, width: 340 }}
              />
            </EditButton>

            {/* 경력 영역 (2 비율) */}
            <ScrollSection>
              <SectionTitle>경력</SectionTitle>
              <ScrollArea>
                {user.career ? (
                  <CareerText>{user.career}</CareerText>
                ) : (
                  <PlaceholderWrapper>
                    <Placeholder>등록되지 않았습니다</Placeholder>
                  </PlaceholderWrapper>
                )}
              </ScrollArea>
            </ScrollSection>

            <Divider />

            {/* 리뷰 영역 (3 비율) */}
            <ReviewSection>
              <SectionTitle>리뷰</SectionTitle>
              <ScrollArea>
                {reviews.length > 0 ? (
                  reviews.map((review, index) => <Review key={index} {...review} />)
                ) : (
                  <PlaceholderWrapper>
                    <Placeholder>등록되지 않았습니다</Placeholder>
                  </PlaceholderWrapper>
                )}
              </ScrollArea>
            </ReviewSection>

            {/* 하단 버튼 */}
            <ButtonContainer>
              <Button
                title="로그아웃"
                onPress={async () => {
                  try {
                    await signout();
                    navigation.replace("Home"); // 성공했을 때만 이동
                  } catch (error) {
                    console.error("로그아웃 에러 발생, 페이지 이동 안 함:", error);
                    // 실패하면 아무것도 하지 않음
                  }
                }}
                containerStyle={{ height: 40, width: 95 }}
                textStyle={{ fontSize: 16, marginLeft: 0 }}
                style={{ height: 40, width: 95 }}
              />

              <Button
                title="회원탈퇴"
                onPress={() => navigation.navigate("회원탈퇴")}
                containerStyle={{ backgroundColor: theme.colors.lightBlue, height: 40, width: 95 }}
                textStyle={{ color: theme.colors.black, fontSize: 16, marginLeft: 0 }}
                style={{ height: 40, width: 95 }}
              />
            </ButtonContainer>
          </>
        )}
      </Container>
      <LoginModal visible={isModalVisible} onClose={handleModalClose} />
    </>
  );
};

export default Profile;
