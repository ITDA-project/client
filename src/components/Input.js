import React, { useState, forwardRef } from "react";
import styled from "styled-components/native";
import PropTypes from "prop-types";

const Container = styled.View`
  flex-direction: column;
  margin: 10px 0;
`;
const Label = styled.Text`
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 6px;
  color: ${({ theme }) => theme.colors.grey};
  font-family: ${({ theme }) => theme.fonts.regular};
`;
const StyledInput = styled.TextInput.attrs(({ theme }) => ({
  placeholderTextColor: theme.colors.grey,
  fontFamily: theme.fonts.regular,
  fontSize: 16,
}))`
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.black};
  padding: 10px;
  font-size: 16px;
  font-family: ${({ theme }) => theme.fonts.regular};
  border: 1px solid ${({ theme }) => theme.colors.grey};
  border-radius: 5px;
  height: 50px;
`;

const Input = forwardRef(
  (
    {
      label,
      value,
      onChangeText,
      onSubmitEditing,
      placeholder,
      returnKeyType,
      maxLength,
      isPassword,
      disabled,
      containerStyle,
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    return (
      <Container style={containerStyle}>
        <Label isFocused={isFocused}>{label}</Label>
        <StyledInput
          ref={ref}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmitEditing}
          placeholder={placeholder}
          returnKeyType={returnKeyType}
          maxLength={maxLength}
          autoCapitalize="none"
          autoCorrect={false}
          textContentType={isPassword ? "password" : "none"}
          isFocused={isFocused}
          onFocus={() => setIsFocused(true)}
          secureTextEntry={isPassword}
          editable={!disabled}
        />
      </Container>
    );
  }
);

Input.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChangeText: PropTypes.func,
  onSubmitEditing: PropTypes.func,
  placeholder: PropTypes.string,
  returnKeyType: PropTypes.oneOf(["done", "next"]),
  maxLength: PropTypes.number,
  isPassword: PropTypes.bool,
  disabled: PropTypes.bool,
  containerStyle: PropTypes.object,
};

export default Input;
