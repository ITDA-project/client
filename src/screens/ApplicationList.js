import React, { useState, useEffect, useContext } from "react";
import styled, { ThemeContext } from "styled-components/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TouchableOpacity, ActivityIndicator, FlatList, Alert } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import axios from "axios";
import EncryptedStorage from "react-native-encrypted-storage";
import { useRoute } from "@react-navigation/native";

const Container = styled.View`
  flex: 1;
  justify-content: flex-start;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.white};
  padding-bottom: ${(props) => props.insets.bottom}px;
`;
const Title = styled.Text`
  font-size: 18px;
  font-family: ${({ theme }) => theme.fonts.extraBold};
  color: ${({ theme }) => theme.colors.black};
  align-self: flex-start;
  margin-top: 30px;
  margin-left: 20px;
  margin-bottom: 20px;
`;
const ListItem = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding: 15px;
  border-bottom-width: 0.5px;
  border-bottom-color: ${({ theme }) => theme.colors.grey};
`;
const ProfileImage = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  margin-right: 10px;
`;
const NameText = styled.Text`
  flex: 1;
  font-size: 16px;
  font-family: ${({ theme }) => theme.fonts.bold};
  color: ${({ theme }) => theme.colors.black};
`;
const StyledFlatList = styled(FlatList)`
  width: 100%;
`;

const ApplicationList = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const theme = useContext(ThemeContext);
  const route = useRoute();
  const { postId } = route.params;

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const accessToken = await EncryptedStorage.getItem("accessToken");

        if (!accessToken) {
          Alert.alert("로그인 해주세요.");
          return;
        }

        const response = await axios.get(`http://10.0.2.2:8080/api/posts/${postId}/form/list`, {
          headers: { access: accessToken },
        });

        const { dtoList } = response.data.data;

        setApplications(dtoList);
      } catch (error) {
        console.error("신청서 불러오기 실패: ", error);
        Alert.alert("신청서를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const renderItem = ({ item }) => (
    <ListItem onPress={() => navigation.navigate("신청서 확인", { formId: item.formId })}>
      <ProfileImage source={{ uri: item.userImage || "https://via.placeholder.com/40" }} />
      <NameText>{item.userName}</NameText>
      <AntDesign name="right" size={20} style={{ color: theme.colors.grey }} />
    </ListItem>
  );

  // 타이틀 나중에 수정
  return (
    <Container insets={insets}>
      <Title>함께 뜨개질해요!</Title>
      <StyledFlatList data={applications} keyExtractor={(item) => item.id.toString()} renderItem={renderItem} />
    </Container>
  );
};

export default ApplicationList;
