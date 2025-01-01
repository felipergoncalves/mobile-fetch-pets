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
import AsyncStorage from "@react-native-async-storage/async-storage";

const ChatScreen = () => {
    const route = useRoute();
    const token = AsyncStorage.getItem('@auth_token');
    const { userId, chatId, contactId, contactName } = route.params || {};
    const [messages, setMessages] = useState([]);
    const [groupedMessages, setGroupedMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const flatListRef = useRef(null);
    const [hasMore, setHasMore] = useState(true); // Indica se há mais mensagens para carregar
    const [page, setPage] = useState(1); // Página atual
    const pageSize = 50; // Quantidade de mensagens por página
    const supabase = createSupabaseClient(token);
    const users_ids = [userId, contactId];

    const fetchMessages = async (isInitialLoad = false) => {
        // if (loading || !hasMore) return;

        try {
            setMessages([]);
            setLoading(true);

            const offset = (page - 1) * pageSize; // Calcula o offset baseado na página atual
            const response = await MessageService.getMessages(chatId, { limit: pageSize, offset });

            console.log("Messages:", response.data);
            const messages = response.data || [];
            if (messages.length < pageSize) setHasMore(false);

            setMessages((prev) => (isInitialLoad ? messages : [...messages, ...prev]));

            const grouped = groupMessagesByDate(isInitialLoad ? messages : [...messages, ...messages]);
            setGroupedMessages(grouped);

            if (!isInitialLoad) setPage((prevPage) => prevPage + 1);
        } catch (error) {
            console.error("Erro no fetchMessages:", error); // Log detalhado para depuração
            Alert.alert("Erro", "Erro ao carregar mensagens.");
        } finally {
            setLoading(false);
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    };

    const handleLoadMore = async () => {
        if (!loading && hasMore) {
            await  fetchMessages();
        }
    };

    useEffect(() => {
        if (chatId) {
            fetchMessages(true); // Carrega a primeira página
        }
    }, [chatId]);

    // Realtime para múltiplos chats do usuário
    useEffect(() => {
        console.log("useEffect: chatId", chatId);
        const channel = supabase
            .channel(chatId)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `chat_id=eq.${chatId}`
                },
                (payload) => {
                    console.log("Channel: payload", payload);
                    fetchMessages();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [messages, setMessages, chatId]);


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
            await fetchMessages(true ); // Atualiza as mensagens
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
            key={item.id}
            style={item.sender_id === userId ? styles.myMessage : styles.otherMessage}
        >
            <Text style={item.sender_id === userId ? styles.myMessageText : styles.otherMessageText}>
                {item.content}
            </Text>
            <Text
                style={item.sender_id === userId ? styles.myTimestamp : styles.otherTimestamp}
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
        <View style={{width: "30%", backgroundColor: "rgba(234,234,234,0.57)", borderRadius: theme.radius.sm}}>
          <Text style={styles.dateHeaderText}>{date}</Text>
        </View>
      </View>
  );


    const renderGroupedMessages = ({ item }) => (
        <View key={`group-${item.date}`}>
            {renderDateHeader(item.date)}
            {item.messages.map((msg) => (
                <View key={msg.id}>{renderMessage({ item: msg })}</View>
            ))}
        </View>
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
                        keyExtractor={(item) => `group-${item.date}`}
                        renderItem={renderGroupedMessages}
                        onEndReached={handleLoadMore} // Chama ao atingir o topo
                        onEndReachedThreshold={0.1} // Quando 10% do topo for visível
                        contentContainerStyle={{ paddingBottom: 20 }}
                    />
                </View>
            </ScreenWrapper>

            <View style={{ backgroundColor: "#fcfcfc", paddingVertical: wp(4) }}>
                <MessageInput onSendMessage={(content) => handleSend(content)} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10 },
    header: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
    myMessage: {
        alignSelf: "flex-end",
        backgroundColor: theme.colors.primary,
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
    myMessageText: { fontSize: 16, color: "#FFF"},
    otherMessageText: { fontSize: 16, color: "#000"},
    myTimestamp: {
        fontSize: 12,
        color: "#e2e2e2",
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
        alignItems: "center",
        marginVertical: 10,
    },
    dateHeaderText: {
        fontSize: 14,
        color: "#555",
        fontWeight: "bold",
        textAlign: "center"
    },
});

export default ChatScreen;


