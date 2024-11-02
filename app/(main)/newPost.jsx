import React, { useEffect, useState } from 'react';
import FirstStep from './FirstStep';
import SecondStep from './SecondStep';
import ThirdStep from './ThirdStep';
import { createOrUpdatePost } from '../../services/postService';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';

const NewPost = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const router = useRouter();


  const handleSubmit = async (data) => {
    try {
      console.log("Final: ",data);
      const res = await createOrUpdatePost(data);

      if (res.success) {
        //rota de sucesso - ajustar
        router.push("/petRegistrationSuccess");
      } else {
        Alert.alert("Novo Pet", "Erro ao adicionar o pet");
      }
    } catch (error) {
      console.error("Erro ao enviar dados:", error);
      Alert.alert("Novo Pet", "Erro ao processar a solicitação");
    }
  };

  const handleNext = (data) => {
    setFormData((prev) => {
      const updatedForm = { ...prev, ...data }


      if (step < 3) {
        setStep((prevStep) => prevStep + 1);
      } else {
        console.log("Terceiro passo: ", updatedForm);
        handleSubmit(updatedForm);
      }


      return updatedForm
    });
  };

  const stepsMapping = {
    [1]: <FirstStep onNext={handleNext} />,
    [2]: <SecondStep onNext={handleNext} />,
    [3]: <ThirdStep onNext={handleNext} />
  }

  

  return stepsMapping[step]
};

export default NewPost;


// import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Pressable, Alert } from 'react-native'
// import React, { useEffect, useRef, useState } from 'react'
// import { useAuth } from '../../contexts/AuthContext';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import ScreenWrapper from '../../components/ScreenWrapper';
// import Navigator from '../../components/Navigator';
// import { hp, wp } from '../../helpers/common';
// import { theme } from '../../constants/theme';
// import Header from '../../components/Header';
// import Avatar from '../../components/Avatar';
// import Icon from '../../assets/icons';
// import Button from '../../components/Button';
// import * as ImagePicker from 'expo-image-picker'
// import { getSupabaseFileUrl } from '../../services/ImageService';
// import { createOrUpdatePost } from '../../services/postService';
// import PostInput from '../../components/PostInput';

// const NewPost = () => {

//   const post = useLocalSearchParams();
//   const {user} = useAuth();
//   const bodyRef = useRef("");
//   const editorRef = useRef(null);
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [file, setFile] = useState(file);

//   useEffect(()=>{
//     if(post && post.id) {
//       bodyRef.current = post.body;
//       setFile(post.file || null);
//       setTimeout(()=>{
//         editorRef?.current?.setContentHTML(post.body);
//       }, 300);
//     }
//   }, [])

//   const onPick = async (isImage)=>{

//     let mediaConfig = {
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4,3],
//       quality: 0.7,
//     }
//     if(!isImage){
//       mediaConfig = {
//         mediaTypes: ImagePicker.MediaTypeOptions.Videos,
//         allowsEditing: true
//       }
//     }
  
//     let result = await ImagePicker.launchImageLibraryAsync(mediaConfig);
    
//     if(!result.canceled){
//       setFile(result.assets[0]);
//     }
  
//   }

//   const isLocalFile = file=>{
//     if(!file) return null;
//     if(typeof file == 'object') return true;

//     return false;
//   }
//   const getFileType = file =>{
//     if(!file) return null;
//     if(isLocalFile(file)){
//       return file.type;
//     }

//     //check image or video for remote file
//     if(file.includes('postImage')){
//       return 'image';
//     }
//     return 'video';
//   }

//   const getFileUri = file=>{
//     if(!file) return null;
//     if(isLocalFile(file)){
//       return file.uri;
//     }

//     return getSupabaseFileUrl(file)?.uri;
//   }

//   const onSubmit = async ()=>{
//     if(!bodyRef.current && !file){
//       Alert.alert("Post", "Por favor, adicione uma imagem ou adicione uma mensagem");
//       return;
//     }

//     let data={
//       file,
//       body: bodyRef.current,
//       userId: user?.id,
//     }

//     if(post && post.id) data.id = post.id;

//     //create post
//     setLoading(true);
//     let res = await createOrUpdatePost(data);
//     setLoading(false);
//     if(res.success){
//       setFile(null);
//       bodyRef.current = '';
//       router.back();
//     }else{
//       Alert.alert("Post", res.msg);
//     }
//   }
  
