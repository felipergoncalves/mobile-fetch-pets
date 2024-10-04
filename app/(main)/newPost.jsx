import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'expo-router';
import ScreenWrapper from '../../components/ScreenWrapper';
import Navigator from '../../components/Navigator';

const NewPost = () => {

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

export default NewPost

const styles = StyleSheet.create({
  container:{
    flex: 1,
  },
})