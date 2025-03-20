import React,{useState,useContext} from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet,Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import {ThemeContext} from 'styled-components/native';
import Button from "../components/Button";
import Header from "../components/Header";

  const AllPosts = ({ route }) => {
    const theme=useContext(ThemeContext);

    const styles = StyleSheet.create({
        container: {flex: 1, backgroundColor: "#fff",paddingHorizontal: 20, },
        
        
        sortContainer: {flexDirection: "row",marginTop:10, marginBottom: 10,marginLeft:230,},
        sortButton: { height:25, width:60, borderRadius: 20, backgroundColor: "#E9E9E9", marginRight: 5, justifyContent:'center',alignItems:'center',},
        sortText: {fontSize: 14, color: "#8C8C8C",fontFamily: theme.fonts.regular}, 

        selectedSort: {backgroundColor: theme.colors.tabBlue, },
        selectedText: {color: theme.colors.mainBlue,},
        
        postItem: {paddingBottom:15, paddingVertical: 15,borderBottomWidth: 1,borderBottomColor: "#eee",},
        postTitle: {fontSize: 18,fontFamily: theme.fonts.extraBold,},
        postInfo: {flexDirection: "row", justifyContent: "space-between",marginTop: 5,},
        postDate: {color: theme.colors.grey,fontFamily: theme.fonts.regular, marginTop: 3},

        likesContainer: {flexDirection: "row", alignItems: "center",},
        likesText: {marginLeft: 5,color: "#979C9E",fontFamily: theme.fonts.bold},

        ButtonContainer: {
        position: "absolute",
        bottom: 30,
        right: 5,
        paddingHorizontal: 20,
        paddingVertical: 10,
        justifyContent:'center',
        alignItems:'center',
        },
        
      });

    const navigation = useNavigation();
    const { meetings } = route.params;
    const [selectedSort, setSelectedSort] = useState("latest");
  
    // 정렬된 데이터 생성
    const sortedMeetings = [...meetings].sort((a, b) => {
      if (selectedSort === "latest") {
        return new Date(b.created_at) - new Date(a.created_at); // 최신순 (날짜 내림차순)
      } else {
        return b.likes - a.likes; // 인기순 (좋아요 내림차순)
      }
    });
    
  
    return (
    <View style={styles.container}>
        {/* 헤더 */}
        <Header title="전체글"/>
  
        {/* 정렬 버튼 */}
        <View style={styles.sortContainer}>
          <TouchableOpacity 
            style={[styles.sortButton, selectedSort === "latest" && styles.selectedSort]} 
            onPress={() => setSelectedSort("latest")}>
            <Text style={[styles.sortText, selectedSort === "latest" && styles.selectedText]}>최신순</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.sortButton, selectedSort === "popular" && styles.selectedSort]} 
            onPress={() => setSelectedSort("popular")}>
            <Text style={[styles.sortText, selectedSort === "popular" && styles.selectedText]}>인기순</Text>
          </TouchableOpacity>
        </View>
  
        {/* 게시글 리스트 */}
        <FlatList
          showsVerticalScrollIndicator={false}
          data={sortedMeetings}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.postItem} onPress={()=>console.log("게시글 상세보기")}>
              <Text style={styles.postTitle}>{item.title}</Text>
              <View style={styles.postInfo}>
                <Text style={styles.postDate}>{item.created_at}</Text>
                <View style={styles.likesContainer}>
                  <Feather name="heart" size={16} color="#ccc" />
                  <Text style={styles.likesText}>{item.likes}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
  
        {/* 글쓰기 버튼 */}
        <View style={styles.ButtonContainer}>
          <Button title="글쓰기" 
          onPress={() => console.log("글쓰기")}
          containerStyle={{ height: 40,width:95}} 
          textStyle={{ fontSize: 16,marginLeft:0}}
          style={{height: 40,width:95}} />

        </View>
    </View>
    );
  };

export default AllPosts;