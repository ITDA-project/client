import React from "react";
import styled from "styled-components/native";
import { MaterialIcons } from "@expo/vector-icons";

const Container = styled.View`
  margin-top: 8px;
  margin-bottom: 10px;
  flex-direction: column;
`;

const StarContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const StarText = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.mainBlue};
  font-family: ${({theme}) => theme.fonts.extraBold};
  margin-left: 5px;
`;

const Content = styled.Text`
  font-size: 14px;
  font-family: ${({theme}) => theme.fonts.regular};
  color: ${({ theme }) => theme.colors.black};
  margin-top: 5px;
`;

const DateText = styled.Text`
  font-size: 12px;
  font-family: ${({theme}) => theme.fonts.regular};
  color: ${({theme})=>theme.colors.grey};
  margin-top: 4px;
`;

const Review = ({ star, text, created_at }) => {
  return (
    <Container>
      <StarContainer>
        <MaterialIcons name="star" size={18} color="#FFC107" />
        <StarText>{star}</StarText>
      </StarContainer>
      <Content>{text}</Content>
      <DateText>{created_at}</DateText>
    </Container>
  );
};

export default Review;
