import { FlatList, StyleSheet, View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { hp, wp } from '../../helpers/common'
import { theme } from '../../constants/theme'
import { useRouter } from 'expo-router'
import Navigator from '../../components/Navigator'
import { fetchPosts } from '../../services/postService'
import PostCard from '../../components/PostCard'
import Loading from '../../components/Loading'

var limit = 0;
const Home = () => {

  const {user, setAuth} = useAuth();
  const router = useRouter();

  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const handlePostEvent = async (payload)=>{
    if(payload.eventType == 'INSERT' && payload?.new?.id){
      let newPost = {...payload.new};
      let res = await getUserData(newPost.userId);
      newPost.postLikes = [];
      newPost.comments = [{count: 0}];
      newPost.user = res.success? res.data:{};
      setPosts(prevPosts=> [newPost, ...prevPosts]);
    }
    if(payload.eventType=="DELETE" && payload.old.id){
      setPosts(prevPosts=> {
        let updatedPosts = prevPosts.filter(post=>post.id!=payload.old.id);
        return updatedPosts;
      })
    }
    if(payload.eventType=="UPDATE" && payload?.new?.id){
      setPosts(prevPosts=>{
        let updatedPosts = prevPosts.map(post=>{
          if(post.id==payload.new.id){
            post.body = payload.new.body;
            post.file = payload.new.file;
          }
          return post;
        });
        return updatedPosts;
      });
    }
  }

  useEffect(() =>{

    let postChannel = supabase
    .channel('posts')
    .on('postgres_changes', {event: '*', schema: 'public', table: 'posts'}, handlePostEvent)
    .subscribe();
    
    // getPosts();
    
    // let notificationChannel = supabase
    // .channel('notifications')
    // .on('postgres_changes', {event: 'INSERT', schema: 'public', table: 'notifications', filtler: `receiver=eq.${user.id}`}, handleNewNotification)
    // .subscribe();
    
    return ()=>{
      supabase.removeChannel(postChannel);
      // supabase.removeChannel(notificationChannel);
    }
  }, [])

  const getPosts = async ()=>{
    //call the api here

    if(!hasMore) return null;
    limit = limit + 10;
    let res = await fetchPosts(limit);
    if(res.success){
      if(posts.length==res.data.length) setHasMore(false);
      setPosts(res.data);
    }
  }

  console.log('user: ', user);

  return (
    <View style={{flex: 1}}>
      <ScreenWrapper bg="white">
        {/* posts */}
        <FlatList
          data={posts}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listStyle}
          keyExtractor={item=> item.id.toString()}
          renderItem={({item}) => <PostCard
              item={item}
              currentUser={user}
              router={router}
            />
          }
          onEndReached={()=>{
            getPosts();
          }}
          onEndReachedThreshold={0}
          ListFooterComponent={hasMore?(
            <View style={{marginVertical: posts.length==0? 200 : 30}}>
              <Loading />
            </View>
          ):(
            <View style={{marginVertical: 30}}>
              <Text style={styles.noPost}>Não há mais publicações</Text>
            </View>
          )}
        />

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
})