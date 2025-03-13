import React from "react";
import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import PropTypes from "prop-types";

const Container = styled.View`
  flex: 1;
  background-color: transparent;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  height: 20px;
`;
const Title = styled.Text`
  font-size: 15px;
  font-family: ${({ theme }) => theme.fonts.regular};
  color: ${({ theme }) => theme.colors.mainBlue};
  text-decoration: underline;
`;

const LostPw = ({ title, onPress, containerStyle, textStyle }) => {
  return (
    <TouchableOpacity onPress={onPress} style={{ flexDirection: "row" }}>
      <Container style={containerStyle}>
        <Title style={textStyle}>{title}</Title>
      </Container>
    </TouchableOpacity>
  );
};

LostPw.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  containerStyle: PropTypes.object,
  textStyle: PropTypes.object,
};

export default LostPw;
