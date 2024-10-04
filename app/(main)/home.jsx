import { StyleSheet, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { hp, wp } from '../../helpers/common'
import { theme } from '../../constants/theme'
import { useRouter } from 'expo-router'
import Navigator from '../../components/Navigator'

const Home = () => {

  const {user, setAuth} = useAuth();
  const router = useRouter();

  console.log('user: ', user);

  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        {/* header */}
        <Navigator user={user}/>
      </View>
    </ScreenWrapper>
  )
}

export default Home

const styles = StyleSheet.create({
  container:{
    flex: 1,
  },
  title:{
    color: theme.colors.text,
    fontSize: hp(3.2),
    fontWeight: theme.fonts.bold,
  },
  avatarImage:{
    height: hp(4.3),
    width: hp(4.3),
    borderRadius: theme.radius.sm,
    borderCurve: 'continuous',
    borderColor: theme.colors.gray,
    borderWidth: 3
  },
  
  listStyle:{
    paddingTop: 20,
    paddingHorizontal: wp(4)
  },
  noPosts:{
    fontSize: hp(2),
    textAlign: "center",
    color: theme.colors.text
  },
  pill:{
    position: 'absolute',
    right: -10,
    top: -4,
    height: hp(2.2),
    width: hp(2.2),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: theme.colors.roseLight
  },
  pillText:{
    color: "white",
    fontSize: hp(1.2),
    fontWeight: theme.fonts.bold
  }
})