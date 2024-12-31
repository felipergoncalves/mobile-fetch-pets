import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    View,
    Image,
    ActivityIndicator,
    TouchableOpacity,
    Modal,
    Pressable,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import ScreenWrapper from '../../components/ScreenWrapper';
import { hp, wp } from '../../helpers/common';
import { theme } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'expo-router';
import Navigator from '../../components/Navigator';
import { fetchMyPosts } from '../../services/postService';
import Icon from '../../assets/icons';

const PetsForAdoption = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);

    useEffect(() => {
        const loadPosts = async () => {
            setLoading(true);
            const result = await fetchMyPosts(user.user.id);
            if (result.success) {
                setPosts(result.result);
            } else {
                Alert.alert('Erro', 'Não foi possível carregar seus posts.');
            }
            setLoading(false);
        };
        loadPosts();
        console.log("PUBLICAÇÕES ESTÃO ASSIM: ", posts);
    }, []);

    const openOptions = (post) => {
        setSelectedPost(post);
        setIsModalVisible(true);
    };

    const closeOptions = () => {
        setIsModalVisible(false);
        setSelectedPost(null);
    };

    return (
        <View style={{ flex: 1 }}>
            <ScreenWrapper bg="white">
                <View style={styles.container}>
                    <ScrollView style={{ flex: 1 }}>
                        <Image
                            style={{ height: hp(10), width: '100%', alignSelf: 'center' }}
                            resizeMode="contain"
                            source={require('../../assets/images/yourPetsHeader.png')}
                        />
                        {loading ? (
                            <ActivityIndicator size="large" color={theme.colors.primary} />
                        ) : posts.length > 0 ? (
                            <View style={styles.listContainer}>
                                {posts.map((item) => (
                                    <View key={item.id} style={styles.card}>
                                        <View style={{flexDirection: "row", alignItems: "center", gap: 10}}>
                                            <Image
                                                source={{ uri: `${item?.image}` }}
                                                style={styles.cardImage}
                                                resizeMode="cover"
                                            />
                                            <View style={styles.cardContent}>
                                                <Text style={{fontWeight: "bold"}}>{item.pet_name}</Text>
                                                <Text style={styles.cardDescription}>{item.behavior}</Text>
                                            </View>
                                        </View>
                                        <TouchableOpacity onPress={() => openOptions(item)}>
                                            <Icon name="threeDotsVertical" size={hp(3.4)} strokeWidth={3} color={theme.colors.text} />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>
                        ) : (
                            <Text style={styles.noPostsText}>
                                Que pena! Parece que você ainda não possui posts cadastrados😢.
                            </Text>
                        )}
                    </ScrollView>
                </View>
            </ScreenWrapper>
            <Navigator user={user} />

            {/* Modal de opções */}
            <Modal
                transparent={true}
                visible={isModalVisible}
                animationType="fade"
                onRequestClose={closeOptions}
            >
                <Pressable style={styles.overlay} onPress={closeOptions}>
                    <View style={styles.modalContainer}>
                        <TouchableOpacity
                            style={styles.modalOption}
                            onPress={() => {
                                console.log("Editar post:", selectedPost);
                                closeOptions();
                            }}
                        >
                            <Icon name="edit" size={hp(3.4)} strokeWidth={3} color={theme.colors.text} />
                            <Text style={styles.modalOptionText}>Editar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.modalOption}
                            onPress={() => {
                                console.log("Excluir post:", selectedPost);
                                closeOptions();
                            }}
                        >
                            <Icon name="delete" size={hp(3.4)} strokeWidth={3} color={theme.colors.text} />
                            <Text style={styles.modalOptionText}>Excluir</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>

        </View>
    );
    
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: wp(4),
    },
    listStyle: {
        flexGrow: 1,
    },
    noPostsText: {
        textAlign: 'center',
        fontSize: hp(2),
        color: theme.colors.dark,
        marginTop: 300,
    },
    listContainer: {
        backgroundColor: "white"
    },
    card: {
        width: "100%",
        borderRadius: theme.radius.sm,
        backgroundColor: "white",
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: hp(1),
        paddingHorizontal: hp(2),
        borderRadius: theme.radius.xs,
        borderCurve: 'continuous',
        backgroundColor: 'white',
        borderWidth: 0.5,
        borderColor: theme.colors.gray,
        shadowColor: '#000',
        marginTop: 15
    },
    cardImage: {
        height: hp(8),
        width: "30%",
        alignSelf: "start",
        zIndex: 3,
        resizeMode: 'contain',
        borderRadius: theme.radius.sm
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: wp(80),
        backgroundColor: 'white',
        borderRadius: theme.radius.md,
        padding: wp(4),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: hp(1.5),
    },
    modalOptionText: {
        marginLeft: wp(2),
        fontSize: hp(2),
        color: theme.colors.text,
    },
});

export default PetsForAdoption;
