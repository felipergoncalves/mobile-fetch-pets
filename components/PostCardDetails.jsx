import { StyleSheet, Text, TouchableOpacity, View, Image, Alert} from 'react-native'
import React, { useEffect, useState} from 'react'
import { theme } from '../constants/theme'
import { hp, wp} from '../helpers/common'
import Avatar from './Avatar'
import moment from 'moment'
import Icon from '../assets/icons'
import { getSupabaseFileUrl } from '../services/ImageService'
import { createPostLike, removePostLike, getPostLikes } from '../services/postService'
import Header from './Header'
import BackButton from './BackButton'
import Button from './Button'
import { color } from '@rneui/themed/dist/config'
import { getUserData } from '../services/userService'
import {generateChatUUID} from "../helpers/generateChatId";
import {useRouter} from "expo-router";

const PostCardDetails = ({
    item,
    currentUser,
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
    const [isDisabled, setIsDisabled] = useState(false);
    const router = useRouter();
    const petName = item.sex === 'Fêmea' ? `a ${item?.pet_name}`: `o ${item?.pet_name}`;
    const preMessage = `Olá, gostaria de adotar ${petName}!`

    const petDescriptions = [
        `${item.pet_name} é ${item.sex === 'Fêmea' ? 'uma' : 'um'} ${item.species.toLowerCase()} adorável, que está à procura de um lar cheio de amor e carinho. Com ${item.age} ${item.age > 1 ? 'anos' : 'ano'} de vida e aproximadamente ${item.weight_kg} kg, ${item.sex === 'Fêmea' ? 'ela' : 'ele'} é ${item.sex === 'Fêmea' ? 'a' : 'o'} ${item.sex === 'Fêmea' ? 'ela' : 'ele'} ${item.sex === 'Fêmea' ? 'perfeita' : 'perfeito'} para quem deseja aventuras e momentos felizes.`,
        
        `${item.pet_name} é ${item.sex === 'Fêmea' ? 'uma' : 'um'} ${item.species.toLowerCase()} de ${item.age} ${item.age > 1 ? 'anos' : 'ano'} e aproximadamente ${item.weight_kg} kg. ${item.sex === 'Fêmea' ? 'cheia' : 'cheio'} de energia e amor, ${item.sex === 'Fêmea' ? 'ela' : 'ele'} está ${item.sex === 'Fêmea' ? 'pronta' : 'pronto'} para fazer parte de uma nova família e compartilhar momentos de alegria. Será que você seria o(a) ${item.sex === 'Fêmea' ? 'companheira' : 'companheiro'} ideal?`,
        
        `Se você está procurando ${item.sex === 'Fêmea' ? 'uma' : 'um'} ${item.species.toLowerCase()} que seja ${item.sex === 'Fêmea' ? 'carinhosa' : 'carinhoso'} e ${item.sex === 'Fêmea' ? 'cheia' : 'cheio'} de energia, ${item.pet_name} pode ser a escolha perfeita. Com ${item.age} ${item.age > 1 ? 'anos' : 'ano'} de vida e um peso de ${item.weight_kg} kg, ${item.sex === 'Fêmea' ? 'ela' : 'ele'} vai adorar ser parte da sua família.`,
        
        `Conheça ${item.pet_name}, ${item.sex === 'Fêmea' ? 'uma' : 'um'} ${item.species.toLowerCase()} ${item.sex === 'Fêmea' ? 'encatandora' : 'encantador'} que está em busca de um lar. Com ${item.age} ${item.age > 1 ? 'anos' : 'ano'} e cerca de ${item.weight_kg} kg, ${item.sex === 'Fêmea' ? 'ela' : 'ele'} é ${item.sex === 'Fêmea' ? 'cheia' : 'cheio'} de carinho e amor para oferecer. Quem será o sortudo(a) que vai ${item.sex === 'Fêmea' ? 'adotá-la' : 'adotá-lo'}?`,
        
        `${item.pet_name} é o tipo de ${item.species.toLowerCase()} que vai conquistar seu coração. Com ${item.age} ${item.age > 1 ? 'anos' : 'ano'} e aproximadamente ${item.weight_kg} kg, ${item.sex === 'Fêmea' ? 'ela' : 'ele'} está em busca de uma nova família para dividir muitos momentos de alegria e carinho. Não perca a chance de ${item.sex === 'Fêmea' ? 'adotá-la' : 'adotá-lo'}!`
      ];

    const getRandomDescription = () => {
        const randomIndex = Math.floor(Math.random() * petDescriptions.length);
        return petDescriptions[randomIndex];
    };
    
    const getNameAdopter = async() => {
            try{
                const res = await getUserData(item?.userId);
                if (res.success) {
                    return res.result.name;
                }
            }catch(err){
                console.error(err);
            }
    }

    const getUsers = async() => {
        try{
            const res = await getUserData(item?.userId);
            if (res.success) {
                console.log("RESULTADO VEM ASSIM: ", res.result)
                setUser(res.result);
            }
        }catch(err){
            console.error(err);
        }
    }

    const getPostLike = async (postId) => {
       try{
        const res = await getPostLikes(postId);
        if (res.success) {

            console.log("LIKES DO POST CHEGARAM: ", res.data);
        }
       }catch(err){
        console.error(err);
       }
      };

    useEffect(() => {
        getPostLike(item?.id)
        setLikes(item?.postLikes);
        getUsers(item?.userId);

        console.log("CURRENT USER: ", currentUser);
        console.log("ITEM: ", item);
        console.log("USER: ", user);

        currentUser.id == user?.id ? setIsDisabled(true) : setIsDisabled(false);

        // console.log("POST CARD DETAILS: ", item);
        // console.log("USER: ", user);

    }, [])

    // const openPostDetails = ()=>{
    //     if(!showMoreIcon) return null;
    //     router.push({pathname: 'postDetails', params:{postId: item?.id}})
    // }

    // const confirmFavorite = () => {
    //     Alert.alert(
    //       liked ? "Remover dos Favoritos" : "Adicionar aos Favoritos",
    //       liked
    //         ? "Tem certeza que deseja remover este pet dos seus favoritos?"
    //         : "Tem certeza que deseja adicionar este pet aos seus favoritos?",
    //       [
    //         {
    //           text: "Cancelar",
    //           style: "cancel",
    //         },
    //         {
    //           text: "Sim",
    //           onPress: onLike, // Chama a função onLike se o usuário confirmar
    //         },
    //       ]
    //     );
    //   };

    // const onLike = async ()=>{
    //     if(liked){
    //         //remove like
    //         // let updatedLikes = likes.filter(like=> like.userId!=currentUser?.id)
    //         setLikes([...updatedLikes])
    //         let res = await removePostLike(item?.id, currentUser?.id);
    //         if(!res.success){
    //             Alert.alert("Publicação", "Houve um problema!");
    //         }
    //     }else{
    //         let data = {
    //             userId: currentUser?.id,
    //             postId: item?.id
    //         }
    //         setLikes([...likes, data])
    //         let res = await createPostLike(data);
    //         if(!res.success){
    //             Alert.alert("Publicação", "Houve um problema!");
    //         }
    //     }
    // }

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
        onDelete(item)
    }

    const createdAt = moment(item?.created_at).format('MMM D');
    // const liked = likes.filter(like=> like.userId == currentUser?.user.id)[0]? true: false;
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
                showDelete && currentUser.id == user?.id && (
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
            <Image
            source={{uri: `${item?.image}`}}
            transition={100}
            style={styles.postMedia}
            contentFit='cover'
            />
            // item?.file && item?.file?.includes('postImages') && (
            //     <Image
            //         source={getSupabaseFileUrl(item?.file)}
            //         transition={100}
            //         style={styles.postMedia}
            //         contentFit='cover'
            //     />
            // )
        }
      </View>

      {/* like, comment */}
      <View style={styles.footer}>
        <View style={{flexDirection:"row", justifyContent: "space-between", width:"100%", paddingHorizontal: hp(2)}}>
            <View style={styles.petInfo}>
                <Text style={styles.petName}>{item.pet_name}</Text>
            </View>
            <View style={styles.footerButton}>
                {/* <TouchableOpacity style={styles.likePost} onPress={confirmFavorite}>
                    <Icon name="heart" size={24} fill={liked? theme.colors.rose : 'transparent'} color={liked? theme.colors.rose : theme.colors.textLight} />
                </TouchableOpacity> */}
                <TouchableOpacity style={styles.likePost}>
                    <Icon name="heart" size={24} fill={theme.colors.rose} color={theme.colors.rose} />
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
                uri={user.image}
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
                    {user?.name}
                    </Text>
                    <Text style={{ fontSize: 14, color: '#555' }}>
                        {item.sex === 'Fêmea' ? 
                            `${user.gender === 'Feminino' ? 'Dona' : 'Dono'} da ${item.pet_name}` : 
                            `${user.gender === 'Feminino' ? 'Dona' : 'Dono'} do ${item.pet_name}`
                        }
                    </Text>
                </View>

                {/* Ícone de chat à direita */}
                <TouchableOpacity
                    onPress={async () => {
                        router.push({
                            pathname: '/(main)/chatScreen',
                            params: {
                                userId: currentUser.id,
                                chatId: generateChatUUID(currentUser.id, item.userId),
                                contactId: item.userId,
                                preMessage: preMessage,
                                contactName: await getNameAdopter(),
                            },
                        });
                    }}
                    disabled={currentUser.id == user?.id || item.adopter !== null}
                >
                    <Icon name="chat" size={24} color={currentUser.id == user?.id || item.adopter !== null ? "#CCCCCC" : theme.colors.primary} />
                </TouchableOpacity>
                

                {/* Descrição do pet */}
            </View>
            <View style={{ padding: 10, height: 110}}>
                <Text style={{ fontSize: 14, color: theme.colors.text }}>
                {getRandomDescription()}
                </Text>
            </View>
            {/* Button */}
            <View style={{ width: "100%", padding: 10 }}>
                <TouchableOpacity
                    style={[
                    styles.button,
                    (currentUser.id == user?.id || item.adopter !== null) && styles.buttonDisabled
                    ]}
                    onPress={async () => {
                        router.push({
                            pathname: '/(main)/chatScreen',
                            params: {
                                userId: currentUser.id,
                                chatId: generateChatUUID(currentUser.id, item.userId),
                                contactId: item.userId,
                                preMessage: preMessage,
                                contactName: await getNameAdopter(),
                            },
                        });
                    }}
                    disabled={currentUser.id == user?.id || item.adopter !== null}
                >
                    <Text
                    style={[
                        styles.buttonText,
                        isDisabled && styles.textDisabled
                    ]}
                    >
                    Adotar
                    </Text>
                </TouchableOpacity>
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
        height: hp(43),
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
    },
    button: {
        shadowColor: theme.colors.dark,
        shadowOffset: {width: 0, height: 10},
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
        backgroundColor: '#3198F4',
        height: hp(6.6),
        justifyContent: 'center',
        alignItems: 'center',
        borderCurve: 'continuous',
        borderRadius: theme.radius.xl
      },
      buttonDisabled: {
        backgroundColor: '#CCCCCC',
      },
      buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
      },
      textDisabled: {
        color: '#888888',
      },
})