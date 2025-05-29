import React, { useState, useContext, useCallback, useEffect } from "react";
import { Keyboard, ScrollView, TouchableOpacity } from "react-native";
import { styled, ThemeContext } from "styled-components/native";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import EncryptedStorage from "react-native-encrypted-storage";

const Container = styled.View`
  flex: 1;
  background-color: #fff;
  padding: 70px 20px 0 20px;
`;

const SearchBox = styled.View`
  flex-direction: row;
  height: 60px;
  border: 2px solid;
  border-color: ${({ theme }) => theme.colors.mainBlue};
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
  margin-left: 5px;
  justify-content: flex-start;
`;

const PlaceholderText = styled.Text`
  text-align: left;
  color: #8c8c8c;
  font-size: 16px;
  line-height: 22px;
`;

const ExampleText = styled.Text`
  text-align: left;
  margin-top: 10px;
  color: #c0c0c0;
  font-size: 15px;
`;

const ResultTitle = styled.Text`
  margin-top: 30px;
  font-size: 20px;
  font-family: ${({ theme }) => theme.fonts.extraBold};
  margin-bottom: 15px;
`;

const ResultItem = styled.View`
  margin-top: 20px;
`;

const ResultText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 17px;
`;

const ResultDate = styled.Text`
  margin-top: 3px;
  font-size: 14px;
  color: #999;
`;

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  const navigation = useNavigation();
  const theme = useContext(ThemeContext);
  const fetchUserInfo = async () => {
    try {
      const token = await EncryptedStorage.getItem("accessToken");
      console.log("🔑 accessToken:", token);
      const response = await axios.get("http://10.0.2.2:8080/api/mypage/me", {
        headers: {
          access: `${token}`,
        },
      });

      setCurrentUserId(response.data.data);
    } catch (error) {
      console.error("유저 정보 가져오기 실패:", error);
    }
  };
  useEffect(() => {
    fetchUserInfo();
  }, []);

  const handleSearch = async () => {
    Keyboard.dismiss();

    try {
      const trimmedQuery = query.trim();
      console.log("🔍 검색어 확인:", trimmedQuery);

      const response = await axios.get("http://10.0.2.2:8080/api/posts/search", {
        params: { keyword: trimmedQuery },
      });

      console.log("📥 검색 응답:", response.data);

      const dtoList = response.data.dtoList || [];
      setResults(dtoList);
    } catch (error) {
      console.error("❌ 검색 실패:", error);
      Alert.alert("검색 실패", "다시 시도해주세요.");
      setResults([]);
    }
  };
  useFocusEffect(
    useCallback(() => {
      // 화면에 진입했을 때 초기화
      setQuery("");
      setResults([]);
    }, [])
  );
  return (
    <Container>
      <SearchBox>
        <StyledInput placeholder="검색" value={query} onChangeText={setQuery} onSubmitEditing={handleSearch} returnKeyType="search" />
        <SearchButton onPress={handleSearch}>
          <Feather name="search" size={26} color={theme.colors.mainBlue} />
        </SearchButton>
      </SearchBox>

      {query === "" ? (
        <PlaceholderContainer>
          <PlaceholderText>#태그를 입력하거나{"\n"}원하는 키워드를 검색해보세요!</PlaceholderText>
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
                  onPress={() => {
                    const isMine = String(item.userId) === String(currentUserId);
                    const screen = isMine ? "MyPostDetail" : "PostDetail";

                    navigation.navigate(screen, item);
                  }}
                >
                  <ResultItem>
                    <ResultText>{item.title}</ResultText>
                    <ResultDate>{item.createdAt?.split("T")[0].split("-").join(".")}</ResultDate>
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
