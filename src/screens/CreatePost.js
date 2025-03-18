import React, { useState } from "react";
import { ScrollView, View, Text,TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import Input from "../components/Input";
import Button from "../components/Button";
import Header from "../components/Header";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";  // 날짜 선택기 사용
import Ionicons from 'react-native-vector-icons/Ionicons'; 

const Container = styled.View`
  flex: 1;
  padding-left: 20px;
  padding-right: 20px;
  background-color: ${({ theme }) => theme.colors.white};
`;

const ButtonContainer = styled.View`
  margin-top: 10px;
  margin-bottom: 10px;
  padding-left: 10px;
  padding-right: 10px;
  justify-content: center;
  align-items: center;
`;

const RowContainer = styled.View`
  flex-direction: row;
  align-items:center;
  justify-content: flex-start;
  gap: 5px;
`;

const Label = styled.Text`
  font-size: 15px;
  margin-top: 20px;
  margin-bottom: -15px; 
  color: ${({ theme }) => theme.colors.mainBlue};
  font-family: ${({ theme }) => theme.fonts.bold};
`;

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCity, setSelectedCity] = useState("");  // 시 선택
  const [selectedDistrict, setSelectedDistrict] = useState(""); // 구 선택
  const [maxParticipants, setMaxParticipants] = useState("");
  const [deposit, setDeposit] = useState("");
  const [tags, setTags] = useState("");

  const [recruitmentDate, setRecruitmentDate] = useState(new Date());
  const [activityDate, setActivityDate] = useState(new Date());
  const [isRecruitmentOpen, setRecruitmentOpen] = useState(false);
  const [isActivityOpen, setActivityOpen] = useState(false);

  const handleSubmit = () => {
    console.log({
      title,
      description,
      selectedCity,
      selectedDistrict,
      maxParticipants,
      deposit,
      tags,
      recruitmentDate,
      activityDate,
    });
  };

  const isFormValid = () => {
    return title && description && selectedCity && selectedDistrict && maxParticipants && deposit && tags && recruitmentDate && activityDate
  };

  // 시와 구 예시 데이터
  const cities = [
    { label: "서울", value: "서울" },
    { label: "부산", value: "부산" },
    { label: "대구", value: "대구" },
    // 다른 시들 추가 가능
  ];

  const districts = {
    서울: [
      { label: "강남구", value: "강남구" },
      { label: "강동구", value: "강동구" },
      // 서울 구들 추가
    ],
    부산: [
      { label: "중구", value: "중구" },
      { label: "서구", value: "서구" },
      // 부산 구들 추가
    ],
    대구: [
      { label: "중구", value: "중구" },
      { label: "서구", value: "서구" },
      // 대구 구들 추가
    ],
  };

  return (
    <Container>
      <Header title="모임생성" />
      
      <ScrollView showsVerticalScrollIndicator={false}>

        <Label>제목</Label>
        <Input value={title} onChangeText={setTitle} placeholder="글 제목" />
        
        <Label>상세설명</Label>
        <Input
          value={description}
          onChangeText={setDescription}
          placeholder="어떤 모임인지 자유롭게 설명해주세요!"
          multiline
        />

        <Label>지역</Label>
        <RowContainer>
          <TouchableOpacity style={{ width: 90, marginRight: 10 }}>
            <Input
              value={selectedCity}
              onChangeText={setSelectedCity}
              placeholder="--시"
            />
          </TouchableOpacity>

          <TouchableOpacity style={{ width: 90 }}>
            <Input
              value={selectedDistrict}
              onChangeText={setSelectedDistrict}
              placeholder="--구"
            />
          </TouchableOpacity>
        </RowContainer>
       
        <Label>모임 최대 인원</Label>
        <Input
          value={maxParticipants}
          onChangeText={setMaxParticipants}
          placeholder="모임을 함께할 최대 인원 수(ex. 8, 10)"
        />

        {/* 모집기간 선택 */}
        <Label>모집기간</Label>
        <Input />
        {isRecruitmentOpen && (
          <DateTimePicker
            value={recruitmentDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setRecruitmentOpen(false);
              setRecruitmentDate(selectedDate || recruitmentDate);
            }}
          />
        )}

        {/* 활동기간 선택 */}
        <Label>활동기간</Label>
        <Input onPress={() => setActivityOpen(true)} />
        {isActivityOpen && (
          <DateTimePicker
            value={activityDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setActivityOpen(false);
              setActivityDate(selectedDate || activityDate);
            }}
          />
        )}

        <Label>보증금</Label>
        <Input
          value={deposit}
          onChangeText={setDeposit}
          placeholder="₩ 999,999,999"
        />

        <Label>태그</Label>
        <Input
          value={tags}
          onChangeText={setTags}
          placeholder="#뜨개질 #취미 #종로구"
        />


        <ButtonContainer>
          <Button
            title="만들기"
            onPress={handleSubmit}
            disabled={!isFormValid()}
            containerStyle={{ height: 40, width: 350 }}
            textStyle={{ fontSize: 16 }}
            style={{ height: 40, width: 350 }}
          />
        </ButtonContainer>
      </ScrollView>
    </Container>
  );
};

export default CreatePost;
