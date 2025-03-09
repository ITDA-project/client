import React,{useState,useContext} from "react";
import styled from "styled-components/native";
import { View, Text, FlatList, TouchableOpacity, StyleSheet,Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import {ThemeContext} from 'styled-components/native';


  const AllPosts = ({ route }) => {
    const theme=useContext(ThemeContext);

    const styles = StyleSheet.create({
        container: {flex: 1, backgroundColor: "#fff",paddingHorizontal: 20, },
        header: {flexDirection: "row",alignItems: "center",justifyContent:'space-between',marginTop:40,paddingVertical: 15,position:'relative',},
        headerTitle: {fontSize: 18,fontWeight: "bold", textAlign:'center',position:'absolute',left:0,right:0,},
        
        sortContainer: {flexDirection: "row",marginTop:10, marginBottom: 10,marginLeft:230,},
        sortButton: { height:25, width:60, borderRadius: 20, backgroundColor: "#E9E9E9", marginRight: 5, justifyContent:'center',alignItems:'center',},
         
        selectedSort: {backgroundColor: theme.colors.tabBlue, },
        sortText: {
          fontSize: 14,
          color: "#8C8C8C",
        },
        selectedText: {
          color: theme.colors.mainBlue,

        },
        postItem: {
        paddingBottom:15,
          paddingVertical: 15,
          borderBottomWidth: 1,
          borderBottomColor: "#eee",
        },
        postTitle: {
          fontSize: 18,
          fontWeight: "bold",
        },
        postInfo: {
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 5,
        },
        postDate: {
          color: "#666",
        },
        likesContainer: {
          flexDirection: "row",
          alignItems: "center",
        },
        likesText: {
          marginLeft: 5,
          color: "#666",
        },
        writeButton: {
        height:45,
        width: 95,
        position: "absolute",
        bottom: 30,
        right: 20,
        backgroundColor: theme.colors.mainBlue,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
        justifyContent:'center',
        alignItems:'center',
        },
        writeButtonText: {
          color: theme.colors.white,
          fontSize: 16,
          fontWeight: "bold",
          textAlign:'center',
        },
      });

    const navigation = useNavigation();
    const { meetings } = route.params;
    const [selectedSort, setSelectedSort] = useState("latest");
  
    // 정렬된 데이터 생성
    const sortedMeetings = [...meetings].sort((a, b) => {
      if (selectedSort === "latest") {
        return new Date(b.date) - new Date(a.date); // 최신순 (날짜 내림차순)
      } else {
        return b.likes - a.likes; // 인기순 (좋아요 내림차순)
      }
    });
  
    return (
    <View style={styles.container}>
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() =>navigation.goBack()} hitSlop={{ top: 20, bottom: 20, left: 30, right: 30 }} > {/*❌뒤로가기 수정 필요(터치범위 인식 잘 안됨)*/ }
            <Feather name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>전체글</Text>
        </View>
  
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
          data={sortedMeetings}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.postItem}>
              <Text style={styles.postTitle}>{item.title}</Text>
              <View style={styles.postInfo}>
                <Text style={styles.postDate}>{item.date}</Text>
                <View style={styles.likesContainer}>
                  <Feather name="heart" size={16} color="#ccc" />
                  <Text style={styles.likesText}>{item.likes}</Text>
                </View>
              </View>
            </View>
          )}
        />
  
        {/* 글쓰기 버튼 */}
        <TouchableOpacity 
          style={styles.writeButton} 
          onPress={() => navigation.navigate("WritePost")}
        >
          <Text style={styles.writeButtonText}>글쓰기</Text>
        </TouchableOpacity>
    </View>
    );
  };

export default AllPosts;
