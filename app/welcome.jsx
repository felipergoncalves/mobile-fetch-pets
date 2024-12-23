import { StyleSheet, Text, View, Image, Pressable } from 'react-native'
import React from 'react'
import ScreenWrapper from '../components/ScreenWrapper'
import { StatusBar } from 'expo-status-bar'
import { wp, hp } from '../helpers/common'
import { theme } from '../constants/theme'
import Button from '../components/Button'
import { useRouter } from 'expo-router'

const Welcome = () => {
    const router = useRouter();
  return (
    <ScreenWrapper bg="white">
      <StatusBar style="dark" />
      <View style={styles.container}>
        {/* Welcome Images */}
        <Image style={styles.logoImage} resizeMode='contain' source={require('../assets/images/logo.png')} />
        <Image style={styles.pawsImage} resizeMode='contain' source={require('../assets/images/paws.png')} />
        <Image style={styles.welcomeImage} resizeMode='contain' source={require('../assets/images/welcome.png')} />
      
        {/* Title */}
        <View style={{gap:20}}>
            <Text style={styles.title}>Bem-vindo(a)!</Text>
            <Text style={styles.subtitle}>Faça parte da comunidade Fetch Pets e ajude animais a encontrarem um lar cheio de amor!</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
            <Button 
                title="Vamos lá"
                buttonStyle={{marginHorizontal: wp(3), backgroundColor: "#59C1A3"}}
                onPress={()=> router.push('signUp')}
            />
            <View style={styles.bottomTextContainer}>
                <Text style={styles.loginText}>
                    Já tem uma conta?
                </Text>
                <Pressable onPress={()=> router.push('login')}>
                    <Text style={[styles.loginText, {color: theme.colors.primaryDark, fontWeight: theme.fonts.semibold}]}>
                        Entrar
                    </Text>
                </Pressable>
            </View>
        </View>
      </View>
    </ScreenWrapper>
  )
}

export default Welcome

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-around",
        backgroundColor: "white",
        paddingHorizontal: wp(4)
    },
    logoImage: {
        height: hp(10),
        width: wp(80),
        alignSelf: "center",
        position: 'relative',
        zIndex: 3
    },
    pawsImage: {
        height: hp(20),
        width: wp(80),
        alignSelf: "center",
        position: 'relative',
        zIndex:1,
        top: 60
    },
    welcomeImage: {
        height: hp(50),
        width: wp(100),
        alignSelf: "center",
        position: 'relative',
        zIndex: 2,
        top: -80,
    },
    title:{
        color: "#59C1A3",
        fontSize: hp(4),
        textAlign: 'center',
        fontWeight: theme.fonts.extraBold,
        top: -100
    },
    subtitle:{
        textAlign: 'center',
        paddingHorizontal: wp(10),
        fontSize: hp(1.7),
        color: theme.colors.text,
        top: -100
    },
    footer:{
        bottom: 10,
        gap: 30,
        width: '100%'
    },
    bottomTextContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5
    },
    loginText:{
        bottom: 20,
        textAlign: 'center',
        color: theme.colors.text,
        fontSize: hp(1.6)
    },
})