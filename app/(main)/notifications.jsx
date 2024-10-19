import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import Navigator from '../../components/Navigator'
import { useAuth } from '../../contexts/AuthContext'
import { useRouter } from 'expo-router'
import { fetchNotifications } from '../../services/notificationsService'
import { wp, hp } from '../../helpers/common'
import { theme } from '../../constants/theme'
import NotificationItem from '../../components/NotificationItem'
import Header from '../../components/Header'


const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const {user, setAuth} = useAuth();
  const router = useRouter();

  useEffect(() => {
    getNotifications();
  }, [])

  const getNotifications = async ()=>{
    let res = await fetchNotifications(user.id)
    if(res.success){
      setNotifications(res.data);
    }
  }
  
  return (
    <View style={{flex: 1}}>
      <ScreenWrapper bg="white">
        <View style={styles.container}>
          <Header title="Notificações"/>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listStyle}>
            {
              notifications.map(item=>{
                return(
                  <NotificationItem
                    item={item}
                    key={item?.id}
                    router={router}
                  />
                )
              })
            }
            {
              notifications.length==0 &&
              <Text style={styles.noData}>Você não possui notificações.</Text>
            }
          </ScrollView>
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
    paddingHorizontal: wp(4),
  },
  listStyle:{
    paddingVertical: 20,
    gap: 10
  },
  noData:{
    fontSize: hp(1.8),
    fontWeight: theme.fonts.medium,
    color: theme.colors.text,
    textAlign: 'center'
  }
})