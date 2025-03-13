import React from "react";
import styled from "styled-components/native";
import { MaterialIcons } from "@expo/vector-icons";

const Container = styled.View`
  margin-top: 10px;
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
  font-weight: bold;
  margin-left: 5px;
`;

const Content = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.black};
`;

const DateText = styled.Text`
  font-size: 12px;
  color: #999;
  margin-top: 3px;
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
