import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import Icon from '../assets/icons';
import { theme } from '../constants/theme';
import { hp } from '../helpers/common';

const MessageInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);  // Envia a mensagem para o ChatScreen
      setMessage('');  // Limpa o campo de entrada de texto após enviar
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Digite uma mensagem"
        value={message}
        onChangeText={setMessage}
      />
      <View style={{backgroundColor: theme.colors.primary, padding: hp(1), borderRadius: 12}}>
        <Icon name="send" color={theme.colors.white} onPress={handleSend}/>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 10 
  },
  input: { 
    flex: 1, 
    backgroundColor: "#f3f6f6",
    // borderColor: '#ccc', 
    // borderWidth: 1, 
    paddingVertical: 10, 
    paddingHorizontal: 18, 
    borderRadius: 20, 
    marginRight: 10 
  },
});

export default MessageInput;
