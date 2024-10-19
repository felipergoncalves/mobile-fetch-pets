import { StyleSheet, Text, TouchableOpacity, View, Image, Alert} from 'react-native'
import React, { useEffect, useState} from 'react'
import { theme } from '../constants/theme'
import { hp, wp} from '../helpers/common'
import Avatar from './Avatar'
import moment from 'moment'
import Icon from '../assets/icons'
import { getSupabaseFileUrl } from '../services/ImageService'
import { createPostLike, removePostLike } from '../services/postService'

const PostCard = ({
    item,
    currentUser,
    router,
    hasShadow = true,
    showMoreIcon = true,
    showDelete = false,
    onDelete=()=>{},
    onEdit=()=>{},  
}) => {
    const shadowStyles = {
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 1
    }

    const [likes, setLikes] = useState([]);

    useEffect(() => {
        setLikes(item?.postLikes);
    }, [])

    const openPostDetails = ()=>{
        if(!showMoreIcon) return null;
        router.push({pathname: 'postDetails', params:{postId: item?.id}})
    }

    const onLike = async ()=>{
        if(liked){
            //remove like
            let updatedLikes = likes.filter(like=> like.userId!=currentUser?.id)
            setLikes([...updatedLikes])
            let res = await removePostLike(item?.id, currentUser?.id);
            if(!res.success){
                Alert.alert("Publicação", "Houve um problema!");
            }
        }else{
            let data = {
                userId: currentUser?.id,
                postId: item?.id
            }
            setLikes([...likes, data])
            let res = await createPostLike(data);
            if(!res.success){
                Alert.alert("Publicação", "Houve um problema!");
            }
        }
    }

    const handlePostDelete = () => {
        Alert.alert("Confirmar", "Tem certeza que deseja fazer isso?", [
            {
                text: 'Cancelar',
                onPress: ()=> console.log('Modal cancelado'),
                style: 'cancel'
            },
            {
                text: 'Excluir',
                onPress: ()=> onDelete(item),
                style: 'destructive'
            }
            ]
        )
    }

    const createdAt = moment(item?.created_at).format('MMM D');
    const liked = likes.filter(like=> like.userId == currentUser?.id)[0]? true: false;
  return (
    <View style={[styles.container, hasShadow && shadowStyles]}>
      <View style={styles.header}>
        {/* user info and post time */}
        <View style={styles.userInfo}>
            <Avatar
              size={hp(4.5)}
              uri={item?.user?.image}
              rounded={theme.radius.md}
            />
            <View style={{gap: 2}}>
                <Text style={styles.username}>{item?.user?.name}</Text>
                <Text style={styles.postTime}>{createdAt}</Text>
            </View>
        </View>

        {
            showMoreIcon && (
                <TouchableOpacity onPress={openPostDetails}>
                    <Icon name="threeDotsHorizontal" size={hp(3.4)} strokeWidth={3} color={theme.colors.text} />
                </TouchableOpacity>
            )
        }

        {
            showDelete && currentUser.userId == item?.userId && (
                <View style={styles.actions}>
                    <TouchableOpacity onPress={() => onEdit(item)}>
                        <Icon name="edit" size={hp(2.5)} color={theme.colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handlePostDelete}>
                        <Icon name="delete" size={hp(2.5)} color={theme.colors.rose} />
                    </TouchableOpacity>
                </View>
            )
        }
      </View>

      {/* post body and media */}
      <View style={styles.content}>
        <View style={styles.postBody}>
            <Text style={{color: theme.colors.dark, fontSize:hp(1.75)}}>{item?.body}</Text>
        </View>
        
        {/* post image */}
        {
            item?.file && item?.file?.includes('postImages') && (
                <Image
                    source={getSupabaseFileUrl(item?.file)}
                    transition={100}
                    style={styles.postMedia}
                    contentFit='cover'
                />
            )
        }
      </View>

      {/* like, comment */}
      <View style={styles.footer}>
        <View style={styles.footerButton}>
            <TouchableOpacity onPress={onLike}>
                <Icon name="heart" size={24} fill={liked? theme.colors.rose : 'transparent'} color={liked? theme.colors.rose : theme.colors.textLight} />
            </TouchableOpacity>
            <Text style={styles.count}>
                {
                    likes?.length
                }
            </Text>
        </View>
        <View style={styles.footerButton}>
            <TouchableOpacity onPress={openPostDetails}>
                <Icon name="comment" size={24} color={theme.colors.textLight} />
            </TouchableOpacity>
            <Text style={styles.count}>
                {
                    item?.comments[0]?.count
                }
            </Text>
        </View>
      </View>
    </View>
  )
}

export default PostCard

const styles = StyleSheet.create({
    container:{
        gap: 10,
        marginBottom: 15,
        borderRadius: theme.radius.xxl*1.1,
        borderCurve: 'continuous',
        padding: 10,
        paddingVertical: 12,
        backgroundColor: 'white',
        borderWidth: 0.5,
        borderColor: theme.colors.gray,
        shadowColor: '#000'
    },
    header:{
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    userInfo:{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
    username:{
        fontSize: hp(1.7),
        color: theme.colors.textDark,
        fontWeight: theme.fonts.medium
    },
    postTime:{
        fontSize: hp(1.4),
        color: theme.colors.textLight,
        fontWeight: theme.fonts.medium,
    },
    content:{
        gap: 10
    },
    postMedia:{
        height: hp(40),
        width: '100%',
        borderRadius: theme.radius.xl,
        borderCurve: 'continuous'
    },
    postBody:{
        marginLeft: 5,   
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15
    },
    footerButton:{
        marginLeft: 5,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4
    },
    actions:{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4
    },
    actions:{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 18
    },
    count:{
        color: theme.colors.text,
        fontSize: hp(1.8)
    }
})