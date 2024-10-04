import React from 'react';
import { View, Pressable } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import Avatar from './Avatar';
import Icon from '../assets/icons';
import { theme } from '../constants/theme';
import { hp, wp } from '../helpers/common';

const Navigator = ({ user }) => {
  const router = useRouter();
  const segments = useSegments(); // Obter o segmento (rota) atual

  // Função auxiliar para verificar se a rota está ativa
  const isRouteActive = (routeName) => segments.includes(routeName);

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

        <Pressable onPress={() => router.push('notifications')}>
          <Icon
            name="heart"
            size={hp(3.2)}
            strokeWidth={2}
            color={isRouteActive('notifications') ? theme.colors.primary : theme.colors.text}
          />
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
            uri={user?.image}
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
};

export default Navigator;
