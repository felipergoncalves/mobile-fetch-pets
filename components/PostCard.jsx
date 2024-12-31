import { StyleSheet, Text, TouchableOpacity, View, Image, Alert} from 'react-native'
import React, { useEffect, useState} from 'react'
import { theme } from '../constants/theme'
import { hp} from '../helpers/common'
import Avatar from './Avatar'
import moment from 'moment'
import Icon from '../assets/icons'
import { createPostLike, removePostLike } from '../services/postService'
import { getUserData } from '../services/userService'

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
    const [user, setUser] = useState({});

    useEffect(() => {
        setLikes(item?.postLikes);
        getUsers();
    }, [])

    const getUsers = async() => {
        try{
            const res = await getUserData(item?.userId);
            if (res.success) {
                setUser(res.result);
            }
        }catch(err){
            console.error(err);
        }
    }

    const openPostDetails = ()=>{
        if(!showMoreIcon) return null;
        console.log("Usuário atuall: ", currentUser);
        router.push({pathname: 'postDetails', params:{postId: item?.id, currentUser: currentUser}})
    }

    const onLike = async ()=>{
        if(liked){
            //remove like
            // let updatedLikes = likes.filter(like=> like.userId!=currentUser?.id)
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
    // const liked = likes.filter(like=> like.userId == currentUser?.id)[0]? true: false;
    const [showFullText, setShowFullText] = useState(false);

    const fullText = `${item?.pet_name} é ${item?.sex === 'Fêmea' ? 'uma' : 'um'} ${item?.species?.toLowerCase()} adorável, com ${item?.age} ${item?.age > 1 ? 'anos' : 'ano'} de vida. Com um peso de aproximadamente ${item?.weight_kg} kg, ${item?.sex === 'Fêmea' ? 'ela' : 'ele'} é ${item?.age > 1 ? `${item?.sex === 'Fêmea' ? 'uma companheira' : 'um companheiro'}` : 'uma companhia'} cheio(a) de energia e carinho. Sempre pront${item?.sex === 'Fêmea' ? 'a' : 'o'} para novas aventuras, ${item?.pet_name} está à procura de um lar onde possa compartilhar momentos de alegria e amor.`;

  return (
    <View style={[styles.container, hasShadow && shadowStyles]}>
      <View style={styles.header}>
        {/* user info and post time */}
        <View style={styles.userInfo}>
            <Avatar
              size={hp(4.5)}
              uri={user.image}
              rounded={theme.radius.md}
            />
            <View style={{gap: 2}}>
                <Text style={styles.username}>{user.name}</Text>
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
        
        {/* post image */}
        {
            <Image
            source={{uri: `${item?.image}`}}
            transition={100}
            style={styles.postMedia}
            contentFit='cover'
            />
            // item?.file && item?.file?.includes('postImages') && (
            //     <Image
            //         source={getSupabaseFileUrl(item?.image)}
            //         transition={100}
            //         style={styles.postMedia}
            //         contentFit='cover'
            //     />
            // )
        }
      </View>

      {/* like, comment */}
      <View style={styles.footer}>
      </View>
      <TouchableOpacity onPress={openPostDetails}>
      <View style={{position: "relative"}}>
      <View style={!showFullText ? styles.textContainer : null}>
        <Text style={{ fontSize: 14, color: theme.colors.text }} numberOfLines={showFullText ? undefined : 3}>
          {fullText}
        </Text>
      </View>
      {!showFullText && (
        <View style={styles.fadeOut}>
          <TouchableOpacity onPress={openPostDetails}>
            <Text style={{ fontSize: 14, color: theme.colors.primary }}>Ver mais</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
    </TouchableOpacity>
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
    textContainer: {
        height: 45, // Ajuste a altura conforme necessário para cortar as linhas
        overflow: 'hidden',
    },
    fadeOut: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        paddingVertical: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.7)', // Ajuste para o fade-out
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