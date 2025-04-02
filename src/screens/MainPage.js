import React, { useContext } from 'react';
import { Image,View, Text, TextInput, FlatList, TouchableOpacity,ScrollView, StyleSheet, SafeAreaView } from 'react-native';
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
    title: { fontSize: 30, fontFamily: theme.fonts.bold, textAlign: 'center', marginBottom: 20 },
  
    searchContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderRadius: 10, paddingHorizontal: 10, borderColor: theme.colors.mainBlue},
    searchInput: { flex: 1, height: 60 },
    searchIcon: { marginLeft: 5 },
  
    categoryContainer: {
        marginTop: 40, // 검색창과 카테고리 간의 간격
        marginBottom: 20, // 카테고리과 모임 목록 간의 간격
        flexDirection: 'row',
        justifyContent: 'space-between', // 아이콘 사이에 공간을 자동으로 분배
        paddingHorizontal: 10,
      },
      categoryItem: {
        flexDirection: 'column',
        alignItems: 'center',
        marginRight: 30, // 카테고리 아이콘 사이의 간격
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
       
      },
      categoryText: {
        marginLeft: 10,  // 아이콘과 텍스트 간의 여백
        textAlign:'center',
        marginTop: 10,
        width: '100%',
        marginLeft:0,
        fontSize:14,
        color: theme.colors.grey,
        fontFamily: theme.fonts.bold,
      },

      sectionHeader: {
        flexDirection: 'row',      // 가로 정렬
        justifyContent: 'space-between',  // 양 끝 정렬
        alignItems: 'center',      // 수직 중앙 정렬
      },
    sectionTitle: { fontSize: 20, fontFamily: theme.fonts.bold, marginTop: 25, marginBottom: 10, color:"#656565" },
    
    viewAllButton: { fontSize: 16, marginLeft:'auto',fontFamily: theme.fonts.bold},


    listItem: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#ddd' },
    listTitle: { fontSize: 16, fontFamily: theme.fonts.extraBold, color:theme.grey},
    listInfo: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
    listDate: { color: '#888',fontFamily: theme.fonts.regular },
    likesContainer: { flexDirection: 'row', alignItems: 'center', marginLeft:'auto',justifyContent:'center'},
    likesText: { marginLeft: 5, color: "#979C9E", fontFamily: theme.fonts.bold },


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
const meetings = [
  { userId:1,postId: '1', title: '함께 뜨개질해요!', createdAt: '2025.02.17', likes: 7 },
  { userId:2,postId: '2', title: '퇴근 후 한강 러닝 크루 모집', createdAt: '2025.02.11', likes: 5 },
  { userId:3,postId: '3', title: '볼링 동호회 회원 모집', createdAt: '2025.01.25', likes: 13 },
  { userId:4,postId: '4', title: '테니스 동호회 회원 모집', createdAt: '2025.01.20', likes: 15 },
  {userId:5, postId: '5', title: '주말에 배드민턴 쳐요', createdAt: '2025.01.20', likes: 10 },
  { userId:1,postId: '6', title: '돈까스 맛집 탐방', createdAt: '2025.01.20', likes: 20 },
  { userId:6,postId: "7", title: "소믈리에 와인 모임", createdAt: "2025.02.12", likes: 15 },
  { userId:1,postId: "8", title: "주말 캠핑 동호회", createdAt: "2025.01.28", likes: 10 },
  {userId:2, postId: "9", title: "주말 요가 클래스", createdAt: "2025.01.30", likes: 13 },
  { userId:1,postId: "10", title: "프랑스어 스터디", createdAt: "2025.02.01", likes: 6 },
];

const latestMeetings=[...meetings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
const popularMeetings=[...meetings].sort((a, b) => b.likes - a.likes);

const currentUser = { userId: 1 }; // 로그인한 사용자 ID

  // 게시글 목록 컴포넌트
  const PostList = ({ data }) => (
    <View>
      {data.slice(0, 3).map((item) => (
        <TouchableOpacity
          key={item.postId}
          style={styles.listItem}
          onPress={() => {
            if (item.userId === currentUser.userId) {
              navigation.navigate("MyPostDetail", { postId: item.postId, title: item.title, created_at: item.createdAt, likes:item.likes });
            } else {
              navigation.navigate("PostDetail", { postId: item.postId, title: item.title, created_at: item.createdAt, likes:item.likes });
            }
          }}
        >
          <Text style={styles.listTitle}>{item.title}</Text>
          <View style={styles.listInfo}>
            <Text style={styles.listDate}>{item.createdAt}</Text>
            <View style={styles.likesContainer}>
              <Feather name="heart" size={16} color="#979C9E" />
              <Text style={styles.likesText}>{item.likes}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
  
  
    return (
  
      <View style={styles.container} contentContainerStyle={{paddingBottom:100}}>
          <LogoContainer>
              <Logo width={130} height={30} />
          </LogoContainer>
        
  
  
        {/* 검색창 */}
        <TouchableOpacity onPress={() => navigation.navigate("Search")}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="검색"
              editable={false} // 직접 입력은 막고
              pointerEvents="none" // 터치 이벤트도 무시해서 TouchableOpacity에서만 처리되도록 함
            />
            <Feather
              name="search"
              size={26}
              color={theme.colors.mainBlue}
              style={styles.searchIcon}
            />
          </View>
        </TouchableOpacity>
          
  
  
          {/* 카테고리 (Flaticon 기반 아이콘 적용) */}
          <FlatList data={categories}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={true}
            contentContainerStyle={styles.categoryContainer}
            renderItem={({ item }) => (
  
            <TouchableOpacity 
            style={styles.categoryItem}
            onPress={()=>navigation.navigate("전체글",{meetings,categories:item.name})}>
              <Image source={item.image} style={{width:35,height:35}} resizeMode='contain'/>
              <Text style={styles.categoryText}>{item.name}</Text>
            </TouchableOpacity>
    )}
          />
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* 최신 모임 섹션 */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>최신 모임</Text>
            <TouchableOpacity onPress={() => navigation.navigate("전체글", { meetings: latestMeetings  })}>
              <Text style={styles.viewAllButton}>{`전체글 >`}</Text>
            </TouchableOpacity>
          </View>
          <PostList data={latestMeetings} />
  
          {/* 주간 인기 소모임 섹션 */}
          <Text style={styles.sectionTitle}>주간 TOP3 모임</Text>
          <PostList data={popularMeetings} />
        </ScrollView>
        
      </View>
  
    );
  };
export default MainPage;
