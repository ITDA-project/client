import React, { useContext, useEffect, useId, useState } from "react";
import { Platform } from "react-native";
import styled, { ThemeContext } from "styled-components/native";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { Review, Button, AlertModal } from "../components";
import api from "../api/api";
import EncryptedStorage from "react-native-encrypted-storage";
import theme from "../theme";
import { useNavigation } from "@react-navigation/native";

const Container = styled.View`
  flex: 1;
  background-color: #fff;
  padding: 0 20px;
  padding-top: 15px;
`;

const ProfileContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 30px;
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

const SectionTitle = styled.Text`
  font-size: 18px;
  font-family: ${({ theme }) => theme.fonts.bold};
  color: #656565;
  margin-bottom: 15px;
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
  background-color: ${({ theme }) => theme.colors.lightGrey};
  margin-bottom: 10px;
`;

const ReviewSection = styled.View`
  flex: ${Platform.OS === "ios" ? 3 : 3};
  margin: 10px 5px 0 5px;
`;

const Footer = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  margin-bottom: 10px;
  background-color: #fff;
  padding: 10px 20px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const PublicProfile = ({ route }) => {
  const theme = useContext(ThemeContext);
  const navigation = useNavigation();

  const userId = route?.params?.userId;
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewerId, setReviewerId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("alert"); // 'alert' 또는 'confirm'

  const fetchUserProfile = async () => {
    try {
      const accessToken = await EncryptedStorage.getItem("accessToken");
      if (!accessToken) return;

      const res = await api.get(`/profile/${userId}`, {
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

      const res = await api.get(`/review/${userId}`, {
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

  // 로그인 유저의 userId를 가져오는 함수
  const getMyUserId = async () => {
    try {
      const accessToken = await EncryptedStorage.getItem("accessToken");
      if (!accessToken) return null;

      const res = await api.get("/mypage/me", {
        headers: { access: accessToken },
      });

      // 응답에서 userId를 추출하여 state에 저장
      const { data } = res.data;
      setReviewerId(data);
      return data;
    } catch (error) {
      console.error("❌ 로그인 유저 ID 가져오기 실패:", error);
      return null;
    }
  };

  // 리뷰 권한 확인 함수
  const checkReviewEligibility = async () => {
    try {
      const accessToken = await EncryptedStorage.getItem("accessToken");

      // 로그인 정보 또는 프로필 유저 ID가 없는 경우
      if (!accessToken || !reviewerId || !userId) {
        setModalMessage("로그인 정보가 유효하지 않거나 프로필 정보를 불러올 수 없습니다");
        setModalType("alert");
        setModalVisible(true);
        return;
      }

      // 본인이 본인 프로필을 조회하는 경우
      if (reviewerId === userId) {
        setModalMessage("본인의 리뷰를 작성할 수 없습니다");
        setModalType("alert");
        setModalVisible(true);
        return;
      }

      const requestData = {
        userId1: reviewerId, // 로그인한 유저의 ID
        userId2: userId, // 프로필 화면에 표시된 유저의 ID
      };

      console.log("🔍 리뷰 권한 확인 요청 데이터:", requestData);

      const res = await api.post("/payments/review/eligibility", requestData, {
        headers: { access: accessToken },
      });

      console.log("✅ 리뷰 권한 확인 API 응답 본문:", res.data);

      const responseData = res.data.data;
      const apiMessage = responseData.message || "리뷰 권한 확인 완료";

      if (responseData && responseData.participationCount > 0) {
        // ✅ API 응답 메시지 + 추가 질문을 한 번에 합쳐서 모달 메시지로 설정
        const combinedMessage = `${apiMessage}\n리뷰를 작성하시겠습니까?`;
        setModalMessage(combinedMessage);
        setModalType("confirm"); // '확인'과 '취소' 버튼이 있는 모달
        setModalVisible(true);
      } else {
        // 참여 기록이 없거나 응답이 예상과 다를 때
        const noPermissionMessage = responseData.message || "리뷰 작성 권한이 없습니다";
        setModalMessage(noPermissionMessage);
        setModalType("alert"); // '확인' 버튼만 있는 모달
        setModalVisible(true);
      }
    } catch (error) {
      console.error("❌ 리뷰 권한 확인 실패:", error.response ? error.response.data : error.message);
      setModalMessage("리뷰 권한 확인에 실패했습니다");
      setModalType("alert");
      setModalVisible(true);
    }
  };

  // 모달 확인 버튼 핸들러
  const handleModalConfirm = () => {
    setModalVisible(false);

    // ✅ modalType이 'confirm'이면 무조건 화면을 이동하도록 수정
    if (modalType === "confirm") {
      console.log("리뷰 작성 화면으로 이동합니다.");

      navigation.navigate("리뷰 등록", {
        name: user.name,
        image: user.image,
        userId,
      });
    }
  };

  // 모달 취소 버튼 핸들러 (confirm 타입일 때만 사용)
  const handleModalCancel = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    if (userId) fetchUserProfile();
  }, [userId]);

  useEffect(() => {
    if (userId) fetchReviews();
  }, [userId]);

  useEffect(() => {
    // 컴포넌트 마운트 시 로그인 유저 ID를 미리 가져옵니다.
    getMyUserId();
  }, []);

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

      <Divider />

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

      <Footer>
        <Button title="리뷰 작성" onPress={checkReviewEligibility} containerStyle={{ width: "100%", marginTop: "50px" }} textStyle={{ fontSize: 18 }} />
      </Footer>
      <AlertModal visible={modalVisible} message={modalMessage} onConfirm={handleModalConfirm} onCancel={modalType === "confirm" ? handleModalCancel : null} />
    </Container>
  );
};

export default PublicProfile;
