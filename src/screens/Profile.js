import React, { useContext } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import styled from "styled-components/native";
import { MaterialIcons ,Feather} from "@expo/vector-icons";
import { ThemeContext } from "styled-components/native";
import Button from "../components/Button";


// 스타일
const Header = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 60px;
`;

const HeaderTitle = styled.Text`
  flex: 1;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
`;

const ProfileContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 20px;
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
  margin-left: 10px;
  flex-direction: row;
  align-items: center;
`;

const UserName = styled.Text`
  font-size: 20px;
  font-weight: bold;
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
  font-weight: bold;
  margin-left: 5px;
`;

const EditButton = styled.View`
  margin-top: 10px;
`;

const SectionContainer = styled.View`
  margin-top: 25px;
  height: 160px;
  margin-left: 10px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #656565
`;

const SectionContent = styled.View`
  margin-top: 10px;
`;

const CareerText = styled.Text`
  margin-top:10px;
  font-size: 15px;
  color: ${({theme})=>theme.colors.black};
`;

const Placeholder = styled.Text`
  font-size: 16px;
  color: ${({theme})=>theme.colors.grey};
`;

const ReviewItem = styled.View`
  margin-top: 10px;
  margin-bottom: 10px;
  flex-direction: column;
`;

const ReviewContent = styled.Text`
  font-size: 14px;
  color: ${({theme})=>theme.colors.black};
`;

const ReviewDate = styled.Text`
  font-size: 12px;
  color: #999;
  margin-top: 3px;
`;

const ButtonContainer = styled.View`
  position: absolute;
  bottom: 30px;
  left: 0;
  right: 0;
  width: 100%;
  flex-direction: row;
  justify-content: center;
  padding: 10px 20px;
  background-color: white;
  gap: 15px;
`;

const Divider = styled.View`
  height: 1px;
  background-color: ${({theme})=>theme.colors.grey};
`;

const dummyUser = {
  name: "홍길동",
  totalStar: 3.8,
  career: `안녕하세요~ 홍길동입니다\n저는 2024년도에 독서 모임장으로 활동하며 어쩌구저쩌구\n외라라리라랄라라란 살라살라\n이상입니다! 감사합니다! 차하하`,
  reviews: [
    {
      star: 4.5,
      text: "책임감 있게 모임을 이끌어줬어요!",
      date: "2025.02.28",
    },
    {
      star: 5.0,
      text: "모두가 참여할 수 있는 재밌는 모임을 만들어 주셨어요 👍",
      date: "2025.02.28",
    },
  ],
};

const Profile = ({ navigation, route }) => {
    const theme = useContext(ThemeContext);
    const user = route?.params?.user || dummyUser; //더미데이터 사용용
    

    return (
    <>  
      <ScrollView style={{ flex: 1, backgroundColor: "#fff", paddingHorizontal: 20 }}>
        {/* 헤더 */}
        <Header>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
          <HeaderTitle>프로필</HeaderTitle>
        </Header>
  
        {/* 프로필 정보 */}
        <ProfileContainer>
          <ProfileImageContainer>
            {user.image ? (
              <ProfileImage source={{ uri: user.image }} />
            ) : (
              <Feather name="user" size={30} color="#888" />
            )}
          </ProfileImageContainer>
          <UserInfo>
            <UserName>{user.name}</UserName>
            <StarContainer>
              <MaterialIcons name="star" size={18} color="#FFC107" />
              <StarText>{user.totalStar || "0.0"}</StarText>
            </StarContainer>
          </UserInfo>
        </ProfileContainer>
        
        {/* 수정 버튼 */}
        <EditButton>
          <Button title="사진 / 경력 수정" onPress={() => navigation.navigate("EditProfile")} primary color={theme.colors.mainBlue} />
        </EditButton>
  
        {/* 경력 */}
        <SectionContainer>
          <SectionTitle>경력</SectionTitle>
          <SectionContent>
            {user.career ? <CareerText>{user.career}</CareerText> : <Placeholder>등록되지 않았습니다</Placeholder>}
          </SectionContent>
        </SectionContainer>
        
        <Divider/>

        {/* 리뷰 */}
        <SectionContainer>
          <SectionTitle>리뷰</SectionTitle>
          <SectionContent>
            {(user?.reviews?.length ?? 0) > 0 ? (
              user.reviews.map((review, index) => (
                <ReviewItem key={index}>
                  <StarContainer>
                    <MaterialIcons name="star" size={18} color="#FFC107" />
                    <StarText>{review.star}</StarText>
                  </StarContainer>
                  <ReviewContent>{review.text}</ReviewContent>
                  <ReviewDate>{review.date}</ReviewDate>
                </ReviewItem>
              ))
            ) : (
              <Placeholder>등록되지 않았습니다</Placeholder>
            )}
          </SectionContent>
        </SectionContainer>
      </ScrollView>
        
      {/* 버튼들 */}
      <ButtonContainer>
        <Button title="로그아웃" onPress={() => console.log("로그아웃")} primary />
        <Button title="회원탈퇴" onPress={() => console.log("회원탈퇴")} secondary />
      </ButtonContainer>
      
    </>
    );
  };
  

export default Profile;

