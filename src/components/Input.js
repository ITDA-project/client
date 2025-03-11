import React from 'react';
import styled from 'styled-components/native';


const StyledInput = styled.TextInput`
  width: 100%;
  height: ${({height})=> height || '40px'};
  border-width: 1px;
  border-color: ${({theme})=>theme.colors.grey};
  border-radius: 10px;
  padding: 10px;
  
`;

const Input = ({ value, onChangeText, placeholder, multiline = false, height }) => {
    return (
      <StyledInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        multiline={multiline}
        height={height}
      />
    );
  };

  export default Input;