import React, { useContext } from "react";
import { Platform } from "react-native";
import styled from "styled-components/native";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { ThemeContext } from "styled-components/native";
import Button from "../components/Button";
import Review from "../components/Review";

// 스타일

// 스타일
const Container = styled.View`
  flex: 1;
  background-color: #fff;
  padding: 0 20px;
  padding-top: 20px;
`;

const ProfileContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const ProfileImageContainer = styled.View`
  width: 60px;
  height: 60px;
  margin-left: 10px;
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

const Placeholder = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.grey};
  font-family: ${({ theme }) => theme.fonts.bold};
  text-align: center;
`;

const Divider = styled.View`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.grey};
  margin-top: 20px;
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
const dummyUser = {
  name: "홍길동",
  career: `안녕하세요~ 홍길동입니다\n저는 2024년도에 독서 모임장으로 활동하며 어쩌구저쩌구\n외라라리라랄라라란 살라살라\n이상입니다! 감사합니다! 차하하\n외라라리라랄라라란 살라살라\n이상입니다! 감사합니다! 차하하\n외라라리라랄라라란 살라살라\n이상입니다! 감사합니다! 차하하\n이상입니다! 감사합니다! 차하하\n이상입니다! 감사합니다! 차하하\n이상입니다! 감사합니다! 차하하\n이상입니다! 감사합니다! 차하하\n이상입니다! 감사합니다! 차하하`,
  reviews: [
    { star: 4.5, sentence: "책임감 있게 모임을 이끌어줬어요!", createdAt: "2025.02.28" },
    { star: 5.0, sentence: "모두가 참여할 수 있는 재밌는 모임을 만들어 주셨어요 ", createdAt: "2025.02.28" },
    { star: 4.0, sentence: "정말 유익한 시간이었습니다.", createdAt: "2025.02.27" },
    { star: 4.8, sentence: "참여자들과 원활한 소통이 인상적이었어요.", createdAt: "2025.02.26" },
    { star: 5.0, sentence: "친절하고 배려심 넘치는 진행이었어요.", createdAt: "2025.02.25" },
    { star: 3.5, sentence: "조금 아쉬운 점도 있었지만, 전반적으로 만족합니다.", createdAt: "2025.02.24" },
    { star: 4.2, sentence: "재밌는 활동들 덕분에 시간 가는 줄 몰랐어요!", createdAt: "2025.02.23" },
    { star: 4.7, sentence: "다음에도 참여하고 싶어요!", createdAt: "2025.02.22" },
  ],
};
dummyUser.totalStar =
  dummyUser.reviews.length > 0 ? (dummyUser.reviews.reduce((acc, review) => acc + review.star, 0) / dummyUser.reviews.length).toFixed(1) : "0.0";

const Profile = ({ navigation, route }) => {
  const theme = useContext(ThemeContext);
  const user = route?.params?.user || dummyUser; //더미데이터 사용용

  return (
    <Container>
      {/* 상단 프로필 */}
      <ProfileContainer>
        <ProfileImageContainer>
          {user.image ? <ProfileImage source={{ uri: user.image }} /> : <Feather name="user" size={30} color="#888" />}
        </ProfileImageContainer>
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
          containerStyle={{ height: 40, width: 340 }}
          textStyle={{ fontSize: 16 }}
          style={{ height: 40, width: 340 }}
        />
      </EditButton>

      {/* 경력 영역 (2 비율) */}
      <ScrollSection>
        <SectionTitle>경력</SectionTitle>
        <ScrollArea>{user.career ? <CareerText>{user.career}</CareerText> : <Placeholder>등록되지 않았습니다</Placeholder>}</ScrollArea>
      </ScrollSection>

      <Divider />

      {/* 리뷰 영역 (3 비율) */}
      <ReviewSection>
        <SectionTitle>리뷰</SectionTitle>
        <ScrollArea>
          {user.reviews.length > 0 ? user.reviews.map((review, index) => <Review key={index} {...review} />) : <Placeholder>등록되지 않았습니다</Placeholder>}
        </ScrollArea>
      </ReviewSection>

      {/* 하단 버튼 */}
      <ButtonContainer>
        <Button
          title="로그아웃"
          onPress={() => console.log("로그아웃")}
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
    </Container>
  );
};

export default Profile;
