import { FlatList, StyleSheet, View, Text, Image, Pressable, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import { useAuth } from '../../contexts/AuthContext'
import { hp, wp } from '../../helpers/common'
import { theme } from '../../constants/theme'
import { useRouter } from 'expo-router'
import Navigator from '../../components/Navigator'
import { fetchPosts } from '../../services/postService'
import PostCard from '../../components/PostCard'
import Loading from '../../components/Loading'
import Icon from '../../assets/icons'
import { getUserData } from '../../services/userService'

var limit = 10;
const Home = () => {

  const {user, setAuth} = useAuth();
  const router = useRouter();

  const [posts, setPosts] = useState([]);
  // const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [notificationCount, setNotificationCount] = useState(0);
  const [filter, setFilter] = useState(null);

  useEffect(() => {
    // Carregar posts ao iniciar a página
    getPosts();
  }, []);

  const getPosts = async (species = null) => {
    if (!isLoading) setIsLoading(true);
    if(species !== null && species === filter){
      species = null;
    }

   try{
    const res = await fetchPosts(limit, species);
    if (res.success) {
      setPosts(res.data);
      // setHasMore(res.data.length === limit);
      setFilter(species);
    }
   }catch(err){
    console.error(err);
   }finally{
    setIsLoading(false);
   }
  };

  // const handleFilterChange = (newFilter) => {
  //   // setFilter(newFilter);
  //   // setHasMore(true)
  //   getPosts(newFilter); // Carrega posts com o novo filtro
  // };

  // const getPosts = async (species=null)=>{
  //   //call the api here

  //   if(!hasMore) return null;
  //   limit = limit + 10;
  //   let res = await fetchPosts(limit, species);
  //   if(res.success){
  //     if(posts.length==res.data.length) setHasMore(false);
  //     setPosts(res.data);
  //   }
  // }

  // console.log('user: ', user);
  
  return (
    <View style={{flex: 1}}>
      <ScreenWrapper bg="white">
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          {/* posts */}
          <View style={styles.header}>
              <Image style={{ height: hp(8), width: "50%", alignSelf: "start", zIndex: 3}} resizeMode='contain' source={require('../../assets/images/logo.png')} />
            {/* <View style={styles.headerActions}>
              <View style={styles.headerActionsBackground}>
                <Pressable onPress={() => {
                  setNotificationCount(0);
                  router.push('notifications');
                }}>
                  <Icon name="notification" strokeWidth={2} color={theme.colors.text}/>
                  {
                    notificationCount > 0 && (
                      <View style={styles.pill}>
                        <Text style={styles.pillText}>{notificationCount}</Text>
                      </View>
                    )
                  }
                </Pressable>
              </View>
            </View> */}
          </View>
          <View style={styles.homeBanner}>
            <Image style={{ height: hp(18), width: "100%", alignSelf: "center", zIndex: 3}} resizeMode='contain' source={require('../../assets/images/home-banner.png')} />
          </View>
          <View style={{width: "100%", padding: hp(2), paddingBottom: 0, gap: 8}}>
            <Text style={styles.category}>Categorias</Text>
            <View style={styles.filterSection}>
              <Pressable disabled={isLoading} onPress={() => {}} style={styles.filterAction}>
                  <Icon name="filterHorizontalIcon" strokeWidth={2} color={theme.colors.text}/>
              </Pressable>
              <Pressable disabled={isLoading } onPress={() => getPosts('Cachorro')} style={[styles.filterAction, {backgroundColor: filter === "Cachorro" ? "#64ADEF" : styles.filterAction.backgroundColor}]}>
                <Image style={{ height: hp(5), width: "100%", alignSelf: "contain", zIndex: 3}} resizeMode='center' source={require('../../assets/images/dogFilter.png')}/>
              </Pressable>
              <Pressable disabled={isLoading } onPress={() => getPosts('Gato')} style={[styles.filterAction,  {backgroundColor: filter === "Gato" ? "#64ADEF" : styles.filterAction.backgroundColor}]}>
                <Image style={{ height: hp(5), width: "100%", alignSelf: "contain", zIndex: 3}} resizeMode='center' source={require('../../assets/images/catFilter.png')}/>
              </Pressable>
            </View>
          </View>
          <FlatList
            data={posts}
            scrollEnabled={false}
            refreshing={isLoading}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listStyle}
            keyExtractor={item=> item.id.toString()}
            renderItem={({item}) => <PostCard
                item={item}
                currentUser={user}
                router={router}
              />
            }
            // onEndReached={()=>{
            //   getPosts();
            // }} // TODO:fix this call while filter list is empty
            onEndReachedThreshold={0}
            ListFooterComponent={isLoading?(
              <View style={{marginVertical: posts.length==0? 200 : 30}}>
                <Loading />
              </View>
            ):(
              <View style={{marginVertical: 30}}>
                <Text style={styles.noPosts}>Não há mais publicações</Text>
              </View>
            )}
          />
          </ScrollView>
      </ScreenWrapper>
      <Navigator user={user}/>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  container:{
    flex: 1,
  },
  header:{
    paddingTop: hp(1),
    paddingHorizontal: hp(2),
    width: "100%",
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  headerActions:{
    alignItems: "center",
    flexDirection: 'row',
    gap: 10
  },
  headerActionsBackground:{
    backgroundColor: 'rgba(0,0,0,0.07)',
    padding: hp(1.2),
    borderRadius: theme.radius.xs,
    height: "50px",
  },
  homeBanner:{
    height: "139px",
    maxWidth: "100px",
    backgroundColor: "white",
    paddingTop: hp(1)
  },
  filterSection:{
    flexDirection: 'row',
    width: "100%",
    gap: 10,
    paddingVertical: hp(2)
  },
  category:{
    fontWeight: theme.fonts.semibold,
    fontSize: hp(2.3)
  },
  filterAction:{
    padding: hp(1),
    alignItems: 'center',
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: 'rgba(0,0,0,0.07)',
    borderRadius: theme.radius.xs,
    width: "18%",
    height: "100%"
  },
  title:{
    color: theme.colors.text,
    fontSize: hp(3.2),
    fontWeight: theme.fonts.bold,
  },
  avatarImage:{
    height: hp(4.3),
    width: hp(4.3),
    borderRadius: theme.radius.sm,
    borderCurve: 'continuous',
    borderColor: theme.colors.gray,
    borderWidth: 3
  },
  
  listStyle:{
    paddingTop: 20,
    paddingHorizontal: wp(4)
  },
  noPosts:{
    fontSize: hp(2),
    textAlign: "center",
    color: theme.colors.text
  },
  pill:{
    position: 'absolute',
    right: -10,
    top: -4,
    height: hp(2.2),
    width: hp(2.2),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: theme.colors.roseLight
  },
  pillText:{
    color: "white",
    fontSize: hp(1.2),
    fontWeight: theme.fonts.bold
  }
})