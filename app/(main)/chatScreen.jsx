import React, { useEffect, useState, useRef } from "react";
import { View, Text, FlatList, StyleSheet, Alert, Modal, ScrollView, Button, TouchableOpacity, Image } from "react-native";
import MessageInput from "../../components/MessageInput";
import ScreenWrapper from "../../components/ScreenWrapper";
import Header from "../../components/Header";
import { wp, hp } from "../../helpers/common";
import { theme } from "../../constants/theme";
import Icon from "../../assets/icons";
import { useRoute } from "@react-navigation/native";
import { MessageService } from "../../services/MessageService";
import { createSupabaseClient } from "../../constants/supabaseInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../contexts/AuthContext";
import { adoptPet, fetchMyPetsToAdopt, fetchMyPosts } from "../../services/postService";
import { NotificationService } from "../../services/notificationsService";
import LottieView from 'lottie-react-native'; // Importando Lottie

const ChatScreen = () => {
    const { user } = useAuth();
    const route = useRoute();
    const token = AsyncStorage.getItem('@auth_token');
    const { userId, chatId, contactId, contactName, preMessage } = route.params || {};
    const [messages, setMessages] = useState([]);
    const [groupedMessages, setGroupedMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [canDonate, setCanDonate] = useState(false);
    const flatListRef = useRef(null);
    const [hasMore, setHasMore] = useState(true); // Indica se há mais mensagens para carregar
    const [page, setPage] = useState(1); // Página atual
    const pageSize = 50; // Quantidade de mensagens por página
    const [isDonationSuccess, setDonationSuccess] = useState(false);
    const animationRef = useRef(null); // Ref para a animação
    const supabase = createSupabaseClient(token);

    // Estado do modal
    const [isModalVisible, setModalVisible] = useState(false);
    const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
    const [posts, setPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);

    cancelAction = () => {
        setSelectedPost(null);
        setModalVisible(false);
    }

    const fetchMessages = async (isInitialLoad = false) => {
        // if (loading || !hasMore) return;

        try {
            setLoading(true);

            const offset = (page - 1) * pageSize; // Calcula o offset baseado na página atual
            const response = await MessageService.getMessages(chatId, { limit: pageSize, offset });

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

    const fetchUserPosts = async () => {
        const response = await fetchMyPetsToAdopt(userId);
        if(response.success && response.result.length > 0){
            setCanDonate(true);
        }else{
            setCanDonate(false);
        }
    }

    useEffect(() => {
        fetchUserPosts();
    }, []);

    useEffect(() => {
        if (chatId) {
            fetchMessages(true); // Carrega a primeira página
        }
    }, [chatId]);

    const handleOpenModal = async () => {
        try {
            const response = await fetchMyPetsToAdopt(userId);
            if (response.success) {
                setPosts(response.result);
                setModalVisible(true);
            } else {
                Alert.alert("Erro", "Não foi possível carregar os posts.");
            }
        } catch (error) {
            Alert.alert("Erro", "Erro ao buscar posts do usuário.");
        }
    };

    const handleSelectPost = (postId) => {
        setSelectedPost(postId);
    };

    const donatePet = async(postId, adopterId) => {
        try {
            const response = await adoptPet(postId, adopterId);
            if (response.success) {
                setSelectedPost(null);
                setModalVisible(false);
                setDonationSuccess(true);
                setSuccessModalVisible(true); // Exibe o modal após sucesso
                setTimeout(() => {
                    setSuccessModalVisible(false); // Fecha o modal após 2 segundos
                }, 2000);

            } else {
                Alert.alert("Erro", "Não foi possível carregar os posts.");
            }
        } catch (error) {
            Alert.alert("Erro", "Erro ao buscar posts do usuário.");
        }
    }

    const handleDonate = () => {
        // Alert.alert("Doação", `Post ${selectedPost} selecionado para doação.`);
        donatePet(selectedPost, contactId);
    };

    const renderPostItem = ({ item }) => (
        <TouchableOpacity
            style={styles.postItem}
            onPress={() => handleSelectPost(item.id)}
        >
            <View style={styles.radioButtonContainer}>
                <View style={selectedPost === item.id ? styles.radioSelected : styles.radio} />
            </View>
            <View style={{flexDirection: "row", alignItems: "center", gap: 10}}>
                <Image
                    source={{uri: `${item?.image}`}}
                    transition={100}
                    style={{height: hp(8),
                        width: "30%",
                        alignSelf: "start",
                        zIndex: 3,
                        resizeMode: 'contain',
                        borderRadius: theme.radius.sm}}
                    contentFit='cover'
                />
                <View>
                    <Text style={[styles.postText, {fontWeight: 'bold'}]}>{item.pet_name}</Text>
                    <Text style={styles.postText}>{`${item.sex} | ${item.age} ${item.age === 1 ? 'ano' : 'anos'}`}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    useEffect(() => {
        const channel = supabase
            .channel('messages')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `chat_id=eq.${chatId}`
                },
                (payload) => {

                    if (payload.new) {
                        // Atualize o estado de forma segura
                        setMessages((prevMessages) => {
                            const updatedMessages = [...prevMessages];

                            // Evita duplicatas (confirme que o ID da mensagem é único)
                            if (!prevMessages.some((msg) => msg.id === payload.new.id)) {
                                updatedMessages.push(payload.new);
                            }

                            setGroupedMessages(groupMessagesByDate(updatedMessages));
                            return updatedMessages;
                        });


                        setTimeout(() => {
                            flatListRef.current?.scrollToEnd({ animated: true });
                        }, 100);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
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

        // Certifique-se de ordenar as mensagens dentro de cada grupo
        Object.values(grouped).forEach((msgs) => msgs.sort((a, b) => new Date(a.created_at) - new Date(b.created_at)));

        return Object.entries(grouped).map(([date, msgs]) => ({ date, messages: msgs }));
    };

    const handleSend = async (content) => {
        try {
            if (!content) return;

            // Envia a mensagem
            await MessageService.sendMessage(userId, contactId, content);
            await handleSendNotification();
        } catch (error) {
            Alert.alert("Erro", "Erro ao enviar mensagem.");
        } finally {
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    };

    const handleSendNotification = async () => {
        // Envia notificação
        const notification = {
            senderId: userId,
            receiverId: contactId,
            title: "Nova mensagem recebida",
            data: JSON.stringify({ chatId: chatId, type: "Chat" }),
        }

        await NotificationService.createNotification(notification);
    }


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
                            {canDonate && (
                            <Icon
                                name="threeDotsVertical"
                                color={theme.colors.dark}
                                onPress={handleOpenModal} // Placeholder
                            />
                        )}
                        </View>
                    </View>

                    <FlatList
                        ref={flatListRef}
                        data={groupedMessages}
                        keyExtractor={(item) => `group-${item.date}`}
                        renderItem={renderGroupedMessages}
                        onEndReached={handleLoadMore}
                        onEndReachedThreshold={0.1}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        initialNumToRender={10}
                        maxToRenderPerBatch={5}
                        windowSize={5}
                        removeClippedSubviews={true}
                    />
                </View>
            </ScreenWrapper>

            <View style={{ backgroundColor: "#fcfcfc", paddingVertical: wp(4) }}>
                <MessageInput onSendMessage={(content) => handleSend(content)} preMessage={preMessage} />
            </View>

            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Selecione um pet que deseja doar</Text>
                    <Text style={[styles.modalTitle, {position: "relative", bottom: 10}]}>para o {contactName} 😃</Text>
                    <ScrollView style={styles.postList}>
                        {posts.map((post) => (
                            <View key={post.id}>{renderPostItem({ item: post })}</View>
                        ))}
                    </ScrollView>
                    <View style={{flexDirection: "row", width: "80%", justifyContent: "flex-end", gap: 10, backgroundColor: "#fff", borderTopColor: "#f0f0f0", borderTopWidth: 2, padding: 10, borderBottomLeftRadius: 10, borderBottomRightRadius: 10}}>
                        <TouchableOpacity 
                            onPress={cancelAction}
                            style={[styles.cancelButton]}
                        >
                            <Text style={[styles.cancelButtonText]}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={handleDonate}
                            disabled={!selectedPost}
                            style={[styles.button, !selectedPost && styles.buttonDisabled]}
                        >
                            <Text style={[styles.buttonText, !selectedPost && styles.buttonTextDisabled]}>Realizar doação</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal
                visible={isSuccessModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setSuccessModalVisible(false)}
            >
                <View style={styles.successModalContainer}>
                    {isDonationSuccess && (
                        <View style={styles.successModalContent}>
                            <LottieView
                                ref={animationRef}
                                source={require('../../assets/animation/success_checkmark.json')} // Caminho para o arquivo de animação Lottie
                                autoPlay
                                loop={false}
                                speed={1}
                                style={{width: 200, height: 200}}
                            />
                            <Text style={styles.successText}>Pet doado com sucesso!</Text>
                        </View>
                    )}
                </View>
            </Modal>
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
    postItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    radioButtonContainer: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#000",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },
    radio: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#fff",
    },
    radioSelected: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#000",
    },
    postText: {
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#fff",
    },
    postList: {
        width: "80%",
        maxHeight: "60%",
        backgroundColor: "#fff",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        padding: 10,
    },
    button: {
        backgroundColor: theme.colors.primary, // Cor de fundo
        paddingVertical: 10, // Espaçamento vertical
        paddingHorizontal: 20, // Espaçamento horizontal
        borderRadius: 5, // Bordas arredondadas
        alignItems: 'center', // Alinhamento do conteúdo
      },
      buttonText: {
        color: '#fff', // Cor do texto
        fontSize: 16, // Tamanho da fonte
        fontWeight: 'bold', // Peso da fonte
      },
    cancelButton: {
        backgroundColor: '#f0f0f0', // Cor de fundo
        paddingVertical: 10, // Espaçamento vertical
        paddingHorizontal: 20, // Espaçamento horizontal
        borderRadius: 5, // Bordas arredondadas
        alignItems: 'center', // Alinhamento do conteúdo
      },
      cancelButtonText: {
        color: '#646464', // Cor do texto
        fontSize: 16, // Tamanho da fonte
        fontWeight: 'bold', // Peso da fonte
      },
      buttonDisabled: {
        backgroundColor: '#60aef3', // Cor de fundo quando desabilitado
      },
      buttonTextDisabled: {
        color: '#dfdfdf', // Cor do texto quando desabilitado
      },
      successModalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    successModalContent: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    successText: {
        marginTop: 20,
        fontSize: 18,
        color: theme.colors.success,
        fontWeight: 'bold',
    },
});

export default ChatScreen;


