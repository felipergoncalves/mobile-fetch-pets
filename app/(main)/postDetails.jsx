import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import Loading from '../../components/Loading';
import PostCardDetails from '../../components/PostCardDetails';
import { theme } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';
import { hp, wp } from '../../helpers/common';
import { fetchPostDetails, removePost } from '../../services/postService';

const PostDetails = () => {
    const {postId, commentId} = useLocalSearchParams();
    const [post, setPost] = useState(null);
    const {user} = useAuth();
    const router = useRouter();
    const [startLoading, setStartLoading] = useState(true);
    const inputRef = useRef();
    const commentRef = useRef('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Carregar posts ao iniciar a página
        getPostDetails();
      }, []);

    const getPostDetails = async ()=> {
        //fetch post details here
        let res = await fetchPostDetails(postId);
        if(res.success) setPost(res.result);
        setStartLoading(false);
    }
    

    const onDeletePost = async (item) => {
      //delete post here
      let res = await removePost(post.id);
      if(res.success){
        router.push('/home');
      } else{
        Alert.alert('Publicação', res.msg)
      }
    }

    const onEditPost = async (item) => {
      router.back();
      router.push({pathname: 'newPost', params: {post: JSON.stringify(item)}});
    }

    if(startLoading){
      return(
        <View style={styles.center}>
          <Loading />
        </View>
      )
    }

    if(!post){
      return(
        <View style={[styles.center, {justifyContent: "flex-start", marginTop: 100}]}>
          <Text style={styles.notFound}>Publicação não encontrada!</Text>
        </View>
      )
    }
  return (
    <View style={styles.container}>
      {/* <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}> */}
        <PostCardDetails
          item={{...post, comments: [{count: post?.comments?.length}]}}
          currentUser={user}
          router={router}
          hasShadow={false}
          showMoreIcon={false}
          showDelete={true}
          onDelete={onDeletePost}
          onEdit={onEditPost}
        />
    </View>
  )
}

export default PostDetails

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: wp(7),
    border: 'none'
  },
  inputContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  list:{
    // paddingHorizontal: wp(4)
  },
  sendIcon:{
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.8,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    borderCurve: 'continuous',
    height: hp(5.8),
    width: hp(5.8)
  },
  center:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  notFound:{
    fontSize: hp(2.5),
    color: theme.colors.text,
    fontWeight: theme.fonts.medium,
  },
  loading:{
    height: hp(5.8),
    width: hp(5.8),
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{scale: 1.3}]
  }
})