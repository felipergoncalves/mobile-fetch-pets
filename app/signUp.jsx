import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useRef, useState } from 'react'
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

const signUp = () => {
    const router = useRouter();
    const emailRef = useRef("");
    const nameRef = useRef("");
    const passwordRef = useRef("");
    const [loading, setLoading] = useState(false);

    const onSubmit = async ()=> {
        if(!emailRef.current || !passwordRef.current){
            Alert.alert('Sign Up', 'Por favor, preencha todos os campos!');
            return;
        }
        //good to go
    }
  return (
    <ScreenWrapper bh={'white'}>
        <StatusBar style="dark" />
        <View style={styles.container}>
            <BackButton router={router}/>

            <View>
                <Text style={styles.welcomeText}>Olá,</Text>
                <Text style={styles.welcomeText}>Bem Vindo!</Text>
            </View>

            {/* form */}
            <View style={styles.form}>
                <Input
                    icon={<Icon name='user' size={26} strokeWidth={1.6} />}
                    placeholder="Digite seu nome"
                    onChangeText={value=> nameRef.current = value}
                />
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
                {/* Button */}
                <Button title={'Cadastrar'} loading={loading} onPress={onSubmit} />
            </View>

            {/* footer */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    Já tem uma conta?
                </Text>
                <Pressable onPress={()=> router.push('login')}>
                    <Text style={[styles.footerText, {color:theme.colors.primary, fontWeight:theme.fonts.semibold}]}>Entrar</Text>
                </Pressable>
            </View>
        </View>
    </ScreenWrapper>
  )
}

export default signUp

const styles = StyleSheet.create({
    container:{
        flex: 1,
        gap: 45,
        paddingHorizontal: wp(5),
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
    },
    footerText:{
        textAlign: 'center',
        color: theme.colors.text,
        fontSize: hp(1.6)
    }
})