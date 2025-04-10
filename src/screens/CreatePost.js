import React, { useState, useEffect, useContext } from "react";
import { Alert, ScrollView, View, Platform, TextInput, Text } from "react-native";
import styled from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import Input from "../components/Input";
import Button from "../components/Button";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import Ionicons from "react-native-vector-icons/Ionicons";
import { ThemeContext } from "styled-components/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import axios from "axios";
import EncryptedStorage from "react-native-encrypted-storage";

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
  align-items: center;
  justify-content: flex-start;
  gap: 5px;
`;

const Label = styled.Text`
  font-size: 15px;
  margin-top: 20px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.colors.mainBlue};
  font-family: ${({ theme }) => theme.fonts.bold};
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
          minimumDate={minDate} // ⬅️ 최소 선택 가능 날짜 지정
          onChange={(event, selectedDate) => {
            setOpen(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}
    </View>
  );
};

export const categoryData = [
  { label: "취미", value: "취미" },
  { label: "운동", value: "운동" },
  { label: "또래", value: "또래" },
  { label: "공부", value: "공부" },
  { label: "음악", value: "음악" },
  { label: "게임", value: "게임" },
];

export const cityData = [
  { label: "서울", value: "서울" },
  { label: "부산", value: "부산" },
  { label: "대구", value: "대구" },
  { label: "인천", value: "인천" },
  { label: "광주", value: "광주" },
  { label: "대전", value: "대전" },
  { label: "울산", value: "울산" },
  { label: "세종", value: "세종" },
  { label: "경기도", value: "경기도" },
  { label: "강원도", value: "강원도" },
  { label: "충청북도", value: "충청북도" },
  { label: "충청남도", value: "충청남도" },
  { label: "전라북도", value: "전라북도" },
  { label: "전라남도", value: "전라남도" },
  { label: "경상북도", value: "경상북도" },
  { label: "경상남도", value: "경상남도" },
  { label: "제주도", value: "제주도" },
];

