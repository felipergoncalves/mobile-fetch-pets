import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import MessageInput from '../../components/MessageInput';
import ScreenWrapper from '../../components/ScreenWrapper';
import Header from '../../components/Header';
import { hp, wp } from '../../helpers/common';
import { theme } from '../../constants/theme';
import Icon from '../../assets/icons';

const ChatScreen = () => {
  const router = useRouter();
  console.log(router.query); // Verifica se os parâmetros estão disponíveis

  const { userId, contactId, contactName } = router.query || {};

  const [messages, setMessages] = useState([
    { id: '1', senderId: userId || 'defaultId', content: 'Olá!' },
    { id: '2', senderId: contactId || 'defaultId', content: 'Oi! Tudo bem?' },
    { id: '3', senderId: userId || 'defaultId', content: 'Tudo certo, e você?' },
    { id: '4', senderId: contactId || 'defaultId', content: 'Ótimo! Vamos marcar algo?' }
  ]);

  const handleSend = (content) => {
    const newMessage = { id: String(messages.length + 1), senderId: userId, content };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const renderMessage = ({ item }) => (
    <View style={item.senderId === userId ? styles.myMessage : styles.otherMessage}>
      <Text style={styles.messageText}>{item.content}</Text>
    </View>
  );

  return (
    <View style={{flex: 1, backgroundColor:"white"}}>
      <ScreenWrapper>
        <View style={{flex: 1, paddingHorizontal: wp(4), paddingVertical: wp(4)}}>
          <View style={{display: "flex", flexDirection: "row", }}>
            <View style={{ width: "90%"}}>
              <Header title="{contactName}" mb={30}/>
            </View>
            <View style={{ width: "10%", alignItems: "flex-end", justifyContent: "center", height: 30, marginTop: 5}}>
              <Icon name="threeDotsVertical" color={theme.colors.dark} onPress={handleSend} />
            </View>
          </View>
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
          />
        </View>
      </ScreenWrapper>
      <View style={{backgroundColor: "#fcfcfc", paddingVertical: wp(4)}}>
        <MessageInput onSendMessage={handleSend} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  header: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C5',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#ECECEC',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  messageText: { fontSize: 16 },
});

export default ChatScreen;
