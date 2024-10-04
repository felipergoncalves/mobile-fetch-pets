import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import Navigator from '../../components/Navigator'
import { useAuth } from '../../contexts/AuthContext'
import { useRouter } from 'expo-router'


const Notifications = () => {
  
  const {user, setAuth} = useAuth();
  const router = useRouter();
  
  return (
    <View style={{flex: 1}}>
      <ScreenWrapper bg="white">
        <View style={styles.container}>
          {/* header */}
        </View>
      </ScreenWrapper>
      <Navigator user={user}/>
    </View>
  )
}

export default Notifications

const styles = StyleSheet.create({
  container:{
    flex: 1,
  },
})