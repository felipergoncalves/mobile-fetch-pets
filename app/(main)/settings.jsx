import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { useAuth, setUserData } from '../../contexts/AuthContext'
import ScreenWrapper from '../../components/ScreenWrapper';
import { useRouter } from 'expo-router';
import Header from '../../components/Header';
import { hp, wp } from '../../helpers/common';
import { TouchableOpacity } from 'react-native';
import Icon from '../../assets/icons';
import { theme } from '../../constants/theme';
import Avatar from '../../components/Avatar';
import Navigator from '../../components/Navigator';
import { logout } from '../../services/userService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Settings = () => {
    const {user, setAuth} = useAuth();
    const router = useRouter()
    
    const onLogout = async () =>{
      const { error } = await logout(); 
      if(error){
        Alert.alert('Sair', "Erro ao sair!");
      }
      await AsyncStorage.removeItem('@auth_token');
      router.replace('/welcome');
    }

    useEffect(() => {
        // console.log("Usuário atual settings: ", user);
      }, []);

    const handleLogout = async() => {
      //confirm modal
      Alert.alert("Confirmar", "Tem certeza que deseja sair?", [
        {
          text: 'Cancelar',
          onPress: ()=> console.log('Modal cancelado'),
          style: 'cancel'
        },
        {
          text: 'Sair',
          onPress: ()=> onLogout(),
          style: 'destructive'
        }
      ])
    }
  return (
    <View style={{flex: 1}}>
        <ScreenWrapper bg="white">
            <UserHeader user={user} router={router} handleLogout={handleLogout}/>
        </ScreenWrapper>
        <Navigator user={user}/>
    </View>
  )
}
const UserHeader = ({user, router, handleLogout}) => {
    return(
        <View style={{flex: 1, backgroundColor:"white", paddingHorizontal: wp(4)}}>
            <View>
                <Header title="Configurações" mb={30}/>
            </View>

            <View style={styles.container}>
              <View style={styles.settingsSection}>
                <View style={styles.avatarContainer}>
                  <Avatar 
                    uri={user.image}
                    size={hp(5)}
                    rounded={theme.radius.xxl*5}
                  />
                  {/* username and address */}
                  <View style={{marginLeft: 10}}>
                    <Text style={styles.userName}>{user && user.name}</Text>
                  </View>
                </View>
              </View>
              <View style={{gap: 20}}>
                <Text style={{fontSize: hp(1.8), color:theme.colors.dark}}>Configurações da conta</Text>
                <View style={{gap: 20, paddingHorizontal: 15}}>
                    <Pressable style={styles.accountAction} onPress={()=> router.push({pathname: 'signUp', params: {isUpdate: true}})}>
                        <Icon name="edit" color={"black"} />
                        <Text style={styles.actionText}>Editar perfil</Text>
                    </Pressable>
                    <Pressable style={styles.accountAction} onPress={()=> router.push('petsForAdoption')}>
                    <Image style={{ height: hp(3), width: "7%", alignSelf: "center"}} resizeMode='contain' source={require('../../assets/images/paw.png')} />
                        <Text style={styles.actionText}>Pets para adoção</Text>
                    </Pressable>
                    <Pressable style={styles.accountAction} onPress={()=> router.push('adoptedPets')}>
                    <Image style={{ height: hp(3), width: "7%", alignSelf: "center"}} resizeMode='contain' source={require('../../assets/images/paw.png')} />
                        <Text style={styles.actionText}>Pets adotados</Text>
                    </Pressable>
                </View>
              </View>
              <View style={styles.logoutSection}>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Icon name="logout" color={"white"} size={35}/>
                    <Text style={styles.logoutText}>Sair</Text>
                </TouchableOpacity>
              </View>
            </View>
        </View>
    )
}

export default Settings

const styles = StyleSheet.create({
  container:{
    flex: 1
  },
  headerContainer:{
    padding: wp(2),
    marginHorizontal: wp(4),
    marginBottom: 20
  },
  headerShape:{
    width: wp(100),
    height: hp(20)
  },
  settingsSection:{
    gap: 15,
    flexDirection: 'row'
  },
  avatarContainer:{
    height: hp(12),
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center'
  },
  editIcon:{
    position: 'absolute',
    bottom: 0,
    right: -12,
    padding: 7,
    borderRadius: 50,
    backgroundColor: 'white',
    shadowColor: theme.colors.textLight,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 7
  },
  userName:{
    fontSize: hp(2),
    fontWeight: '500',
    color: theme.colors.textDark
  },
  info:{
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  infoText:{
    fontSize: hp(1.6),
    fontWeight: '500',
    color: theme.colors.textLight
  },
  logoutButton:{
    borderRadius: theme.radius.sm,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    width: "100%"
  },
  listStyle:{
    paddingHorizontal: wp(4),
    paddingBottom: 30,
  },
  noPosts:{
    fontSize: hp(2),
    textAlign: 'center',
    color: theme.colors.text
  },
  logoutSection:{
    width: "100%",
    position: "absolute",
    bottom: 80,
    backgroundColor: "#F26F63",
    flexDirection: "row",
    alignItems: 'center',
    borderRadius: theme.radius.md,
    padding: 10
  },
  logoutText:{
    fontSize: hp(2.2),
    fontWeight: '500',
    color: "white",
    marginLeft: 10
  },
  profilePic:{
    borderRadius: '100%'
  },
  accountAction:{
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20
  },
  actionText:{
    fontSize: hp(2),
    fontWeight: theme.fonts.medium
  }
})