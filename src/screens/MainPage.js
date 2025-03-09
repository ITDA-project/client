import React, { useContext } from 'react';
import { Image,View, Text, TextInput, FlatList, TouchableOpacity,ScrollView, StyleSheet } from 'react-native';
import { ThemeContext,styled } from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import Logo from "../../assets/logo.svg";
import AllPosts from './AllPosts';

const LogoContainer = styled.View`
  align-items: center;  
  margin-top: 60px;
  margin-bottom: 40px;
`;




// 메인 페이지
const MainPage = () => {
  const theme = useContext(ThemeContext);
  const navigation=useNavigation(); //네비게이션 사용

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  
    searchContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderRadius: 10, paddingHorizontal: 10, borderColor: theme.colors.mainBlue},
    searchInput: { flex: 1, height: 50 },
    searchIcon: { marginLeft: 5 },
  
    categoryContainer: {
        marginTop: 30, // 검색창과 카테고리 간의 간격
        marginBottom: 30, // 카테고리와 모임 목록 간의 간격
        flexDirection: 'row',
        justifyContent: 'space-between', // 아이콘 사이에 공간을 자동으로 분배
        paddingHorizontal: 10,
      },
      categoryItem: {
        flexDirection: 'column',
        alignItems: 'center',
        marginRight: 30, // 카테고리 아이콘 사이의 간격
       
      },
      categoryText: {
        marginLeft: 10,  // 아이콘과 텍스트 간의 여백
        textAlign:'center',
        marginTop: 10,
        width: '100%',
        marginLeft:0,
      },

      sectionHeader: {
        flexDirection: 'row',      // 가로 정렬
        justifyContent: 'space-between',  // 양 끝 정렬
        alignItems: 'center',      // 수직 중앙 정렬
       
      },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 20, marginBottom: 10, color:"#A1A1A1" },
    
    viewAllButton: { fontSize: 16, marginLeft:'auto',fontWeight: 'bold' },

    listItem: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#ddd' },
    listTitle: { fontSize: 16, fontWeight: 'bold', color:theme.grey},
    listInfo: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 },
    listDate: { color: '#888' },
    likesContainer: { flexDirection: 'row', alignItems: 'center', marginLeft:'auto',justifyContent:'center'},
    likesText: { marginLeft: 5, color: '#888' },

  });


const categories=[
    { id: '1', name: '취미', image:require("../../assets/icons/categoriHobby.png") }, 
    { id: '2', name: '운동', image:require("../../assets/icons/categoriExercise.png")}, 
    { id: '3', name: '또래', image:require("../../assets/icons/categoriFriend.png") }, 
    { id: '4', name: '공부', image:require("../../assets/icons/categoriStudy.png") }, 
    { id: '5', name: '음악', image:require("../../assets/icons/categoriMusic.png") },
    { id: '6', name: '게임', image:require("../../assets/icons/categoriGame.png") },  
  ];
// 더미 데이터
const latestMeetings = [
  { id: '1', title: '함께 뜨개질해요!', date: '2025.02.17', likes: 7 },
  { id: '2', title: '퇴근 후 한강 러닝 크루 모집', date: '2025.02.11', likes: 5 },
  { id: '3', title: '볼링 동호회 회원 모집', date: '2025.01.25', likes: 13 },
  { id: '4', title: '테니스 동호회 회원 모집', date: '2025.01.20', likes: 15 },
  { id: '5', title: '주말에 배드민턴 쳐요', date: '2025.01.20', likes: 10 },

];

const popularMeetings = [
  { id: '6', title: '돈까스 맛집 탐방', date: '2025.01.20', likes: 20 },
  { id: "7", title: "소믈리에 와인 모임", date: "2025.02.12", likes: 15 },
  { id: "8", title: "주말 캠핑 동호회", date: "2025.01.28", likes: 10 },
  { id: "9", title: "주말 요가 클래스", date: "2025.01.30", likes: 13 },
  { id: "10", title: "프랑스어 스터디", date: "2025.02.01", likes: 6 },
];



// 게시글 목록 컴포넌트
const PostList = ({ data }) => (
  <FlatList
    data={data}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => (
      <TouchableOpacity style={styles.listItem}>
        <Text style={styles.listTitle}>{item.title}</Text>
        <View style={styles.listInfo}>
          <Text style={styles.listDate}>{item.date}</Text>
          <View style={styles.likesContainer}>
            <Feather name="heart" size={16} color="#888" />
            <Text style={styles.likesText}>{item.likes}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )}
  />
);


  return (
    <View style={styles.container}>
        <LogoContainer>
            <Logo width={130} height={30} />
        </LogoContainer>
      
      {/* 검색창 */}
      <View style={styles.searchContainer}>
        <TextInput style={styles.searchInput} placeholder="검색" />
        <Feather name="search" size={26} color="#888" style={styles.searchIcon} />
      </View>

        {/* 카테고리 (Flaticon 기반 아이콘 적용) */}
        <FlatList data={categories}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryContainer}
          renderItem={({ item }) => (
          <TouchableOpacity style={styles.categoryItem}>
            <Image source={item.image} style={{width:35,height:35}} resizeMode='contain'/>
            <Text style={styles.categoryText}>{item.name}</Text>
          </TouchableOpacity>
  )}
        />

      {/* 최신 모임 */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>최신 모임</Text>
        <TouchableOpacity onPress={()=>navigation.navigate("AllPosts",{meetings: latestMeetings || []})}>
          <Text style={styles.viewAllButton}>{`전체글 >`}</Text>
        </TouchableOpacity>
      </View>
      <PostList data={latestMeetings.slice(0,3)} />
      
      {/* 주간 인기 소모임 */}
      <Text style={styles.sectionTitle}>주간 인기 소모임</Text>
      <PostList data={[...popularMeetings].sort((a, b) => b.likes - a.likes).slice(0, 3)} /> 
    </View>
  );
};


export default MainPage;