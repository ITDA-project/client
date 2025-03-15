import React from "react";
import styled from "styled-components/native";
import PropTypes from "prop-types";

const StyledText = styled.Text`
  width: 100%;
  height: 17px;
  color: ${({ theme }) => theme.colors.red};
  font-size: 13px;
  font-family: ${({ theme }) => theme.fonts.regular};
  z-index: 999;
`;

const ErrorMessage = ({ message }) => {
  return <StyledText>{message}</StyledText>;
};

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
};

export default ErrorMessage;
