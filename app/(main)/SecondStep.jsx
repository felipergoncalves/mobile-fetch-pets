import { View, Text, Image, Pressable, StyleSheet, ScrollView, Alert} from 'react-native';
import Button from '../../components/Button';
import * as ImagePicker from 'expo-image-picker'
import { getSupabaseFileUrl } from '../../services/ImageService';
import { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { theme } from '../../constants/theme';
import Icon from '../../assets/icons';
import { hp, wp } from '../../helpers/common';
import { useAuth } from '../../contexts/AuthContext';
import Navigator from '../../components/Navigator';
import ScreenWrapper from '../../components/ScreenWrapper';
import { useLocalSearchParams } from 'expo-router';

const CustomCheckbox = ({ value, onValueChange }) => {
    return (
      <TouchableOpacity
        onPress={() => onValueChange(!value)}
        style={{
          width: 24,
          height: 24,
          borderColor: 'gray',
          borderWidth: 1,
          borderRadius: 20,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white"
        }}
      >
        <View style={{backgroundColor: value ? '#3198F4' : 'white', width: 16,
          height: 16, borderRadius: 20}}></View>
      </TouchableOpacity>
    );
};

const SecondStep = ({ onNext, onPickImage }) => {
  const [file, setFile] = useState(null);
  const {user} = useAuth();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const post = useLocalSearchParams();

  const handleNext = () => {
    if (!file || !isConfirmed) {
      Alert.alert("Novo Pet", "Por favor, preencha todos os campos");
      return;
    }
    onNext({ file, userId: user?.id, isConfirmed });
  };

  const toggleOptIn = () => {
    setOptIn(prev => !prev);
  };

  const onPick = async (isImage)=>{

    let mediaConfig = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4,3],
      quality: 0.7,
    }
    if(!isImage){
      mediaConfig = {
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true
      }
    }
  
    let result = await ImagePicker.launchImageLibraryAsync(mediaConfig);
    
    if(!result.canceled){
      setFile(result.assets[0]);
    }
  
  }

  const isLocalFile = file=>{
        if(!file) return null;
        if(typeof file == 'object') return true;
    
        return false;
  }

  const getFileType = file =>{
    if(!file) return null;
    if(isLocalFile(file)){
      return file.type;
    }

    //check image or video for remote file
    if(file.includes('postImage')){
      return 'image';
    }
    return 'video';
  }

  const getFileUri = file=>{
        if(!file) return null;
        if(isLocalFile(file)){
          return file.uri;
        }
    
        return getSupabaseFileUrl(file)?.uri;
  }

  //Verificando se o pet já existe, se existir é uma edição
  useEffect(()=>{
    if(post && post.id) {
      setFile(post.image);
      setIsConfirmed(post.opt_in)
    }
    console.log("POST ESTÁ VINDO ASSIM: ", post);
  }, [])

  return (
    <View style={{flex: 1}}>
      <ScrollView>
        <ScreenWrapper>
          <View style={{ padding: 20 }}>
            <View>
              <Image style={styles.headerImage} resizeMode='contain' source={require('../../assets/images/petsRegistrationHeader.png')} />
            </View>
            <View style={{alignItems: "center", marginBottom: 5}}>
              <Text style={{fontSize: hp(1.7), color: theme.colors.text}}>Ei, que tal colocar uma foto do seu pet?</Text>
            </View>
      {/* <Text>Adicionar Foto do Pet</Text>
      <Button title="Selecionar Imagem" onPress={onPickImage} />
      {file && <Text>Imagem selecionada</Text>}
      <Button title="Próximo passo" onPress={handleNext} /> */}
      {
              file ? (
                <View style={styles.file}>
                  <Image source={{uri: `${post.image}`}} resizeMode='cover' style={{flex:1}} />
                  <Pressable style={styles.closeIcon} onPress={()=>setFile(null)}>
                    <Icon name="delete" size={20} color="white" />
                  </Pressable>
                </View>
              ) : (
                <TouchableOpacity onPress={()=>onPick(true)}>
                  <View style={styles.defaultFile}>
                    <Image source={require('../../assets/images/addPetImage.png')} resizeMode='contain' style={{flex:1, width:"100%"}} />
                  </View>
                </TouchableOpacity>
              )
            }

            {/* <View style={styles.media}>
              <Text style={styles.addImageText}>Add to your post</Text>
              <View style={styles.mediaIcons}>
                <TouchableOpacity onPress={()=>onPick(true)}>
                  <Icon name="image" size={30} color={theme.colors.dark} />
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>onPick(false)}>
                  <Icon name="video" size={33} color={theme.colors.dark} />
                </TouchableOpacity>
              </View>
            </View> */}

            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                <CustomCheckbox value={isConfirmed} onValueChange={setIsConfirmed} />
                <Text style={{fontSize: hp(1.5), marginLeft: 5}}>Declaro que as informações fornecidas são verdadeiras</Text>
            </View>
            <View style={{marginTop: 20}}>
              <Button title="Próximo passo" onPress={handleNext} />
            </View>
    </View>
        </ScreenWrapper>
    </ScrollView>
    <Navigator user={user}/>
    </View>
  );
};

export default SecondStep;

const styles = StyleSheet.create({
      container:{
        flex: 1,
        marginBottom: 30,
        paddingHorizontal: wp(4),
        gap: 15
      },
      title:{
        fontSize: hp(2.5),
        fontWeight: theme.fonts.semibold,
        color: theme.colors.text,
        textAlign: 'center'
      },
      header:{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12
      },
      headerImage: {
        height: hp(20),
        width: "100%",
        alignSelf: "center",
        zIndex: 3
      },
      username:{
        fontSize: hp(2.2),
        fontWeight: theme.fonts.semibold,
        color: theme.colors.text
      },
      avatar:{
        height: hp(6.5),
        width: hp(6.5),
        borderRadius: theme.radius.xl,
        borderCurve: 'continuous',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)'
      },
      publicText:{
        fontSize: hp(1.7),
        fontWeight: theme.fonts.medium,
        color: theme.colors.textLight
      },
      textEditor:{
    
      },
      media:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1.5,
        padding: 12,
        paddingHorizontal: 18,
        borderRadius: theme.radius.xl,
        borderCurve: 'continuous',
        borderColor: theme.colors.gray
      },
      mediaIcons:{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15
      },
      addImageText:{
        fontSize: hp(1.9),
        fontWeight: theme.fonts.semibold,
        color: theme.colors.text
      },  
      imageIcon:{
        borderRadius: theme.radius.md
      },
      file:{
        height: hp(30),
        width: '100%',
        borderRadius: theme.radius.xl,
        overflow: 'hidden',
        borderCurve: 'continuous'
      },
      defaultFile:{
        height: hp(50),
        width: '100%',
        borderRadius: theme.radius.xl,
        overflow: 'hidden',
        borderCurve: 'continuous'
      },
      closeIcon:{
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 7,
        borderRadius: 50,
        backgroundColor: 'rgba(255,0,0,0.6)'
      }
    })