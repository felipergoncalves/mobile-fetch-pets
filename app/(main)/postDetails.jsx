import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { createComment, fetchPostDetails, removeComment, removePost } from '../../services/postService';
import { createNotification } from '../../services/notificationsService';
import { theme } from '../../constants/theme';
import { hp, wp } from '../../helpers/common';
import Input from '../../components/Input';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../../components/Loading';
import Icon from '../../assets/icons';
import CommentItem from '../../components/CommentItem';
import { getUserData } from '../../services/userService';
import PostCardDetails from '../../components/PostCardDetails';

const PostDetails = () => {
    const {postId, commentId} = useLocalSearchParams();
    const [post, setPost] = useState(null);
    const {user} = useAuth();
    const router = useRouter();
    const [startLoading, setStartLoading] = useState(true);
    const inputRef = useRef();
    const commentRef = useRef('');
    const [loading, setLoading] = useState(false);

    // const handleNewComment = async (payload) => {
    //   console.log("Novo comentário", payload.new)
    //   if(payload.new){
    //     let newComment = {...payload.new};
    //     let res = await getUserData(newComment.userId);
    //     newComment.user = res.success? res.data: {};
    //     setPost(prevPost=>{
    //       return {
    //         ...prevPost,
    //         comments: [newComment, ...prevPost.comments]
    //       }
    //     })
    //   }
    // }

    useEffect(() => {
        // Carregar posts ao iniciar a página
        getPostDetails();
        // console.log("Todos os posts: ", posts);
      }, []);

    const getPostDetails = async ()=> {
        //fetch post details here
        let res = await fetchPostDetails(postId);
        if(res.success) setPost(res.result);
        setStartLoading(false);
    }
    
    // const onNewComment = async() => {
    //   if(!commentRef.current) return null;
    //   let data = {
    //     userId: user?.id,
    //     postId: post?.id,
    //     text: commentRef.current
    //   }
    //   //create comment
    //   setLoading(true);
    //   let res = await createComment(data);
    //   setLoading(false);
    //   if(res.success){
    //     if(user.id != post.userId){
    //       //send notification
    //       let notify = {
    //         senderId: user.id,
    //         receiverId: post.userId,
    //         title: "comentou na sua publicação",
    //         data: JSON.stringify({postId: post.id, commentId: res?.data?.id})
    //       }
    //       createNotification(notify);
    //     }
    //     inputRef?.current?.clear();
    //     commentRef.current = "";
    //   }else{
    //     Alert.alert("Comentário", res.msg);
    //   }
    // }

    // const onDeleteComment = async (comment)=>{
    //   let res = await removeComment(comment?.id);
    //   if(res.success){
    //     setPost(prevPost => {
    //       let updatedPost = {...prevPost};
    //       updatedPost.comments = updatedPost.comments.filter(c=> c.id != comment.id);
    //       return updatedPost;
    //     })
    //   }else{
    //     Alert.alert('Comentário', res.msg)
    //   }
    // }

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
      router.push({pathname: 'newPost', params: {...item}});
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

        
        {/* <View style={styles.inputContainer}>
          <Input
            inputRef={inputRef}
            placeholder="Escreva um comentário..."
            onChangeText={value=>commentRef.current = value}
            placeholderTextColor={theme.colors.textLight}
            containerStyle={{flex: 1, height: hp(6.2), borderRadius: theme.radius.xl}}
          />

          {
            loading?(
                <View>
                  <Loading size='small' />
                </View>
            ):(
              <TouchableOpacity style={styles.sendIcon} onPress={onNewComment}>
               <Icon name="send" color={theme.colors.primaryDark} />
              </TouchableOpacity>
            )
          }
        </View>

        
        <View style={{marginVertical: 15, gap: 17}}>
          {
            post?.comments?.map(comment=>
              <CommentItem
                key={comment?.id?.toString()}
                item={comment}
                onDelete={onDeleteComment}
                highlight = {comment.id == commentId}
                canDelete = {user.id == comment.userId || user.id == post.userId}
              />
            )
          }
          {
            post?.comments?.length == 0 && (
              <Text style={{color: theme.colors.text, marginLeft: 5}}>
                Seja o primeiro a comentar!
              </Text>
            )
          }
        </View> */}
      {/* </ScrollView> */}
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