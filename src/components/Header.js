import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import styled from "styled-components/native";

const HeaderContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 40px;
  position: relative;
  height:50px;
`;

const HeaderTitle = styled(Text)`
  font-size: 18px;
  font-family: ${({theme}) => theme.fonts.bold};
  text-align: center;
  flex:1;

`;

const Header = ({title}) => {
    const navigation = useNavigation();
  
    return (
      <HeaderContainer>
        <TouchableOpacity onPress={() => navigation.goBack()} >
          <Feather name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <HeaderTitle>{title}</HeaderTitle>
        <View style={{width:24}}/>
      </HeaderContainer>
    );
  };
  
  export default Header;