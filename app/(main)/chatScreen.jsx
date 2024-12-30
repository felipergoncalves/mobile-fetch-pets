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
import { createSupabaseClient } from "../../constants/supabaseInstance";
import {useAuth} from "../../contexts/AuthContext";

const ChatScreen = () => {
  const route = useRoute();
  const { user } = useAuth();
  const { userId, chatId, contactId, contactName } = route.params || {};
  const [messages, setMessages] = useState([]);
  const [groupedMessages, setGroupedMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef(null);
  const supabase = createSupabaseClient(user.token);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await MessageService.getMessages(chatId);
      const messages = response.data || [];
      setMessages(messages);

      // Agrupa as mensagens por data
      const grouped = groupMessagesByDate(messages);
      setGroupedMessages(grouped);
    } catch (error) {
      Alert.alert("Erro", "Erro ao carregar mensagens.");
    } finally {
      setLoading(false);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  useEffect(() => {
    if (chatId) {
      fetchMessages();
      const changes = supabase
          .channel(chatId)
          .on(
              "postgres_changes",
              {
                event: "INSERT",
                schema: "public",
                table: "messages",
              },
              (payload) => console.log("Message received: ", payload)
          )
          .subscribe();
    }
  }, [chatId]);

  const groupMessagesByDate = (messages) => {
    const grouped = {};
    messages.forEach((message) => {
      const date = new Date(message.created_at).toLocaleDateString("pt-BR");
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(message);
    });
    return Object.entries(grouped).map(([date, msgs]) => ({ date, messages: msgs }));
  };

  const handleSend = async (content) => {
    try {
      if (!content) return;
      await MessageService.sendMessage(userId, contactId, content); // Envia a mensagem
      fetchMessages(); // Atualiza as mensagens
    } catch (error) {
      Alert.alert("Erro", "Erro ao enviar mensagem.");
    } finally {
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
        <Text
            style={
              item.sender_id === userId
                  ? styles.myTimestamp
                  : styles.otherTimestamp
            }
        >
          {new Date(item.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
  );

  const renderDateHeader = (date) => (
      <View style={styles.dateHeader}>
        <Text style={styles.dateHeaderText}>{date}</Text>
      </View>
  );

  const renderGroupedMessages = ({ item }) => (
      <>
        {renderDateHeader(item.date)}
        {item.messages.map((msg) => renderMessage({ item: msg }))}
      </>
  );

  return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <ScreenWrapper>
          <View
              style={{
                flex: 1,
                paddingHorizontal: wp(4),
                paddingVertical: wp(4),
              }}
          >
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
                    onPress={() => Alert.alert("Menu", "Menu clicked")} // Placeholder
                />
              </View>
            </View>

            <FlatList
                ref={flatListRef}
                data={groupedMessages}
                keyExtractor={(item, index) => `${item.date}-${index}`}
                renderItem={renderGroupedMessages}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
          </View>
        </ScreenWrapper>

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
    maxWidth: wp(85),
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#ECECEC",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: wp(85),
  },
  messageText: { fontSize: 16 },
  myTimestamp: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
    textAlign: "right",
  },
  otherTimestamp: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
    textAlign: "left",
  },
  dateHeader: {
    width: "100%",
    alignItems: "center",
    marginVertical: 10,
    backgroundColor: "rgba(234,234,234,0.57)",
    borderRadius: 10,
  },
  dateHeaderText: {
    fontSize: 14,
    color: "#555",
    fontWeight: "bold",
  },
});

export default ChatScreen;

