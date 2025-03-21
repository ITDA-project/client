import React, { useContext } from 'react';
import { Image,View, Text, TextInput, FlatList, TouchableOpacity,ScrollView, StyleSheet } from 'react-native';
import { ThemeContext,styled } from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import Logo from "../../assets/logo.svg";
// ✅ API 요청을 위한 라이브러리 (fetch 대체 가능)
import axios from "axios";


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
    searchInput: { flex: 1, height: 50 },
    searchIcon: { marginLeft: 5 },
  
    categoryContainer: {
        marginTop: 30, // 검색창과 카테고리 간의 간격
        marginBottom: 20, // 카테고리과 모임 목록 간의 간격
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
        color: theme.colors.grey,
        fontFamily: theme.fonts.bold,
      },

      sectionHeader: {
        flexDirection: 'row',      // 가로 정렬
        justifyContent: 'space-between',  // 양 끝 정렬
        alignItems: 'center',      // 수직 중앙 정렬
       
      },
    sectionTitle: { fontSize: 20, fontFamily: theme.fonts.bold, marginTop: 20, marginBottom: 10, color:"#656565" },
    
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
  { id: '1', title: '함께 뜨개질해요!', created_at: '2025.02.17', likes: 7 },
  { id: '2', title: '퇴근 후 한강 러닝 크루 모집', created_at: '2025.02.11', likes: 5 },
  { id: '3', title: '볼링 동호회 회원 모집', created_at: '2025.01.25', likes: 13 },
  { id: '4', title: '테니스 동호회 회원 모집', created_at: '2025.01.20', likes: 15 },
  { id: '5', title: '주말에 배드민턴 쳐요', created_at: '2025.01.20', likes: 10 },
  { id: '6', title: '돈까스 맛집 탐방', created_at: '2025.01.20', likes: 20 },
  { id: "7", title: "소믈리에 와인 모임", created_at: "2025.02.12", likes: 15 },
  { id: "8", title: "주말 캠핑 동호회", created_at: "2025.01.28", likes: 10 },
  { id: "9", title: "주말 요가 클래스", created_at: "2025.01.30", likes: 13 },
  { id: "10", title: "프랑스어 스터디", created_at: "2025.02.01", likes: 6 },
];

/*
 const [meetings, setMeetings] = useState([]); // 🔹 백엔드에서 가져온 데이터를 저장할 상태
  const [loading, setLoading] = useState(true); // 🔹 로딩 상태 추가

  // ✅ 백엔드에서 데이터 가져오기 (GET 요청)
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await axios.get("https://api.example.com/meetings"); // 백엔드 API 주소
        setMeetings(response.data); // 가져온 데이터 저장
      } catch (error) {
        console.error("데이터를 불러오는 중 오류 발생:", error);
      } finally {
        setLoading(false); // 로딩 완료
      }
    };

    fetchMeetings();
  }, []);

*/
const latestMeetings=[...meetings].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
const popularMeetings=[...meetings].sort((a, b) => b.likes - a.likes);

// 게시글 목록 컴포넌트
const PostList = ({ data }) => (
  <View>
    {data.slice(0, 3).map((item) => (
      <TouchableOpacity key={item.id} style={styles.listItem}>
        <Text style={styles.listTitle}>{item.title}</Text>
        <View style={styles.listInfo}>
          <Text style={styles.listDate}>{item.created_at}</Text>
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
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 최신 모임 섹션 */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>최신 모임</Text>
          <TouchableOpacity onPress={() => navigation.navigate("전체글", { meetings: latestMeetings })}>
            <Text style={styles.viewAllButton}>{`전체글 >`}</Text>
          </TouchableOpacity>
        </View>
        <PostList data={latestMeetings} />

      {/* 최신 모임 섹션 */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>최신 모임</Text>
        <TouchableOpacity onPress={() => navigation.navigate("전체글", { meetings: latestMeetings })}>
          <Text style={styles.viewAllButton}>{`전체글 >`}</Text>
        </TouchableOpacity>
      </View>
      <PostList data={latestMeetings} />

      {/* 주간 인기 소모임 섹션 */}
      <Text style={styles.sectionTitle}>주간 인기 소모임</Text>
      <PostList data={popularMeetings} />
    </ScrollView>

    </View>

  );
};


export default MainPage;