//   return (
//     <View style={{flex: 1}}>
//       <ScreenWrapper bg="white">
//         <View style={styles.container}>
//           <Header title="Nova publicação"/>
//           <ScrollView contentContainerStyle={{gap: 20}}>
//             {/* avatar */}
//             <View style={styles.header}>
//               <Avatar 
//                 uri={user?.image}
//                 size={hp(6.5)}
//                 rounded={theme.radius.xl}
//               />
//               <View style={{gap: 2}}>
//                 <Text style={styles.username}>
//                   {
//                     user && user.name
//                   }
//                 </Text>
//                 <Text style={styles.publicText}>
//                   Público
//                 </Text>
//               </View>
//             </View>

//             <View style={styles.textEditor}>
//               {/* <RichTextEditor editorRef={editorRef} onChange={body => bodyRef.current = body}/> */}
//               <PostInput 
//                 inputRef={editorRef} 
//                 onChangeText={(body) => bodyRef.current = body} 
//                 placeholder="Digite sua descrição"
//                 multiline={true} // Permite múltiplas linhas, simulando um editor de texto
//               />
//             </View>

//             {
//               file && (
//                 <View style={styles.file}>
//                   <Image source={{uri: getFileUri(file)}} resizeMode='conver' style={{flex:1}} />
//                   <Pressable style={styles.closeIcon} onPress={()=>setFile(null)}>
//                     <Icon name="delete" size={20} color="white" />
//                   </Pressable>
//                 </View>
//               )
//             }

//             <View style={styles.media}>
//               <Text style={styles.addImageText}>Add to your post</Text>
//               <View style={styles.mediaIcons}>
//                 <TouchableOpacity onPress={()=>onPick(true)}>
//                   <Icon name="image" size={30} color={theme.colors.dark} />
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={()=>onPick(false)}>
//                   <Icon name="video" size={33} color={theme.colors.dark} />
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </ScrollView>
//           <Button
//             buttonStyle={{height: hp(6.2)}}
//             title={post && post.id ? "Atualizar" : "Publicar"}
//             loading={loading}
//             hasShadow={false}
//             onPress={onSubmit}
//           />
//         </View>
//       </ScreenWrapper>
//       <Navigator user={user}/>
//     </View>
//   )
// }

// export default NewPost

// const styles = StyleSheet.create({
//   container:{
//     flex: 1,
//     marginBottom: 30,
//     paddingHorizontal: wp(4),
//     gap: 15
//   },
//   title:{
//     fontSize: hp(2.5),
//     fontWeight: theme.fonts.semibold,
//     color: theme.colors.text,
//     textAlign: 'center'
//   },
//   header:{
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12
//   },
//   username:{
//     fontSize: hp(2.2),
//     fontWeight: theme.fonts.semibold,
//     color: theme.colors.text
//   },
//   avatar:{
//     height: hp(6.5),
//     width: hp(6.5),
//     borderRadius: theme.radius.xl,
//     borderCurve: 'continuous',
//     borderWidth: 1,
//     borderColor: 'rgba(0,0,0,0.1)'
//   },
//   publicText:{
//     fontSize: hp(1.7),
//     fontWeight: theme.fonts.medium,
//     color: theme.colors.textLight
//   },
//   textEditor:{

//   },
//   media:{
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     borderWidth: 1.5,
//     padding: 12,
//     paddingHorizontal: 18,
//     borderRadius: theme.radius.xl,
//     borderCurve: 'continuous',
//     borderColor: theme.colors.gray
//   },
//   mediaIcons:{
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 15
//   },
//   addImageText:{
//     fontSize: hp(1.9),
//     fontWeight: theme.fonts.semibold,
//     color: theme.colors.text
//   },  
//   imageIcon:{
//     borderRadius: theme.radius.md
//   },
//   file:{
//     height: hp(30),
//     width: '100%',
//     borderRadius: theme.radius.xl,
//     overflow: 'hidden',
//     borderCurve: 'continuous'
//   },
//   video:{

//   },
//   closeIcon:{
//     position: 'absolute',
//     top: 10,
//     right: 10,
//     padding: 7,
//     borderRadius: 50,
//     backgroundColor: 'rgba(255,0,0,0.6)'
//   }
// })