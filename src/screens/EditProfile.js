import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import styled from "styled-components/native";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";
import Button from "../components/Button";
import Input from "../components/Input";

const Container = styled.View`
  flex: 1;
  background-color: #fff;
  padding-left: 20px;
  padding-right: 20px;
  align-items: center;
`;

const ProfileImageContainer = styled.TouchableOpacity`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: #ddd;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
  margin-bottom: 20px;
  position: relative;
`;

const ProfileImage = styled.Image`
  width: 100%;
  height: 100%;
  border-radius: 40px;
`;

const CameraIconContainer = styled.View`
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: white;
  border-radius: 20px;
  padding: 5px;
`;

const Label = styled.Text`
  align-self: flex-start;
  font-size: 16px;
  font-family: ${({ theme }) => theme.fonts.bold};
  color: #656565;
  margin-bottom: -10px;
`;

const ButtonContainer = styled.View`
  margin-top: 20px;
  align-items: center;
`;

const EditProfile = ({ navigation, route }) => {
  const [image, setImage] = useState(route.params?.user?.image || null);
  const [career, setCareer] = useState(route.params?.user?.career || "");
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    setDisabled(career.trim().length === 0);
  }, [career]);

  // 사진 선택 함수
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // 저장 버튼 클릭 시
  const handleSave = () => {
    navigation.navigate("Profile", {
      user: {
        image,
        career,
      },
    });
  };

  return (
    <Container>
      {/* 프로필 사진 */}
      <ProfileImageContainer onPress={pickImage}>
        {image ? (
          <ProfileImage source={{ uri: image }} />
        ) : (
          <Feather name="user" size={30} color="#888" />
        )}
        <CameraIconContainer>
          <Feather name="camera" size={16} color="#777" />
        </CameraIconContainer>
      </ProfileImageContainer>

      {/* 경력 입력 */}
      <Label>경력</Label>
      <Input
        returnKeyType="done"
        value={career}
        onChangeText={(text) => setCareer(text)}
        placeholder="경력을 적어주세요!"
        containerStyle={{ marginTop: 0, width: "100%" }}
        textStyle={{ height: 200 }}
        multiline={true}
        numberOfLines={10}
      />

      {/* 저장 버튼 */}
      <ButtonContainer>
        <Button
          title="저장"
          onPress={handleSave}
          disabled={disabled}
          containerStyle={{ height: 40, width: 100 }}
          textStyle={{ fontSize: 16, marginLeft: 0 }}
          style={{ height: 40, width: 100 }}
        />
      </ButtonContainer>
    </Container>
  );
};

export default EditProfile;
