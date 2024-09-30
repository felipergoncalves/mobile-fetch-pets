import { Pressable, StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { theme } from '../constants/theme'
import { hp, wp } from '../helpers/common'
import Loading from './Loading'

const GoogleButton = ({
    buttonStyle,
    textStyle,
    title,
    onPress=()=>{},
    loading = false,
    hasShadow = true,
}) => {
    
    const shadowStyle = {
        shadowColor: theme.colors.dark,
        shadowOffset: {width: 0, height: 10},
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4
    }

    if(loading){
        return (
        <View style={[styles.button, buttonStyle, {backgroundColor: 'white'}]}>
            <Loading />    
        </View>)
    }
  return (
    <Pressable onPress={onPress} style={[styles.button, buttonStyle, hasShadow && shadowStyle]}>
      <Image style={styles.googleImage} resizeMode='contain' source={require('../assets/images/google.png')} />
      <Text style={[styles.text, textStyle]}>Continue com o Google</Text>
    </Pressable>
  )
}

export default GoogleButton

const styles = StyleSheet.create({
    button:{
        backgroundColor: '#ffffff',
        height: hp(6.6),
        justifyContent: 'center',
        alignItems: 'center',
        borderCurve: 'continuous',
        borderRadius: theme.radius.xl,
        flexDirection: 'row',
        gap: 5,
        zIndex: 1000
    },
    googleImage:{
        height: hp(3),
        width: wp(10),
        alignSelf: "center",
    },
    text:{
        fontSize: hp(2.2),
        color: theme.colors.dark
    }
})