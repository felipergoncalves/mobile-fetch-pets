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

const ChatList = () => {
    const { user } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const supabase = createSupabaseClient(user.token);

    // Função para buscar as conversas iniciais
    const fetchConversations = async () => {
        try {
            setLoading(true);
            console.log("user.id: ", user.user.id);
            const response = await MessageService.getConversations(user.user.id);
            console.log("Conversations:", response.data);
            setConversations(response.data);
        } catch (error) {
            console.error("Erro ao buscar conversas:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const supabase = createSupabaseClient(user.token);
        fetchConversations();
    }, [user.token]);

    const renderItem = ({ item }) => (
        <Pressable
            onPress={() =>
                router.push({
                    pathname: '/(main)/chatScreen',
                    params: { userId: user.user.id, chatId: item.chat_id, contactId: item.contactId, contactName: item.contactName },
                })
            }
            style={{ padding: 15, flexDirection: "row", gap: 10 }}
        >
            <Avatar />
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
