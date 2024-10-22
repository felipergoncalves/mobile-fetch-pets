import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { Stack, useRouter } from 'expo-router'
import { AuthProvider, useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { getUserData } from '../services/userService'
import AsyncStorage from '@react-native-async-storage/async-storage'
import createAxiosInstance from '../constants/axiosInstance'

const _layout = () => {
  return(
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  )
}

const MainLayout = () => {
  const {setAuth, setUserData} = useAuth();
  const router = useRouter();

  useEffect(()=>{
    checkAuth();
  }, [])

  const checkAuth = async () => {
    const axios = await createAxiosInstance();

    axios.get('/')
    .then(({data}) => {
      setAuth(data.user);
      updateUserData(data.user.user, data.user.user.email);
      router.replace('/home');
    })
    .catch((error) => {
      console.log('[CHECK AUTH] Error: ', error);
      setAuth(null);
      router.replace('/welcome');
    });
  }

  const updateUserData = async (user, email) => {
    let res = await getUserData(user.id);
    if(res.success) setUserData({...res.data, email});
  }

  return (
    <Stack 
        screenOptions={{
            headerShown: false
        }}
    >
      <Stack.Screen 
        name="(main)/postDetails"
        options={{
          presentation: 'modal'
        }}
      />
    </Stack>
  )
}

export default _layout