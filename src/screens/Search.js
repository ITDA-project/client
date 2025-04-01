import React from "react";
import { View, Text } from "react-native";
import RequireAuth from "../components/RequireAuth";

const Search = () => {
  return (
    <RequireAuth>
      <View>
        <Text>Search Screen</Text>
      </View>
    </RequireAuth>
  );
};

export default Search;
