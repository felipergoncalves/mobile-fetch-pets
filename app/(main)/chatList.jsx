import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, FlatList, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../../components/Header';
import { hp, wp } from '../../helpers/common';
import ScreenWrapper from '../../components/ScreenWrapper';
import Navigator from '../../components/Navigator';
import { useAuth } from '../../contexts/AuthContext';
import Avatar from '../../components/Avatar';
import { theme } from '../../constants/theme';
import { MessageService } from '../../services/MessageService';
import { createSupabaseClient } from '../../constants/supabaseInstance';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserData } from '../../services/userService';

const ChatList = () => {
    const { user } = useAuth();
    const token = AsyncStorage.getItem('@auth_token');
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const supabase = createSupabaseClient(token);

    // Função para buscar as conversas iniciais
    const fetchConversations = async () => {
        try {
            setLoading(true);
            const response = await MessageService.getConversations(user.id);
            console.log("Conversations:", response.data);
            const fetchedConversations = response.data;
            // setConversations(response.data);

            const conversationsWithImages = await Promise.all(
                fetchedConversations.map(async (conversation) => {
                    const contactData = await getUserData(conversation.contactId); // Busca os dados do contato
                    return {
                        ...conversation,
                        contactName: contactData.result.name, // Nome do contato
                        contactImage: contactData.result.image, // Imagem do contato
                    };
                })
            );
            setConversations(conversationsWithImages);
        } catch (error) {
            console.error("Erro ao buscar conversas:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConversations();
    }, [user.id]);

    // Adicionando Realtime para atualizar a lista de conversas
    useEffect(() => {
        console.log("Subscribing to Realtime for conversations");
        const channel = supabase
            .channel('messages')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'messages',
                },
                (payload) => {
                    console.log("Nova mensagem recebida via Realtime:", payload);

                    if (payload.new) {
                        const newMessage = payload.new;

                        // Atualize a lista de conversas
                        setConversations((prevConversations) => {
                            const updatedConversations = [...prevConversations];
                            const existingConversationIndex = updatedConversations.findIndex(
                                (conv) => conv.chat_id === newMessage.chat_id
                            );

                            if (existingConversationIndex !== -1) {
                                // Atualize a conversa existente
                                updatedConversations[existingConversationIndex] = {
                                    ...updatedConversations[existingConversationIndex],
                                    content: newMessage.content, // Atualize a última mensagem
                                };
                            } else {
                                // Adicione uma nova conversa
                                updatedConversations.push({
                                    chat_id: newMessage.chat_id,
                                    contactId: newMessage.sender_id === user.id ? newMessage.receiver_id : newMessage.sender_id,
                                    contactName: 'Novo Contato', // Você pode ajustar para buscar o nome do contato se necessário
                                    content: newMessage.content,
                                });
                            }

                            return updatedConversations;
                        });
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user.id]);

    const renderItem = ({ item }) => (
        <Pressable
            onPress={() =>
                router.push({
                    pathname: '/(main)/chatScreen',
                    params: { userId: user.id, chatId: item.chat_id, contactId: item.contactId, contactName: item.contactName },
                })
            }
            style={{ padding: 15, flexDirection: "row", gap: 10, backgroundColor: "#fafafa", borderRadius: theme.radius.md, marginBottom: 3}}
        >
            <Avatar
                size={hp(4.5)}
                uri={item.contactImage}
                rounded={theme.radius.xxl*5}
                style={{ width: 50, height: 50, marginRight: 10 }}
            />
            <View>
                <Text style={{ fontSize: hp(2.3), fontWeight: theme.fonts.medium }}>
                    {item.contactName}
                </Text>
                <Text style={{ fontSize: hp(1.7), color: theme.colors.text }}>
                    {item.content}
                </Text>
            </View>
        </Pressable>
    );

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <ScreenWrapper>
                <View style={{ paddingHorizontal: wp(4) }}>
                    <View>
                        <Header title="Conversas" mb={30} />
                    </View>
                    <FlatList
                        data={conversations}
                        keyExtractor={(item) => item.chat_id.toString()}
                        renderItem={renderItem}
                        ListEmptyComponent={
                            <Text style={{ textAlign: 'center', color: theme.colors.text }}>
                                Nenhuma conversa encontrada.
                            </Text>
                        }
                    />
                </View>
            </ScreenWrapper>
            <Navigator user={user} />
        </View>
    );
};

export default ChatList;
