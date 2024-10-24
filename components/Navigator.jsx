import React, { useEffect, useState } from 'react';
import { View, Pressable } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import Avatar from './Avatar';
import Icon from '../assets/icons';
import { theme } from '../constants/theme';
import { hp, wp } from '../helpers/common';
import { supabase } from '../lib/supabase';

const Navigator = ({ user }) => {
  const router = useRouter();
  const segments = useSegments(); // Obter o segmento (rota) atual
  const [notificationCount, setNotificationCount] = useState(0);

  // Função auxiliar para verificar se a rota está ativa
  const isRouteActive = (routeName) => segments.includes(routeName);

  const handleNewNotification = async (payload) => {
    if(payload.eventType == "INSERT" && payload.new.id){
      setNotificationCount(prev=>prev+1);
    }
  }

  useEffect(() =>{
    if (!user) return;
    let notificationChannel = supabase
    .channel('notifications')
    .on('postgres_changes', {event: 'INSERT', schema: 'public', table: 'notifications', filter: `receiverId=eq.${user.user.id}`}, handleNewNotification)
    .subscribe();
    
    return ()=>{
      supabase.removeChannel(notificationChannel);
    }
  }, [])

  return (
    <View style={styles.header}>
      <View style={styles.icons}>
        <Pressable onPress={() => router.push('home')}>
          <Icon
            name="home"
            size={hp(3.2)}
            strokeWidth={2}
            color={isRouteActive('home') ? theme.colors.primary : theme.colors.text}
          />
        </Pressable>

        <Pressable onPress={() => {
          setNotificationCount(0);
          router.push('notifications');
        }}>
          <Icon
            name="heart"
            size={hp(3.2)}
            strokeWidth={2}
            color={isRouteActive('notifications') ? theme.colors.primary : theme.colors.text}
          />
          {
            notificationCount > 0 && (
              <View style={styles.pill}>
                <Text style={styles.pillText}>{notificationCount}</Text>
              </View>
            )
          }
        </Pressable>

        <Pressable onPress={() => router.push('newPost')}>
          <Icon
            name="plus"
            size={hp(3.2)}
            strokeWidth={2}
            color={isRouteActive('newPost') ? theme.colors.primary : theme.colors.text}
          />
        </Pressable>

        <Pressable onPress={() => router.push('profile')}>
          <Avatar
            uri={user.user?.image}
            size={hp(4.3)}
            rounded={theme.radius.sm}
            style={{
              borderWidth: 2,
              borderColor: isRouteActive('profile') ? theme.colors.primary : theme.colors.text,
            }}
          />
        </Pressable>

        <Pressable onPress={() => router.push('settings')}>
          <Icon
            name="settings"
            size={hp(3.2)}
            strokeWidth={2}
            color={isRouteActive('settings') ? theme.colors.primary : theme.colors.text}
          />
        </Pressable>
      </View>
    </View>
  );
};

const styles = {
  header:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    padding: hp(1),
    width: '100%',
    zIndex: 1000,
    shadowColor: theme.colors.textLight,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 7,
    borderTopLeftRadius: 20, // Ajuste o valor do raio conforme necessário
    borderTopRightRadius: 20,
    backgroundColor: "white"
  },
  icons:{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 18
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
};

export default Navigator;