export const districtData = {
  서울: [
    "강남구",
    "강동구",
    "강북구",
    "강서구",
    "관악구",
    "광진구",
    "구로구",
    "금천구",
    "노원구",
    "도봉구",
    "동대문구",
    "동작구",
    "마포구",
    "서대문구",
    "서초구",
    "성동구",
    "성북구",
    "송파구",
    "양천구",
    "영등포구",
    "용산구",
    "은평구",
    "종로구",
    "중구",
    "중랑구",
  ],
  부산: [
    "강서구",
    "금정구",
    "기장군",
    "남구",
    "동구",
    "동래구",
    "부산진구",
    "북구",
    "사상구",
    "사하구",
    "서구",
    "수영구",
    "연제구",
    "영도구",
    "중구",
    "해운대구",
  ],
  대구: ["남구", "달서구", "달성군", "동구", "북구", "서구", "수성구", "중구"],
  인천: ["강화군", "계양구", "미추홀구", "남동구", "동구", "부평구", "서구", "연수구", "옹진군", "중구"],
  광주: ["광산구", "남구", "동구", "북구", "서구"],
  대전: ["대덕구", "동구", "서구", "유성구", "중구"],
  울산: ["남구", "동구", "북구", "울주군", "중구"],
  세종: ["조치원읍", "한솔동", "도담동", "고운동", "아름동", "종촌동", "장군면"],

  경기도: [
    "가평군",
    "고양시",
    "과천시",
    "광명시",
    "광주시",
    "구리시",
    "군포시",
    "김포시",
    "남양주시",
    "동두천시",
    "부천시",
    "성남시",
    "수원시",
    "시흥시",
    "안산시",
    "안성시",
    "안양시",
    "양주시",
    "양평군",
    "여주시",
    "연천군",
    "오산시",
    "용인시",
    "의왕시",
    "의정부시",
    "이천시",
    "파주시",
    "평택시",
    "포천시",
    "하남시",
    "화성시",
  ],
  강원도: [
    "강릉시",
    "고성군",
    "동해시",
    "삼척시",
    "속초시",
    "양구군",
    "양양군",
    "영월군",
    "원주시",
    "인제군",
    "정선군",
    "철원군",
    "춘천시",
    "태백시",
    "평창군",
    "홍천군",
    "화천군",
    "횡성군",
  ],
  충청북도: ["괴산군", "단양군", "보은군", "영동군", "옥천군", "음성군", "제천시", "진천군", "청주시", "충주시"],
  충청남도: [
    "계룡시",
    "공주시",
    "금산군",
    "논산시",
    "당진시",
    "보령시",
    "부여군",
    "서산시",
    "서천군",
    "아산시",
    "예산군",
    "천안시",
    "청양군",
    "태안군",
    "홍성군",
  ],
  전라북도: ["고창군", "군산시", "김제시", "남원시", "무주군", "부안군", "순창군", "완주군", "익산시", "임실군", "장수군", "전주시", "정읍시", "진안군"],
  전라남도: [
    "강진군",
    "고흥군",
    "곡성군",
    "광양시",
    "구례군",
    "나주시",
    "담양군",
    "목포시",
    "무안군",
    "보성군",
    "순천시",
    "신안군",
    "여수시",
    "영광군",
    "영암군",
    "완도군",
    "장성군",
    "장흥군",
    "진도군",
    "함평군",
    "해남군",
    "화순군",
  ],
  경상북도: [
    "경산시",
    "경주시",
    "고령군",
    "구미시",
    "군위군",
    "김천시",
    "문경시",
    "봉화군",
    "상주시",
    "성주군",
    "안동시",
    "영덕군",
    "영양군",
    "영주시",
    "영천시",
    "예천군",
    "울릉군",
    "울진군",
    "의성군",
    "청도군",
    "청송군",
    "칠곡군",
    "포항시",
  ],
  경상남도: [
    "거제시",
    "거창군",
    "고성군",
    "김해시",
    "남해군",
    "밀양시",
    "사천시",
    "산청군",
    "양산시",
    "의령군",
    "진주시",
    "창녕군",
    "창원시",
    "통영시",
    "하동군",
    "함안군",
    "함양군",
    "합천군",
  ],
  제주도: ["서귀포시", "제주시"],
};

