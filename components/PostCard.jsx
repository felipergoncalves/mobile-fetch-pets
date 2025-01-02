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

    const petDescriptions = [
        `${item.pet_name} é ${item.sex === 'Fêmea' ? 'uma' : 'um'} ${item.species.toLowerCase()} adorável, que está à procura de um lar cheio de amor e carinho. Com ${item.age} ${item.age > 1 ? 'anos' : 'ano'} de vida e aproximadamente ${item.weight_kg} kg, ${item.sex === 'Fêmea' ? 'ela' : 'ele'} é ${item.sex === 'Fêmea' ? 'a' : 'o'} ${item.sex === 'Fêmea' ? 'ela' : 'ele'} ${item.sex === 'Fêmea' ? 'perfeita' : 'perfeito'} para quem deseja aventuras e momentos felizes.`,
        
        `${item.pet_name} é ${item.sex === 'Fêmea' ? 'uma' : 'um'} ${item.species.toLowerCase()} de ${item.age} ${item.age > 1 ? 'anos' : 'ano'} e aproximadamente ${item.weight_kg} kg. ${item.sex === 'Fêmea' ? 'cheia' : 'cheio'} de energia e amor, ${item.sex === 'Fêmea' ? 'ela' : 'ele'} está pronto(a) para fazer parte de uma nova família e compartilhar momentos de alegria. Será que você seria o(a) ${item.sex === 'Fêmea' ? 'companheira' : 'companheiro'} ideal?`,
        
        `Se você está procurando ${item.sex === 'Fêmea' ? 'uma' : 'um'} ${item.species.toLowerCase()} que seja ${item.sex === 'Fêmea' ? 'carinhosa' : 'carinhoso'} e ${item.sex === 'Fêmea' ? 'cheia' : 'cheio'} de energia, ${item.pet_name} pode ser a escolha perfeita. Com ${item.age} ${item.age > 1 ? 'anos' : 'ano'} de vida e um peso de ${item.weight_kg} kg, ${item.sex === 'Fêmea' ? 'ela' : 'ele'} vai adorar ser parte da sua família.`,
        
        `Conheça ${item.pet_name}, ${item.sex === 'Fêmea' ? 'uma' : 'um'} ${item.species.toLowerCase()} ${item.sex === 'Fêmea' ? 'encatandora' : 'encantador'} que está em busca de um lar. Com ${item.age} ${item.age > 1 ? 'anos' : 'ano'} e cerca de ${item.weight_kg} kg, ${item.sex === 'Fêmea' ? 'ela' : 'ele'} é ${item.sex === 'Fêmea' ? 'cheia' : 'cheio'} de carinho e amor para oferecer. Quem será o sortudo(a) que vai ${item.sex === 'Fêmea' ? 'adotá-la' : 'adotá-lo'}?`,
        
        `${item.pet_name} é o tipo de ${item.species.toLowerCase()} que vai conquistar seu coração. Com ${item.age} ${item.age > 1 ? 'anos' : 'ano'} e aproximadamente ${item.weight_kg} kg, ${item.sex === 'Fêmea' ? 'ela' : 'ele'} está em busca de uma nova família para dividir muitos momentos de alegria e carinho. Não perca a chance de ${item.sex === 'Fêmea' ? 'adotá-la' : 'adotá-lo'}!`
      ];

    useEffect(() => {
        setLikes(item?.postLikes);
        getUsers();
    }, [])

    const getRandomDescription = () => {
        const randomIndex = Math.floor(Math.random() * petDescriptions.length);
        return petDescriptions[randomIndex];
    };

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
    
  return (
    <View style={[styles.container, hasShadow && shadowStyles]}>
      <View style={styles.header}>
        {/* user info and post time */}
        <View style={styles.userInfo}>
            <Avatar
              size={hp(4.5)}
              uri={user?.image}
              rounded={theme.radius.md}
            />
            <View style={{gap: 2}}>
                <Text style={styles.username}>{user?.name}</Text>
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
          {getRandomDescription()}
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