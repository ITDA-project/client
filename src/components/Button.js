import React from "react";
import { TouchableOpacity, Text } from "react-native";
import styled from "styled-components/native";

//primary:파란색 버튼, secondary:연한파란색 버튼튼
const StyledButton = styled(TouchableOpacity)`
  padding: 10px 20px;
  border-radius: 8px;
  justify-content: center;
  align-items: center;
  background-color: ${({ primary, secondary, theme }) =>
    primary ? theme.colors.mainBlue : secondary ? "#E0ECF8" : "#ccc"};
`;

const ButtonText = styled(Text)`
  font-size: 14px;
  font-weight: bold;
  color: ${({ primary, secondary, theme }) =>
    primary ? theme.colors.white : secondary ? theme.colors.mainBlue : theme.colors.black};
`;

const Button = ({ title, onPress, primary, secondary }) => {
  return (
    <StyledButton onPress={onPress} primary={primary} secondary={secondary}>
      <ButtonText primary={primary} secondary={secondary}>{title}</ButtonText>
    </StyledButton>
  );
};

export default Button;


