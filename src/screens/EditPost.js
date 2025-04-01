import React, { useState, useEffect, useContext } from "react";
import {
  ScrollView,
  View,
  TextInput,
  Text,
  Platform,
  Alert,
} from "react-native";
import styled, { ThemeContext } from "styled-components/native";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import Ionicons from "react-native-vector-icons/Ionicons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Input from "../components/Input";
import Button from "../components/Button";
import { useRoute, useNavigation } from "@react-navigation/native";
import { categoryData, cityData, districtData } from "./CreatePost"; // 👈 이렇게 임시 해결

const Container = styled.View`
  flex: 1;
  padding: 0 20px;
  background-color: ${({ theme }) => theme.colors.white};
`;

const Label = styled.Text`
  font-size: 15px;
  margin-top: 20px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.colors.mainBlue};
  font-family: ${({ theme }) => theme.fonts.bold};
`;

const RowContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 5px;
`;

const ButtonContainer = styled.View`
  margin: 20px 0;
  justify-content: center;
  align-items: center;
`;

const DateInputContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.grey};
  padding: 12px;
  width: 150px;
  border-radius: 8px;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.colors.white};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

const DateText = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.black};
`;

const CalendarPicker = ({ date, setDate, minDate, disabled }) => {
  const [open, setOpen] = useState(false);

  return (
    <View>
      <DateInputContainer
        onPress={() => {
          if (!disabled) setOpen(true);
        }}
        disabled={disabled}
      >
        <DateText>{date ? date.toLocaleDateString("ko-KR") : "날짜 선택"}</DateText>
        <Ionicons name="calendar-outline" size={20} color="#888" />
      </DateInputContainer>

      {open && (
        <DateTimePicker
          value={date || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "compact" : "default"}
          locale="ko-KR"
          minimumDate={minDate}
          onChange={(event, selectedDate) => {
            setOpen(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}
    </View>
  );
};

const EditPost = () => {
  const theme = useContext(ThemeContext);
  const route = useRoute();
  const navigation = useNavigation();

  // fallback 처리
const params = route?.params ?? {};

const {
  postId,
  title: initialTitle,
  description: initialDesc,
  selectedCity: initialCity,
  selectedDistrict: initialDistrict,
  category: initialCategory,
  maxParticipants,
  deposit,
  tags,
  recruitmentStart,
  recruitmentEnd,
  activityStart,
  activityEnd,
} = params;

  const [title, setTitle] = useState(initialTitle || "");
  const [description, setDescription] = useState(initialDesc || "");
  const [inputHeight, setInputHeight] = useState(120);
  const [category, setCategory] = useState(initialCategory || null);
  const [categoryOpen, setCategoryOpen] = useState(false);

  const [selectedCity, setSelectedCity] = useState(initialCity || null);
  const [selectedDistrict, setSelectedDistrict] = useState(initialDistrict || null);
  const [districtList, setDistrictList] = useState([]);
  const [cityOpen, setCityOpen] = useState(false);
  const [districtOpen, setDistrictOpen] = useState(false);

  const [max, setMax] = useState(maxParticipants?.toString() || "");
  const [money, setMoney] = useState(deposit || "");
  const [tagText, setTagText] = useState(tags || "");

  const safeParseDate = (value) => {
    if (!value || typeof value !== "string") return new Date();
    const normalized = value.replace(/\./g, "-").replace(/\s/g, "");
    const parsed = new Date(normalized);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  };
  
  const [recruitStart, setRecruitStart] = useState(safeParseDate(recruitmentStart));
  const [recruitEnd, setRecruitEnd] = useState(safeParseDate(recruitmentEnd));
  const [activityStartDate, setActivityStartDate] = useState(safeParseDate(activityStart));
  const [activityEndDate, setActivityEndDate] = useState(safeParseDate(activityEnd));

  useEffect(() => {
    if (selectedCity) {
      setDistrictList(
        districtData[selectedCity]?.map((district) => ({
          label: district,
          value: district,
        })) || []
      );
    }
  }, [selectedCity]);

  const isFormValid = () => {
    return (
      title &&
      description &&
      selectedCity &&
      selectedDistrict &&
      category &&
      max &&
      money &&
      tagText &&
      recruitStart &&
      recruitEnd &&
      activityStartDate &&
      activityEndDate
    );
  };

  const handleUpdate = () => {
    const formatDate = (date) => {
        return date instanceof Date ? date.toISOString().split("T")[0] : "";
      };
    
    const updatedPost = {
        postId,
        title,
        description,
        category,
        selectedCity,
        selectedDistrict,
        memberMax: max,
        deposit: money,
        tags: tagText.split(" "),
        recruitmentStart: formatDate(recruitStart),
        recruitmentEnd: formatDate(recruitEnd),
        activityStart: formatDate(activityStartDate),
        activityEnd: formatDate(activityEndDate),
        createdAt: new Date().toISOString().split("T")[0], // 또는 유지할 기존 createdAt
      };

    console.log("수정된 데이터:", updatedPost);

    // 여기에 실제 API 연동 로직 추가
    Alert.alert("수정 완료", "게시글이 성공적으로 수정되었습니다.");
    navigation.replace("MyPostDetail",{updatedPost});
  };

  return (
    <KeyboardAwareScrollView enableOnAndroid extraScrollHeight={100}>
      <Container>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Label>카테고리</Label>
          <View style={{ width: "45%", zIndex: 3000 }}>
            <DropDownPicker
              open={categoryOpen}
              value={category}
              items={categoryData}
              setOpen={setCategoryOpen}
              setValue={setCategory}
              placeholder="카테고리 선택"
              listMode="MODAL"
              style={{ borderColor: theme.colors.grey }}
              textStyle={{ fontSize: 16 }}
            />
          </View>

          <Label>제목</Label>
          <Input value={title} onChangeText={setTitle} placeholder="글 제목"
          containerStyle={{ marginTop: -20 }} />

          <Label>상세설명</Label>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="설명 입력"
            multiline
            numberOfLines={5}
            onContentSizeChange={(e) =>
              setInputHeight(Math.max(120, e.nativeEvent.contentSize.height))
            }
            style={{
              height: inputHeight,
              padding: 10,
              borderColor: theme.colors.grey,
              borderWidth: 1,
              borderRadius: 5,
              fontSize: 16,
              color: theme.colors.black,
              backgroundColor: theme.colors.white,
              textAlignVertical: "top",
            }}
          />

          <Label>지역</Label>
          <RowContainer style={{ zIndex: 3000 }}>
            <View style={{ width: "40%" }}>
              <DropDownPicker
                open={cityOpen}
                value={selectedCity}
                items={cityData}
                setOpen={setCityOpen}
                setValue={setSelectedCity}
                placeholder="시 선택"
                listMode="MODAL"
              />
            </View>
            <View style={{ width: "40%" }}>
              <DropDownPicker
                open={districtOpen}
                value={selectedDistrict}
                items={districtList}
                setOpen={setDistrictOpen}
                setValue={setSelectedDistrict}
                placeholder="구 선택"
                disabled={!selectedCity}
                listMode="MODAL"
              />
            </View>
          </RowContainer>

          <Label>모임 최대 인원</Label>
          <Input
            value={max}
            onChangeText={setMax}
            placeholder="예: 10"
            keyboardType="numeric"
            containerStyle={{ marginTop: -20 }}
          />

          <Label>모집 기간</Label>
          <RowContainer>
            <CalendarPicker date={recruitStart} setDate={setRecruitStart} />
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>~</Text>
            <CalendarPicker
              date={recruitEnd}
              setDate={setRecruitEnd}
              minDate={recruitStart}
            />
          </RowContainer>

          <Label>활동 기간</Label>
          <RowContainer>
            <CalendarPicker date={activityStartDate} setDate={setActivityStartDate} />
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>~</Text>
            <CalendarPicker
              date={activityEndDate}
              setDate={setActivityEndDate}
              minDate={activityStartDate}
            />
          </RowContainer>

          <Label>보증금</Label>
          <Input
            value={money}
            onChangeText={setMoney}
            placeholder="₩ 0"
            keyboardType="numeric"
            containerStyle={{ marginTop: -20 }}
          />

          <Label>태그</Label>
          <Input
            value={tagText}
            onChangeText={setTagText}
            placeholder="#친목 #서울"
            containerStyle={{ marginTop: -20 }}
          />

          <ButtonContainer>
            <Button
              title="수정"
              onPress={handleUpdate}
              disabled={!isFormValid()}
              containerStyle={{ height: 50, width: 350 }}
              textStyle={{ fontSize: 18 }}
              style={{ height: 50, width: 350 }}
            />
          </ButtonContainer>
        </ScrollView>
      </Container>
    </KeyboardAwareScrollView>
  );
};

export default EditPost;
