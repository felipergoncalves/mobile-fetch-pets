import { Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import ScreenWrapper from '../../components/ScreenWrapper';
import React from 'react'
import { hp, wp } from '../../helpers/common';
import { theme } from '../../constants/theme';
import Button from '../../components/Button';
import { useRouter } from 'expo-router';

const petRegistrationSuccess = () => {

    const router = useRouter();

    const handleRedirect = () => {
        router.push("/home");
    };

  return (
    <View style={{flex: 1}}>
        <ScrollView>
            <ScreenWrapper>
                <View style={{ padding: 20}}>
                    <View style={{flex: 1}}>
                        <Image style={styles.logoImage} resizeMode='contain' source={require('../../assets/images/logo.png')} />
                    </View>
                    <View style={{flex: 1, marginTop: 30}}>
                        <Image style={styles.petRegistered} resizeMode='contain' source={require('../../assets/images/petRegistered.png')} />
                    </View>
                    <View style={{flex: 1}}>
                        <Text style={{color: "#59C1A3", fontSize: hp(3), fontWeight: theme.fonts.semibold, textAlign: "center"}}>Sucesso!</Text>
                    </View>
                    <View style={{flex: 1, marginTop: 5}}>
                        <Text style={{color: theme.colors.textLight, fontSize: hp(1.8), textAlign: "center"}}>Seu pet foi colocado para adoção com sucesso!</Text>
                        <Text style={{color: theme.colors.textLight, fontSize: hp(1.8), textAlign: "center"}}>Agora ele está disponível para encontrar um novo lar.</Text>
                    </View>
                    <View style={{marginTop: 40}}>
                        <Button title="Ir para o ínicio" onPress={handleRedirect} style={styles.button} />
                    </View>
                </View>
            </ScreenWrapper>
        </ScrollView>
    </View>
  )
}

export default petRegistrationSuccess

const styles = StyleSheet.create({
    logoImage: {
        height: hp(10),
        width: wp(80),
        alignSelf: "center",
        zIndex: 3
    },
    petRegistered: {
        height: hp(50),
        width: "100%",
        alignSelf: "center",
        zIndex: 3,
    },
})