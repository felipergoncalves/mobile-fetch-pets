import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

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
      <Button title="Enviar" onPress={handleSend} />
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
    borderColor: '#ccc', 
    borderWidth: 1, 
    padding: 10, 
    borderRadius: 20, 
    marginRight: 10 
  },
});

export default MessageInput;
