import React, { useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import styled, { ThemeContext } from "styled-components/native";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import Review from "../components/Review";
import axios from "axios";
import EncryptedStorage from "react-native-encrypted-storage";

const Container = styled.View`
  flex: 1;
  background-color: #fff;
  padding: 0 20px;
  padding-top: 15px;
`;

const ProfileContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
`;

const ProfileImageContainer = styled.View`
  width: 60px;
  height: 60px;
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

const SectionTitle = styled.Text`
  font-size: 18px;
  font-family: ${({ theme }) => theme.fonts.bold};
  color: #656565;
  margin-bottom: 15px;
`;

const ScrollSection = styled.View`
  flex: ${Platform.OS === "ios" ? 2 : 2};
  margin-top: 20px;
  max-height: 180px;
`;

const ScrollArea = styled.ScrollView`
  flex-grow: 0;
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
  height: 120px;
`;

const Placeholder = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.grey};
  font-family: ${({ theme }) => theme.fonts.bold};
  text-align: center;
`;

const Divider = styled.View`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.grey};
  margin-top: 10px;
  margin-bottom: 10px;
`;

const ReviewSection = styled.View`
  flex: ${Platform.OS === "ios" ? 3 : 3};
  margin-top: 20px;
  margin-bottom: 50px;
`;

const PublicProfile = ({ route }) => {
  const theme = useContext(ThemeContext);

  const userId = route?.params?.userId;
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = async () => {
    try {
      const accessToken = await EncryptedStorage.getItem("accessToken");
      if (!accessToken) return;

      const res = await axios.get(`http://10.0.2.2:8080/api/profile/${userId}`, {
        headers: { access: accessToken },
      });

      const { data } = res.data;

      setUser({
        name: data.name,
        image: data.image,
        career: data.career,
        totalStar: data.ratingAverage?.toFixed(1) ?? "0.0",
      });
    } catch (error) {
      console.error("❌ 프로필 불러오기 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const accessToken = await EncryptedStorage.getItem("accessToken");
      if (!accessToken) return;

      const res = await axios.get(`http://10.0.2.2:8080/api/review/${userId}`, {
        headers: { access: accessToken },
      });

      const reviewList = res.data.dtoList || [];
      const mapped = reviewList.map((item) => ({
        star: item.star,
        sentence: item.sentence,
        createdAt: item.createdAt?.split("T")[0].split("-").join("."),
      }));

      setReviews(mapped);
    } catch (error) {
      console.error("❌ 리뷰 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    if (userId) fetchUserProfile();
  }, [userId]);

  useEffect(() => {
    if (userId) fetchReviews();
  }, [userId]);

  if (isLoading) {
    return (
      <Container>
        <Placeholder>로딩 중...</Placeholder>
      </Container>
    );
  }

  return (
    <Container>
      {/* 프로필 영역 */}
      <ProfileContainer>
        <ProfileImageContainer>
          {user?.image ? (
            <ProfileImage source={{ uri: user.image }} />
          ) : (
            <ProfileImage source={{ uri: "https://ssl.pstatic.net/static/pwe/address/img_profile.png" }} />
          )}
        </ProfileImageContainer>
        <UserInfo>
          <UserName>{user.name}</UserName>
          <StarContainer>
            <MaterialIcons name="star" size={18} color="#FFC107" />
            <StarText>{user.totalStar}</StarText>
          </StarContainer>
        </UserInfo>
      </ProfileContainer>

      {/* 경력 */}
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

      {/* 리뷰 */}
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
    </Container>
  );
};

export default PublicProfile;
