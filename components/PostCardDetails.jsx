import { StyleSheet, Text, TouchableOpacity, View, Image, Alert} from 'react-native'
import React, { useEffect, useState} from 'react'
import { theme } from '../constants/theme'
import { hp, wp} from '../helpers/common'
import Avatar from './Avatar'
import moment from 'moment'
import Icon from '../assets/icons'
import { getSupabaseFileUrl } from '../services/ImageService'
import { createPostLike, removePostLike } from '../services/postService'
import Header from './Header'
import BackButton from './BackButton'
import Button from './Button'
import { color } from '@rneui/themed/dist/config'

const PostCardDetails = ({
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

    // const openPostDetails = ()=>{
    //     if(!showMoreIcon) return null;
    //     router.push({pathname: 'postDetails', params:{postId: item?.id}})
    // }

    const confirmFavorite = () => {
        Alert.alert(
          liked ? "Remover dos Favoritos" : "Adicionar aos Favoritos",
          liked
            ? "Tem certeza que deseja remover este pet dos seus favoritos?"
            : "Tem certeza que deseja adicionar este pet aos seus favoritos?",
          [
            {
              text: "Cancelar",
              style: "cancel",
            },
            {
              text: "Sim",
              onPress: onLike, // Chama a função onLike se o usuário confirmar
            },
          ]
        );
      };

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

    const confirmDelete = () => {
        Alert.alert(
          "Excluir Pet","Tem certeza que deseja remover essa publicação?",
          [
            {
              text: "Cancelar",
              style: "cancel",
            },
            {
              text: "Sim",
              onPress: handlePostDelete, // Chama a função handlePostDelete se o usuário confirmar
            },
          ]
        );
      };

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
    <View style={[styles.container, hasShadow && shadowStyles, {}]}>
      {/* post body and media */}
      <View style={styles.content}>
        <View style={{position:"absolute", zIndex: 2, paddingVertical: 2, paddingHorizontal: 10, justifyContent: "space-between", flexDirection: 'row', width: "100%", backgroundColor: "rgba(255,255,255,.5)"}}>
            <Header style={{color: "#ffffff"}}/>
            {/* {
            showMoreIcon && (
                <TouchableOpacity onPress={openPostDetails}>
                    <Icon name="threeDotsHorizontal" size={hp(3.4)} strokeWidth={3} color={theme.colors.text} />
                </TouchableOpacity>
            )
            } */}

            {
                showDelete && currentUser.id == item?.userId && (
                    <View style={styles.actions}>
                        <TouchableOpacity onPress={() => onEdit(item)}>
                            <Icon name="edit" size={hp(2.5)} color={theme.colors.text} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={confirmDelete}>
                            <Icon name="delete" size={hp(2.5)} color={theme.colors.rose} />
                        </TouchableOpacity>
                    </View>
                )
            }
        </View>
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
        <View style={{flexDirection:"row", justifyContent: "space-between", width:"100%", paddingHorizontal: hp(2)}}>
            <View style={styles.petInfo}>
                <Text style={styles.petName}>{item.pet_name}</Text>
            </View>
            <View style={styles.footerButton}>
                <TouchableOpacity style={styles.likePost} onPress={confirmFavorite}>
                    <Icon name="heart" size={24} fill={liked? theme.colors.rose : 'transparent'} color={liked? theme.colors.rose : theme.colors.textLight} />
                </TouchableOpacity>
                {/* <Text style={styles.count}>
                    {
                        likes?.length
                    }
                </Text> */}
            </View>
        </View>
        <View style={{flexDirection: "row", width: "100%", zIndex: 5, justifyContent: "center", gap: 20}}>
            <View style={{ backgroundColor: "#E2F5CB", width: "25%", borderRadius: theme.radius.xl, position: 'relative', justifyContent: 'center', alignItems: 'center' }}>
                <Image
                    style={{ height: hp(10), width: "100%" }}
                    resizeMode='contain'
                    source={require("../assets/images/petSex.png")}
                />
                {/* Contêiner para os dois textos, posicionados no centro da imagem */}
                <View style={{ position: 'absolute', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: '#000', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>
                    {item.sex}
                    </Text>
                    <Text style={{ color: '#000', fontSize: 14, textAlign: 'center' }}>
                    Sexo
                    </Text>
                </View>
            </View>
            <View style={{ backgroundColor: "#FFE9C2", width: "25%", borderRadius: theme.radius.xl, position: 'relative', justifyContent: 'center', alignItems: 'center' }}>
                <Image
                    style={{ height: hp(10), width: "100%" }}
                    resizeMode='contain'
                    source={require("../assets/images/petAge.png")}
                />
                {/* Contêiner para os dois textos, posicionados no centro da imagem */}
                <View style={{ position: 'absolute', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: '#000', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>
                    {item.age}
                    </Text>
                    <Text style={{ color: '#000', fontSize: 14, textAlign: 'center' }}>
                    Idade
                    </Text>
                </View>
            </View>
            <View style={{ backgroundColor: "#C2EBFF", width: "25%", borderRadius: theme.radius.xl, position: 'relative', justifyContent: 'center', alignItems: 'center' }}>
                <Image
                    style={{ height: hp(10), width: "100%" }}
                    resizeMode='contain'
                    source={require("../assets/images/petWeight.png")}
                />
                {/* Contêiner para os dois textos, posicionados no centro da imagem */}
                <View style={{ position: 'absolute', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: '#000', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>
                    {item.weight_kg} KG
                    </Text>
                    <Text style={{ color: '#000', fontSize: 14, textAlign: 'center' }}>
                    Peso
                    </Text>
                </View>
            </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, paddingBottom: 0 }}>
                {/* Imagem à esquerda */}
                <Avatar
                size={hp(4.5)}
                uri={item?.user?.image}
                rounded={theme.radius.md}
                style={{ width: 50, height: 50, marginRight: 10 }}
                />
                {/* <Image
                    source={require("../assets/images/userImage.png")}
                    
                    resizeMode="cover"
                /> */}

                {/* Nome do usuário e descrição */}
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#000' }}>
                    {item?.user?.name}
                    </Text>
                    <Text style={{ fontSize: 14, color: '#555' }}>
                        {item.sex === 'Fêmea' ? `Dono(a) da ${item.pet_name}` : `Dono(a) do ${item.pet_name}`}
                    </Text>
                </View>

                {/* Ícone de chat à direita */}
                <TouchableOpacity onPress={() => {}}>
                    <Icon name="chat" size={24} color={theme.colors.primary} />
                </TouchableOpacity>

                {/* Descrição do pet */}
            </View>
            <View style={{ padding: 10 }}>
                <Text style={{ fontSize: 14, color: theme.colors.text }}>
                {`${item.pet_name} é ${item.sex === 'Fêmea' ? 'uma' : 'um'} ${item.species.toLowerCase()} adorável, com ${item.age} ${item.age > 1 ? 'anos' : 'ano'} de vida. Com um peso de aproximadamente ${item.weight_kg} kg, ${item.sex === 'Fêmea' ? 'ela' : 'ele'} é ${item.age > 1 ? `${item.sex === 'Fêmea' ? 'uma companheira' : 'um companheiro'}` : 'uma companhia'} cheio(a) de energia e carinho. Sempre pront${item.sex === 'Fêmea' ? 'a' : 'o'} para novas aventuras, ${item.pet_name} está à procura de um lar onde possa compartilhar momentos de alegria e amor.`}
                </Text>
            </View>
            {/* Button */}
            <View style={{width: "100%", padding: 10}}>
                <Button title={'Adotar'} styles={{}} onPress={()=>{}} />
            </View>
        {/* <View style={styles.footerButton}>
            <TouchableOpacity onPress={openPostDetails}>
                <Icon name="comment" size={24} color={theme.colors.textLight} />
            </TouchableOpacity>
            <Text style={styles.count}>
                {
                    item?.comments[0]?.count
                }
            </Text>
        </View> */}
      </View>
    </View>
  )
}

export default PostCardDetails

const styles = StyleSheet.create({
    container:{
        gap: 10,
        marginBottom: 15,
        backgroundColor: 'white',
        borderWidth: 0.5,
        borderColor: theme.colors.gray,
        shadowColor: '#000',
        height: "100%",
    },
    header:{
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    petName:{
        fontSize: hp(2.5),
        fontWeight: theme.fonts.semibold,
    },
    userInfo:{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
    username:{
        fontSize: hp(1.7),
        color: theme.colors.textDark,
        fontWeight: theme.fonts.medium,
    },
    postTime:{
        fontSize: hp(1.4),
        color: theme.colors.textLight,
        fontWeight: theme.fonts.medium,
    },
    content:{
        position: 'relative',
        flexDirection: "row",
    },
    likePost:{
        padding: 10, // Adiciona padding ao redor do ícone
        // shadowColor: theme.colors.textLight,
        // shadowOffset: {width: 0, height: 4},
        // shadowOpacity: 0.4,
        // shadowRadius: 5,
        // elevation: 7,
    },
    postMedia:{
        height: hp(42),
        width: '100%',
        zIndex: 0
        // borderCurve: 'continuous'
    },
    postBody:{
        marginLeft: 5, 
    },
    footer: {
        alignItems: 'center',
        gap: 15,
        position: "absolute",
        borderTopRightRadius: theme.radius.xxl,
        borderTopLeftRadius: theme.radius.xxl*1.2,
        paddingHorizontal: hp(1),
        paddingVertical: hp(2),
        zIndex: 10,
        backgroundColor: "white",
        bottom: 0,
        width: "100%",
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
        gap: 18,
    },
    count:{
        color: theme.colors.text,
        fontSize: hp(1.8),
    }
})