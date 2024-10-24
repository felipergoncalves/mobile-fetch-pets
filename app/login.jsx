import { Alert, Pressable, StyleSheet, Text, TouchableOpacity, View, Image, Keyboard } from 'react-native'
import React, { useRef, useState, useEffect} from 'react'
import ScreenWrapper from '../components/ScreenWrapper'
import Home from '../assets/icons/Home'
import { theme } from '../constants/theme'
import Icon from '../assets/icons'
import { StatusBar } from 'expo-status-bar'
import BackButton from '../components/BackButton'
import { useRouter } from 'expo-router'
import { hp, wp } from '../helpers/common'
import Input from '../components/Input'
import Button from '../components/Button'
import GoogleButton from '../components/GoogleButton'
import createAxiosInstance from '../constants/axiosInstance'
import { useAuth } from '../contexts/AuthContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getUserData } from '../services/userService'

const login = () => {
    const router = useRouter();
    const {setAuth, setUserData} = useAuth();
    const emailRef = useRef("");
    const passwordRef = useRef("");
    const [loading, setLoading] = useState(false);
    const [keyboardVisible, setKeyboardVisible] = useState(false);

    const onSubmit = async ()=> {
        if(!emailRef.current || !passwordRef.current){
            Alert.alert('Login', 'Por favor, preencha todos os campos!');
            return;
        }

        let email = emailRef.current.trim();
        let password = passwordRef.current.trim();

        const axiosInstance = await createAxiosInstance(); // Crie a instância do axios aqui

        setLoading(true);

        await axiosInstance.post('/auth/login', {
            email,
            password
        }).then(async ({data}) => {
            let userData = {};

            userData = data.user;
            const token = userData.token;
            // Armazenar o token no AsyncStorage
            await AsyncStorage.setItem('@auth_token', token);
    
            setAuth(userData);

            // Atualizar os dados do usuário
            let res = await getUserData(userData.user.id);
            if(res.success) setUserData({...res.data, email});

            router.replace('/home');
        })
        .catch((error) => {
            Alert.alert('Login', error.message);
        });

        setLoading(false);
    }

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
          setKeyboardVisible(true);
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
          setKeyboardVisible(false);
        });
    
        return () => {
          keyboardDidShowListener.remove();
          keyboardDidHideListener.remove();
        };
    }, []);

  return (
    <ScreenWrapper bg={'white'}>
        <StatusBar style="dark" />
        <View style={styles.container}>
            <BackButton router={router}/>

            <Image style={styles.logoImage} resizeMode='contain' source={require('../assets/images/logo.png')} />

            {/* form */}
            <View style={styles.form}>
                <Input
                    icon={<Icon name='mail' size={26} strokeWidth={1.6} />}
                    placeholder="Digite seu e-mail"
                    onChangeText={value=> emailRef.current = value}
                />
                <Input
                    icon={<Icon name='lock' size={26} strokeWidth={1.6} />}
                    placeholder="Digite sua senha"
                    secureTextEntry
                    onChangeText={value=> passwordRef.current = value}
                />
                <Text style={styles.forgotPassword}>
                    Esqueceu sua senha?
                </Text>
                {/* Button */}
                <TouchableOpacity
                    onPress={() => router.push('/resetPassword')} // Ajuste a rota conforme necessário
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Redefinir Senha</Text>
                </TouchableOpacity>
                <Button title={'Login'} loading={loading} styles={styles.loginButton} onPress={onSubmit} />
            </View>

            {/* footer */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    Não tem uma conta?
                </Text>
                <Pressable onPress={()=> router.push('signUp')}>
                    <Text style={[styles.footerText, {color:theme.colors.primary, fontWeight:theme.fonts.semibold}]}>Cadastre-se</Text>
                </Pressable>
            </View>
            <Text style={{textAlign:'center', top: -40, fontSize: hp(1.6)}}>Ou</Text>
            {/* Google Button */}
            <GoogleButton style={styles.googleButton}/>
        </View>
        <Image style={[styles.dogImage, keyboardVisible && styles.imageWithKeyboard]} resizeMode='stretch' source={require('../assets/images/loginDog.png')} />
    </ScreenWrapper>
  )
}

export default login

const styles = StyleSheet.create({
    container:{
        flex: 1,
        gap: 45,
        paddingHorizontal: wp(5),
    },
    logoImage: {
        height: hp(10),
        width: wp(80),
        alignSelf: "center",
        zIndex: 3
    },
    welcomeText:{
        fontSize: hp(4),
        fontWeight: theme.fonts.bold,
        color: theme.colors.text,
    },
    form:{
        gap: 25,
    },
    forgotPassword:{
        textAlign: 'right',
        fontWeight: theme.fonts.semibold,
        color: theme.colors.text
    },
    footer:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
        top: -10,
    },
    footerText:{
        textAlign: 'center',
        color: theme.colors.text,
        fontSize: hp(1.6)
    },
    button:{
        backgroundColor: 'white',
        color: "black",
    },
    dogImage:{
        height: hp(25),
        width: wp(80),
        alignSelf: "center",
        position: 'fixed',
        zIndex: 3,
        bottom: 0,
    },
    imageWithKeyboard: {
        bottom: -1000,
        opacity: 0
      },
    loginButton:{
        backgroundColor: "#3198F4"
    }
})