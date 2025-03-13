import React from "react";
import { TouchableOpacity, Text } from "react-native";
import styled from "styled-components/native";

//primary:파란색 버튼, secondary:연한파란색 버튼
const StyledButton = styled(TouchableOpacity)`
  padding: 10px 20px;
  border-radius: 8px;
  justify-content: center;
  align-items: center;
  background-color: ${({ primary, secondary, theme }) =>
    primary ? theme.colors.mainBlue : secondary ? "#E0ECF8" : "#ccc"};
   width: ${({ width }) => (width ? `${width}px` : "95px")}; 
   height: ${({ height }) => (height ? `${height}px` : "40px")}; 
`;

const ButtonText = styled(Text)`
  font-size: 15px;
  font-weight: bold;
  color: ${({ primary, secondary, theme }) =>
    primary ? theme.colors.white : secondary ? theme.colors.mainBlue : theme.colors.black};
`;

const Button = ({ title, onPress, primary, secondary,width,heigth }) => {
  return (
    <StyledButton onPress={onPress} primary={primary} secondary={secondary} width={width} heigth={heigth}>
      <ButtonText primary={primary} secondary={secondary}>{title}</ButtonText>
    </StyledButton>
  );
};

export default Button;


