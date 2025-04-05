import React, { useState,useContext } from "react";
import { Keyboard,ScrollView,TouchableOpacity } from "react-native";
import {styled,ThemeContext} from "styled-components/native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

// ✅ 더미 데이터
const meetings = [
  { userId: 1, postId: "1", title: "함께 뜨개질해요!",content: "주말에 시간 되시는 분", createdAt: "2025.02.17", likes: 7 },
  { userId: 2, postId: "2", title: "퇴근 후 한강 러닝 크루 모집",content: "주말에 시간 되시는 분", createdAt: "2025.02.11", likes: 5 },
  { userId: 3, postId: "3", title: "볼링 동호회 회원 모집",content: "주말에 시간 되시는 분", createdAt: "2025.01.25", likes: 13 },
  { userId: 4, postId: "4", title: "테니스 동호회 회원 모집",content: "주말에 시간 되시는 분", createdAt: "2025.01.20", likes: 15 },
  { userId: 5, postId: "5", title: "주말에 배드민턴 쳐요",content: "주말에 시간 되시는 분", createdAt: "2025.01.20", likes: 10 },
  { userId: 1, postId: "6", title: "돈까스 맛집 탐방",content: "주말에 시간 되시는 분", createdAt: "2025.01.20", likes: 20 },
  { userId: 6, postId: "7", title: "소믈리에 와인 모임", content: "주말에 시간 되시는 분",createdAt: "2025.02.12", likes: 15 },
  { userId: 1, postId: "8", title: "주말 캠핑 동호회", content: "주말에 시간 되시는 분",createdAt: "2025.01.28", likes: 10 },
  { userId: 2, postId: "9", title: "주말 요가 클래스", content: "주말에 시간 되시는 분",createdAt: "2025.01.30", likes: 13 },
  { userId: 1, postId: "10", title: "프랑스어 스터디", content: "주말에 시간 되시는 분",createdAt: "2025.02.01", likes: 6 },
];

const Container = styled.View`
  flex: 1;
  background-color: #fff;
  padding: 70px 20px 0 20px;
`;


const SearchBox = styled.View`
  flex-direction: row;
  height:60px;
  border: 2px solid ;
  border-color: ${({theme})=>theme.colors.mainBlue};
  border-radius: 10px;
  padding: 8px 12px;
  align-items: center;
`;

const StyledInput = styled.TextInput`
  flex: 1;
  font-size: 16px;
  
`;

const SearchButton = styled.TouchableOpacity``;

const PlaceholderContainer = styled.View`
  margin-top: 30px;
  margin-left:5px;
  justify-content:flex-start;
`;

const PlaceholderText = styled.Text`
  text-align: left;
  color: #8c8c8c;
  font-size: 16px;
  line-height: 22px;
  
`;

const ExampleText = styled.Text`
  text-align:left;
  margin-top: 10px;
  color: #c0c0c0;
  font-size: 15px;
  
`;


const ResultTitle = styled.Text`
  margin-top:30px;
  font-size: 20px;
  font-family: ${({theme})=>theme.fonts.extraBold};
  margin-bottom: 15px;
`;

const ResultItem = styled.View`
  margin-top: 20px;
  
`;

const ResultText = styled.Text`
  font-family: ${({theme})=>theme.fonts.bold};
  font-size: 17px;
`;

const ResultDate = styled.Text`
  margin-top:3px;
  font-size: 14px;
  color: #999;
`;


const Search = () => {

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const currentUserId = 1;
  const navigation = useNavigation();
  
  const theme = useContext(ThemeContext);

  const handleSearch = () => {
    Keyboard.dismiss();

    const filtered = meetings.filter((item) =>
      item.title.includes(query.trim()) ||
      item.content.includes(query.trim())
    );

    setResults(filtered);
  };

  return (
    <Container>
      
      <SearchBox>
        <StyledInput
          placeholder="검색"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <SearchButton onPress={handleSearch}>
          <Feather name="search" size={26} color={theme.colors.mainBlue} />
        </SearchButton>
      </SearchBox>

      {query === "" ? (
      <PlaceholderContainer>
        <PlaceholderText>
          #태그를 입력하거나{"\n"}원하는 키워드를 검색해보세요!
        </PlaceholderText>
        <ExampleText>ex) #취미, 종로구, 맛집, 뜨개질</ExampleText>
      </PlaceholderContainer>
    ) : (
      <>
        <ResultTitle>'{query}' 검색 결과</ResultTitle>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {results.length > 0 ? (
            results.map((item) => (
              <TouchableOpacity
                key={item.postId}
                onPress={() =>
                  navigation.navigate(
                    item.userId === currentUserId ? "MyPostDetail" : "PostDetail",
                    { postId: item.postId,title:item.title,createdAt:item.createdAt }
                  )
                }
              >
                <ResultItem>
                  <ResultText>{item.title}</ResultText>
                  <ResultDate>{item.createdAt}</ResultDate>
                </ResultItem>
              </TouchableOpacity>
            ))
          ) : (
            <ResultText>결과가 없습니다.</ResultText>
          )}
        </ScrollView>
      </>
    )}

    </Container>
  );
};

export default Search;
