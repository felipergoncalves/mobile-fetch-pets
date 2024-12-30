import React, { useEffect, useState, useRef } from "react";
import { View, Text, FlatList, StyleSheet, Alert } from "react-native";
import MessageInput from "../../components/MessageInput";
import ScreenWrapper from "../../components/ScreenWrapper";
import Header from "../../components/Header";
import { wp } from "../../helpers/common";
import { theme } from "../../constants/theme";
import Icon from "../../assets/icons";
import { useRoute } from "@react-navigation/native";
import { MessageService } from "../../services/MessageService";

const ChatScreen = () => {
  const route = useRoute();
  const { userId, chatId, contactId, contactName } = route.params || {};
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const flatListRef = useRef(null); // Referência para o FlatList

  /**
   * Função para buscar mensagens do chat.
   */
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await MessageService.getMessages(chatId); // Busca mensagens do backend
      console.log("Mensagens carregadas:", response);

      // Atualiza o estado apenas com o array `message`
      setMessages(response.data || []);
    } catch (error) {
      Alert.alert("Erro", "Erro ao carregar mensagens.");
    } finally {
      setLoading(false);

      // Rola para o final automaticamente após carregar
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  useEffect(() => {
    if (chatId) {
      fetchMessages();
    }
  }, [chatId]);

  /**
   * Função para enviar uma mensagem.
   * @param content - Conteúdo da mensagem
   */
  const handleSend = async (content) => {
    try {
      if (!content) return;
      await MessageService.sendMessage(userId, contactId, content); // Envia a mensagem
      fetchMessages(); // Atualiza as mensagens
    } catch (error) {
      Alert.alert("Erro", "Erro ao enviar mensagem.");
    } finally {
      // Rola para o final quando uma nova mensagem é enviada
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const renderMessage = ({ item }) => (
      <View
          style={
            item.sender_id === userId ? styles.myMessage : styles.otherMessage
          }
      >
        <Text style={styles.messageText}>{item.content}</Text>
        <Text style={item.sender_id === userId ? styles.myTimestamp : styles.otherTimestamp}>
          {new Date(item.created_at).toLocaleDateString('pt-BR')}{" "}
          {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
  );

  return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <ScreenWrapper>
          <View style={{ flex: 1, paddingHorizontal: wp(4), paddingVertical: wp(4) }}>
            {/* Header */}
            <View style={{ display: "flex", flexDirection: "row" }}>
              <View style={{ width: "90%" }}>
                <Header title={contactName} mb={30} />
              </View>
              <View
                  style={{
                    width: "10%",
                    alignItems: "flex-end",
                    justifyContent: "center",
                    height: 30,
                    marginTop: 5,
                  }}
              >
                <Icon
                    name="threeDotsVertical"
                    color={theme.colors.dark}
                    onPress={handleSend}
                />
              </View>
            </View>

            {/* Mensagens */}
            <FlatList
                ref={flatListRef} // Adiciona referência ao FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={renderMessage}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
          </View>
        </ScreenWrapper>

        {/* Input de Mensagens */}
        <View style={{ backgroundColor: "#fcfcfc", paddingVertical: wp(4) }}>
          <MessageInput onSendMessage={handleSend} />
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  header: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C5",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#ECECEC",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  messageText: { fontSize: 16 },
  myTimestamp: { fontSize: 12, color: "#888", marginTop: 5, textAlign: "right" },
  otherTimestamp: { fontSize: 12, color: "#888", marginTop: 5, textAlign: "left" },
});

export default ChatScreen;
