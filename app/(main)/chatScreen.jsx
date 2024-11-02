import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import MessageInput from '../../components/MessageInput';

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
    <View style={styles.container}>
      <Text style={styles.header}>Conversa com {contactName}</Text>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
      />
      <MessageInput onSendMessage={handleSend} />
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
