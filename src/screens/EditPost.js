import React, { useState, useEffect, useContext } from "react";
import { ScrollView, View, TextInput, Text, Platform, Alert } from "react-native";
import styled, { ThemeContext } from "styled-components/native";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import Ionicons from "react-native-vector-icons/Ionicons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Input from "../components/Input";
import Button from "../components/Button";
import { useRoute, useNavigation } from "@react-navigation/native";
import { categoryData, cityData, districtData } from "./CreatePost"; // 👈 이렇게 임시 해결
import axios from "axios";
import EncryptedStorage from "react-native-encrypted-storage";

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
            if (Platform.OS === "android") {
              setOpen(false);
              if (event.type === "set" && selectedDate) {
                setDate(selectedDate);
              }
            } else {
              // iOS는 실시간 반영
              if (selectedDate) {
                setDate(selectedDate);
              }
            }
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

  const categoryCodeMap = {
    취미: "HOBBY",
    운동: "EXERCISE",
    또래: "FRIEND",
    공부: "STUDY",
    음악: "MUSIC",
    게임: "GAME",
  };

  const categoryLabelMap = Object.fromEntries(Object.entries(categoryCodeMap).map(([label, code]) => [code, label]));

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
  console.log("params: ", params);
  // 📦 State
  const [title, setTitle] = useState(initialTitle || "");
  const [description, setDescription] = useState(initialDesc || "");
  const [inputHeight, setInputHeight] = useState(120);

  const [category, setCategory] = useState(categoryLabelMap[initialCategory] || null);
  const [categoryOpen, setCategoryOpen] = useState(false);

  const [selectedCity, setSelectedCity] = useState(initialCity || null);
  const [selectedDistrict, setSelectedDistrict] = useState(initialDistrict || null);
  const [districtList, setDistrictList] = useState([]);
  const [cityOpen, setCityOpen] = useState(false);
  const [districtOpen, setDistrictOpen] = useState(false);

  const [max, setMax] = useState(maxParticipants?.toString() || "");
  const [money, setMoney] = useState(deposit || "");
  const [tagText, setTagText] = useState(tags || "");

  // 문자열로 전달받은 날짜를 Date 객체로 안전하게 변환
  const safeParseDate = (value) => {
    if (!value || typeof value !== "string") return new Date();
    const [y, m, d] = value.split("-");
    if (y && m && d) {
      return new Date(Number(y), Number(m) - 1, Number(d));
    }
    return new Date();
  };

  const [recruitStart, setRecruitStart] = useState(safeParseDate(recruitmentStart));
  const [recruitEnd, setRecruitEnd] = useState(safeParseDate(recruitmentEnd));
  const [activityStartDate, setActivityStartDate] = useState(safeParseDate(activityStart));
  const [activityEndDate, setActivityEndDate] = useState(safeParseDate(activityEnd));

  // 📌 시 선택 시 구 리스트 자동 설정
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

  // ✅ 유효성 검사
  const isFormValid = () => {
    return (
      title && description && selectedCity && selectedDistrict && category && max && money && tagText && recruitEnd && activityStartDate && activityEndDate
    );
  };

  // 📡 게시글 수정 요청
  const handleUpdate = async () => {
    const formatDate = (date) => {
      return date instanceof Date ? date.toISOString().split("T")[0] : "";
    };

    const requestBody = {
      title,
      content: description,
      category: categoryCodeMap[category],
      membersMax: Number(max),
      location: `${selectedCity} ${selectedDistrict}`,
      dueDate: formatDate(recruitEnd),
      warranty: money,
      activityStartDate: formatDate(activityStartDate),
      activityEndDate: formatDate(activityEndDate),
    };
    console.log("요청바디:", requestBody);
    try {
      const accessToken = await EncryptedStorage.getItem("accessToken");

      if (!accessToken) {
        Alert.alert("로그인 필요", "수정을 위해 로그인해주세요.");
        return;
      }

      const response = await axios.patch(`http://10.0.2.2:8080/api/posts/${postId}`, requestBody, {
        headers: {
          access: `${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      console.log("✅ 수정 성공:", response.data);
      Alert.alert("수정 완료", "게시글이 성공적으로 수정되었습니다.");
      navigation.replace("MyPostDetail", { postId });
    } catch (error) {
      console.error("❌ 게시글 수정 실패:", error.response?.data || error.message);
      Alert.alert("에러", "게시글 수정 중 오류가 발생했습니다.");
    }
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
          <Input value={title} onChangeText={setTitle} placeholder="글 제목" containerStyle={{ marginTop: -20 }} />

          <Label>상세설명</Label>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="설명 입력"
            multiline
            numberOfLines={5}
            onContentSizeChange={(e) => setInputHeight(Math.max(120, e.nativeEvent.contentSize.height))}
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
          <Input value={max} onChangeText={setMax} placeholder="예: 10" keyboardType="numeric" containerStyle={{ marginTop: -20 }} />

          <Label>모집 기간</Label>
          <RowContainer>
            {/* 모집 시작일 - 고정값 (오늘) */}
            <DateInputContainer disabled={true}>
              <DateText>{recruitStart.toLocaleDateString("ko-KR")}</DateText>
              <Ionicons name="calendar-outline" size={20} color="#888" />
            </DateInputContainer>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>~</Text>
            <CalendarPicker
              date={recruitEnd}
              setDate={setRecruitEnd}
              minDate={recruitStart} // 모집 시작 이후 날짜만 선택 가능
            />
          </RowContainer>

          <Label>활동 기간</Label>
          <RowContainer>
            <CalendarPicker date={activityStartDate} setDate={setActivityStartDate} />
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>~</Text>
            <CalendarPicker date={activityEndDate} setDate={setActivityEndDate} minDate={activityStartDate} />
          </RowContainer>

          <Label>보증금</Label>
          <Input value={money} onChangeText={setMoney} placeholder="₩ 0" keyboardType="numeric" containerStyle={{ marginTop: -20 }} />

          <Label>태그</Label>
          <Input value={tagText} onChangeText={setTagText} placeholder="#친목 #서울" containerStyle={{ marginTop: -20 }} />

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