const CreatePost = () => {
  const theme = useContext(ThemeContext);
  const navigation = useNavigation();

  const [category, setCategory] = useState(null);
  const [categoryOpen, setCategoryOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [inputHeight, setInputHeight] = useState(120); // 기본 높이 설정

  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [cityOpen, setCityOpen] = useState(false);
  const [districtOpen, setDistrictOpen] = useState(false);
  const [districtList, setDistrictList] = useState([]);

  const [maxParticipants, setMaxParticipants] = useState("");
  const [deposit, setDeposit] = useState("");
  const [tags, setTags] = useState("");

  const [recruitmentStart, setRecruitmentStart] = useState(new Date());
  const [recruitmentEnd, setRecruitmentEnd] = useState(new Date());
  const [activityStart, setActivityStart] = useState(new Date());
  const [activityEnd, setActivityEnd] = useState(new Date());

  const categoryCodeMap = {
    취미: "HOBBY",
    운동: "EXERCISE",
    또래: "PEERS",
    공부: "STUDY",
    음악: "MUSIC",
    게임: "GAME",
  };

  const handleSubmit = async () => {
    try {
      const accessToken = await EncryptedStorage.getItem("accessToken");
      if (!accessToken) {
        Alert.alert("로그인 필요", "게시글 생성을 위해 로그인이 필요합니다.");
        return;
      }

      const requestBody = {
        title,
        content: description,
        category: categoryCodeMap[category],
        membersMax: Number(maxParticipants),
        location: `${selectedCity} ${selectedDistrict}`,
        dueDate: recruitmentEnd.toISOString().split("T")[0],
        warranty: deposit,
        activityStartDate: activityStart.toISOString().split("T")[0],
        activityEndDate: activityEnd.toISOString().split("T")[0],
      };

      console.log("📦 게시글 등록 요청:", requestBody);

      const response = await axios.post("http://10.0.2.2:8080/api/posts/create", requestBody, {
        headers: {
          access: accessToken,
          "Content-Type": "application/json",
        },
      });

      console.log("✅ 게시글 생성 완료:", response.data);
      const postIdFromHeader = response.headers["postid"] || response.headers["location"]?.split("/").pop();

      console.log("📬 응답 헤더에서 postId 추출:", postIdFromHeader);

      if (!postIdFromHeader) {
        Alert.alert("에러", "게시글 ID를 찾을 수 없습니다.");
        return;
      }

      Alert.alert("성공", "게시글이 성공적으로 등록되었습니다!");
      navigation.navigate("MyPostDetail", { postId: postIdFromHeader });
    } catch (error) {
      console.error("❌ 게시글 등록 실패:", error.response?.data || error.message);
      Alert.alert("에러", "게시글 생성 중 오류가 발생했습니다.");
    }
  };

  const isFormValid = () => {
    return (
      title &&
      description &&
      selectedCity &&
      selectedDistrict &&
      maxParticipants &&
      deposit &&
      tags &&
      recruitmentStart &&
      recruitmentEnd &&
      activityStart &&
      activityEnd
    );
  };

  // 시 선택 시 구 리스트 업데이트
  useEffect(() => {
    if (selectedCity) {
      setDistrictList(
        districtData[selectedCity]?.map((district) => ({
          label: district,
          value: district,
        })) || []
      );
      setSelectedDistrict(null);
    }
  }, [selectedCity]);

  return (
    <KeyboardAwareScrollView
      extraScrollHeight={100} // 키보드와 입력창 사이 여백 추가
      enableOnAndroid={true} // Android에서도 동작하도록 설정
      keyboardShouldPersistTaps="handled"
    >
      <Container>
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {/* 카테고리 선택 */}
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
              modalProps={{
                animationType: "slide",
                transparent: false,
              }}
              modalTitle="카테고리 선택"
              modalTitleStyle={{
                fontSize: 18,
                fontWeight: "bold",
                marginBottom: 10,
              }}
              modalContentContainerStyle={{
                backgroundColor: "#fff",
                paddingHorizontal: 20,
                paddingVertical: 30,
                marginHorizontal: 20,
                marginVertical: 80,
                borderRadius: 16,
                elevation: 5,
              }}
              modalAnimationType="slide"
              style={{
                backgroundColor: "#fff",
                borderColor: theme.colors.grey,
                borderWidth: 1,
                borderRadius: 8,
                paddingHorizontal: 10,
              }}
              textStyle={{
                fontSize: 16,
                color: theme.colors.black,
              }}
            />
          </View>

          <Label>제목</Label>
          <Input returnKeyType="next" value={title} onChangeText={setTitle} placeholder="글 제목" containerStyle={{ marginTop: -20 }} />

          <Label>상세설명</Label>
          {/* input컴포넌트 사용시 높이조절 x */}
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder={`어떤 모임인지 자유롭게 설명해주세요!\n(ex. 주 몇회, 초보자 환영, 필요물품 ...)`}
            placeholderTextColor={theme.colors.grey}
            multiline={true}
            numberOfLines={5}
            onContentSizeChange={(e) => {
              setInputHeight(Math.max(120, e.nativeEvent.contentSize.height));
            }}
            style={{
              height: inputHeight,
              padding: 10,
              borderColor: theme.colors.grey,
              borderWidth: 1,
              borderRadius: 5,
              fontSize: 16,
              color: theme.colors.black,
              backgroundColor: theme.colors.white,
              fontFamily: theme.fonts.regular,
              textAlignVertical: "top",
            }}
          />

          <Label>지역</Label>
          <RowContainer style={{ zIndex: 3000 }}>
            {/* 시 선택 드롭다운 */}
            <View style={{ width: "40%" }}>
              <DropDownPicker
                open={cityOpen}
                value={selectedCity}
                items={cityData}
                setOpen={setCityOpen}
                setValue={setSelectedCity}
                placeholder="시 선택"
                listMode="MODAL"
                modalProps={{
                  animationType: "slide",
                  transparent: false,
                }}
                modalTitle="시 선택"
                modalTitleStyle={{
                  fontSize: 18,
                  fontWeight: "bold",
                  marginBottom: 10,
                  color: "#333",
                }}
                modalContentContainerStyle={{
                  backgroundColor: "#fff",
                  paddingHorizontal: 20,
                  paddingVertical: 30,
                  marginHorizontal: 20,
                  marginVertical: 80,
                  borderRadius: 16,
                  elevation: 5,
                }}
                modalAnimationType="slide"
                style={{
                  backgroundColor: "#fff",
                  borderColor: theme.colors.grey,
                  borderWidth: 1,
                  borderRadius: 8,
                  paddingHorizontal: 10,
                }}
                textStyle={{
                  fontSize: 16,
                  color: "#333",
                }}
              />
            </View>

            {/* 구 선택 드롭다운 */}
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
                modalProps={{
                  animationType: "slide",
                  transparent: false,
                }}
                modalTitle="구 선택"
                modalTitleStyle={{
                  fontSize: 18,
                  fontWeight: "bold",
                  marginBottom: 10,
                  color: "#333",
                }}
                modalContentContainerStyle={{
                  backgroundColor: "#fff",
                  paddingHorizontal: 20,
                  paddingVertical: 30,
                  marginHorizontal: 20,
                  marginVertical: 80,
                  borderRadius: 16,
                  elevation: 5,
                }}
                modalAnimationType="slide"
                style={{
                  backgroundColor: "#fff",
                  borderColor: theme.colors.grey,
                  borderWidth: 1,
                  borderRadius: 8,
                  paddingHorizontal: 10,
                }}
                textStyle={{
                  fontSize: 16,
                  color: "#333",
                }}
              />
            </View>
          </RowContainer>

          <Label>모임 최대 인원</Label>
          <Input
            returnKeyType="next"
            value={maxParticipants}
            onChangeText={setMaxParticipants}
            placeholder="모임을 함께할 최대 인원 수 (ex. 8, 10)"
            containerStyle={{ marginTop: -20 }}
          />

          <Label>모집 기간</Label>
          <RowContainer>
            {/* 모집 시작일 - 고정값 (오늘) */}
            <DateInputContainer disabled={true}>
              <DateText>{recruitmentStart.toLocaleDateString("ko-KR")}</DateText>
              <Ionicons name="calendar-outline" size={20} color="#888" />
            </DateInputContainer>
            <Text>~</Text>
            <CalendarPicker
              date={recruitmentEnd}
              setDate={setRecruitmentEnd}
              minDate={recruitmentStart} // 모집 시작 이후 날짜만 선택 가능
              disabled={!recruitmentStart} // 모집 시작을 선택해야 활성화
            />
          </RowContainer>

          <Label>활동 기간</Label>
          <RowContainer>
            <CalendarPicker date={activityStart} setDate={setActivityStart} />
            <Text>~</Text>
            <CalendarPicker
              date={activityEnd}
              setDate={setActivityEnd}
              minDate={activityStart} // ✅ 활동 시작 이후만 선택 가능
              disabled={!activityStart} // ✅ 시작 날짜 선택 후 활성화
            />
          </RowContainer>

          <Label>보증금</Label>
          <Input returnKeyType="next" value={deposit} onChangeText={setDeposit} placeholder="₩ 999,999,999" containerStyle={{ marginTop: -20 }} />

          <Label>태그</Label>
          <Input returnKeyType="done" value={tags} onChangeText={setTags} placeholder="#뜨개질 #취미 #종로구" containerStyle={{ marginTop: -20 }} />

          <ButtonContainer>
            <Button
              title="만들기"
              onPress={handleSubmit}
              disabled={!isFormValid()}
              containerStyle={{ height: 45, width: 350 }}
              textStyle={{ fontSize: 16 }}
              style={{ height: 45, width: 350 }}
            />
          </ButtonContainer>
        </ScrollView>
      </Container>
    </KeyboardAwareScrollView>
  );
};

export default CreatePost;
