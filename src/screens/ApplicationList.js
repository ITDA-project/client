import React, { useState, useEffect, useContext } from "react";
import styled, { ThemeContext } from "styled-components/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TouchableOpacity, ActivityIndicator, FlatList } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import axios from "axios";

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

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        // 임시 데이터 설정
        const response = {
          data: [
            { id: 1, name: "신짱구", image: require("../../assets/images/jjang.png") },
            { id: 2, name: "김철수", image: require("../../assets/images/kim.png") },
          ],
        };
        setApplications(response.data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const renderItem = ({ item }) => (
    <ListItem onPress={() => navigation.navigate("신청서 확인", { id: item.id, name: item.name, image: item.image })}>
      <ProfileImage source={item.image} />
      <NameText>{item.name}</NameText>
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
