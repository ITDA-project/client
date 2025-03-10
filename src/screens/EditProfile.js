import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import styled from "styled-components/native";
import * as ImagePicker from "expo-image-picker";
import {Feather} from "@expo/vector-icons";
import Button from "../components/Button";

const Container = styled.View`
  flex: 1;
  background-color: #fff;
  padding: 20px;
  align-items: center;
`;

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

const ProfileImageContainer = styled.TouchableOpacity`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: #ddd;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const ProfileImage = styled.Image`
  width: 100%;
  height: 100%;
  border-radius: 40px;
`;

const Label = styled.Text`
  align-self: flex-start;
  font-size: 16px;
  color: #777;
  margin-bottom: 10px;
`;

const Input = styled.TextInput`
  width: 100%;
  height: 120px;
  border-width: 1px;
  border-color: ${({theme})=>theme.colors.grey};
  border-radius: 8px;
  padding: 10px;
  
`;

const ButtonContainer = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  
  flex-direction: row;
  justify-content: center;
  padding: 10px 20px;
  background-color: white;
  gap: 15px;
`;

const EditProfile = ({ navigation, route }) => {
  const [image, setImage] = useState(route.params?.user?.image || null);
  const [career, setCareer] = useState(route.params?.user?.career || "");

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
        {/* 헤더 */}
        <Header>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
          <HeaderTitle>사진/경력 수정</HeaderTitle>
        </Header>
      {/* 프로필 사진 */}
      <ProfileImageContainer onPress={pickImage}>
        {image ? <ProfileImage source={{ uri: image }} /> : <Text>+</Text>}
      </ProfileImageContainer>

      {/* 경력 입력 */}
      <Label>경력</Label>
      <Input
        placeholder="경력을 적어주세요!"
        value={career}
        onChangeText={setCareer}
        multiline
      />

      {/* 저장 버튼 */}
      <ButtonContainer>
        <Button title="저장" onPress={handleSave}/>
      </ButtonContainer>
      
    </Container>
  );
};

export default EditProfile;
