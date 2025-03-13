import React from "react";
import { TouchableOpacity, Image } from "react-native";
import styled from "styled-components/native";
import PropTypes from "prop-types";

const Container = styled.View`
  background-color: ${({ theme }) => theme.colors.mainBlue};
  padding: 12px 16px;
  margin: 10px 0;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  height: 50px;
  opacity: ${({ disabled }) => (disabled ? 0.7 : 1)};
`;
const Title = styled.Text`
  font-size: 20px;
  font-family: ${({ theme }) => theme.fonts.bold};
  color: ${({ theme }) => theme.colors.white};
  margin-left: 10px;
`;

const Button = ({
  title,
  onPress,
  containerStyle,
  textStyle,
  disabled,
  icon,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={{ flexDirection: "row" }}
    >
      <Container style={containerStyle} disabled={disabled}>
        {icon && <Image source={icon} style={{ width: 20, height: 20 }} />}
        <Title style={textStyle}>{title}</Title>
      </Container>
    </TouchableOpacity>
  );
};

Button.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  containerStyle: PropTypes.object,
  textStyle: PropTypes.object,
  disabled: PropTypes.bool,
};

export default Button;
