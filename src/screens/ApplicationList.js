import React, { useState, useEffect, useContext, useCallback } from "react"; // useCallback 추가
import styled, { ThemeContext } from "styled-components/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TouchableOpacity, ActivityIndicator, FlatList, Alert } from "react-native";
import { AlertModal } from "../components";
import { AntDesign } from "@expo/vector-icons";
import api from "../api/api";
import EncryptedStorage from "react-native-encrypted-storage";
import { useRoute, useFocusEffect } from "@react-navigation/native"; // useFocusEffect 추가

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
  margin-right: 20px;
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
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [onConfirmAction, setOnConfirmAction] = useState(null);

  // 신청서 목록을 불러오는 함수를 useCallback으로 감싸줍니다.
  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const accessToken = await EncryptedStorage.getItem("accessToken");

      if (!accessToken) {
        setAlertMessage("로그인이 필요합니다.");
        setOnConfirmAction(() => () => navigation.navigate("Login"));
        setAlertVisible(true);
        return;
      }

      const response = await api.get(`/posts/${postId}/form/list`, {
        headers: { access: accessToken },
      });

      const formList = response.data.data.forms;
      console.log("신청서 목록: ", formList);

      setApplications(formList);
    } catch (error) {
      console.error("신청서 불러오기 실패: ", error);
      setAlertMessage("신청서를 불러오는 데 실패했습니다.");
      setOnConfirmAction(null);
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  }, [postId, navigation]); // postId와 navigation이 변경될 때만 이 함수가 재생성됩니다.

  // useFocusEffect를 사용하여 화면이 포커스될 때마다 fetchApplications를 실행합니다.
  useFocusEffect(
    useCallback(() => {
      fetchApplications();
      // 이 return 함수는 화면이 포커스를 잃을 때 실행됩니다 (클린업).
      return () => {
        // 필요하다면 여기에서 클린업 작업을 수행할 수 있습니다.
        // 예를 들어, 보류 중인 네트워크 요청을 취소하는 등.
      };
    }, [fetchApplications]) // fetchApplications 함수가 변경될 때만 이 effect가 다시 실행됩니다.
  );

  const renderItem = ({ item }) => (
    <ListItem
      onPress={() =>
        navigation.navigate("신청서 확인", {
          postId,
          formId: item.formId,
          name: item.userName,
          image: { uri: item.userImage || "https://ssl.pstatic.net/static/pwe/address/img_profile.png" },
        })
      }
    >
      <ProfileImage source={{ uri: item.userImage || "https://ssl.pstatic.net/static/pwe/address/img_profile.png" }} />
      <NameText>{item.userName}</NameText>
      <AntDesign name="right" size={20} style={{ color: theme.colors.grey }} />
    </ListItem>
  );

  return (
    <Container insets={insets}>
      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 20 }} />
      ) : applications.length === 0 ? (
        <NameText style={{ alignSelf: "center", marginTop: 350, color: "#a1a1a1" }}>신청서가 없습니다</NameText>
      ) : (
        <StyledFlatList data={applications} keyExtractor={(item) => item.formId.toString()} renderItem={renderItem} />
      )}
      <AlertModal
        visible={alertVisible}
        message={alertMessage}
        onConfirm={() => {
          setAlertVisible(false);
          if (onConfirmAction) onConfirmAction();
        }}
      />
    </Container>
  );
};

export default ApplicationList;
