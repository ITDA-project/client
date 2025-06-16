import React, { useContext, useState, useEffect } from "react";
import { Button, Input, AlertModal } from "../components";
import styled, { ThemeContext } from "styled-components/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import axios from "axios";
import EncryptedStorage from "react-native-encrypted-storage";

const Container = styled.View`
  flex: 1;
  justify-content: flex-start;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.white};
  padding: 0 30px;
  padding-bottom: ${({ insets: { bottom } }) => bottom}px;
`;

const ProfileContainer = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-top: 30px;
`;

const ProfileImage = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 20px;
  margin-right: 15px;
`;

const NameStar = styled.View`
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const NameText = styled.Text`
  font-size: 16px;
  font-family: ${({ theme }) => theme.fonts.bold};
  color: ${({ theme }) => theme.colors.black};
  margin-bottom: 5px;
  margin-left: 3px;
`;

const StarRow = styled.View`
  width: 100%;
  flex-direction: row;
`;

const ReviewForm = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const theme = useContext(ThemeContext);

  const { name, image, userId } = route.params;

  const [form, setForm] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [rating, setRating] = useState(0); // 별점 상태

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [onConfirmAction, setOnConfirmAction] = useState(null);

  useEffect(() => {
    setDisabled(form.trim().length === 0 || rating < 1);
  }, [form, rating]);

  // 별 그리기 함수
  const renderStars = () => {
    return (
      <StarRow>
        {[1, 2, 3, 4, 5].map((num) => (
          <FontAwesome
            key={num}
            name={rating >= num ? "star" : "star-o"}
            size={23}
            color="#FFD000"
            style={{ marginHorizontal: 2 }}
            onPress={() => setRating(num)}
          />
        ))}
      </StarRow>
    );
  };

  const handleReviewSubmit = async () => {
    try {
      const accessToken = await EncryptedStorage.getItem("accessToken");

      await axios.post(
        "http://10.0.2.2:8080/api/review",
        {
          targetUserId: userId,
          star: rating,
          sentence: form,
        },
        {
          headers: {
            access: accessToken,
            "Content-Type": "application/json",
          },
        }
      );

      setAlertMessage("리뷰 등록이 완료되었습니다.");
      setOnConfirmAction(() => () => navigation.goBack());
      setAlertVisible(true);
    } catch (e) {
      console.error("리뷰 등록 실패:", e);
      setAlertMessage("리뷰 등록에 실패했습니다.");
      setOnConfirmAction(null);
      setAlertVisible(true);
    }
  };

  return (
    <Container insets={insets}>
      <ProfileContainer>
        {image ? <ProfileImage source={{ uri: image }} /> : <ProfileImage source={{ uri: "https://ssl.pstatic.net/static/pwe/address/img_profile.png" }} />}

        <NameStar>
          <NameText>{name || "이름 없음"} 님에 대한 리뷰 </NameText>
          {renderStars()}
        </NameStar>
      </ProfileContainer>

      <Input
        returnKeyType="done"
        value={form}
        onChangeText={(text) => setForm(text)}
        placeholder={"사용자를 평가해주세요!\n어떤 사용자였나요?"}
        containerStyle={{ width: "100%" }}
        textStyle={{ height: 230 }}
        multiline={true}
        numberOfLines={10}
      />
      <Button
        title="제출"
        disabled={disabled}
        onPress={handleReviewSubmit}
        containerStyle={{
          width: 82,
          height: 35,
          marginTop: 20,
          marginBottom: 0,
          paddingTop: 0,
          paddingBottom: 0,
        }}
        textStyle={{ marginLeft: 0, fontSize: 16 }}
      />
      <AlertModal
        visible={alertVisible}
        message={alertMessage}
        onConfirm={() => {
          setAlertVisible(false);
          if (onConfirmAction) onConfirmAction();
        }}
      />
    </Container>
  );
};

export default ReviewForm;
