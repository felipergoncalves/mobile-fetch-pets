import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    View,
    Image,
    ActivityIndicator,
    TouchableOpacity
} from 'react-native';
import React, { useEffect, useState } from 'react';
import ScreenWrapper from '../../components/ScreenWrapper';
import { hp, wp } from '../../helpers/common';
import { theme } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'expo-router';
import Navigator from '../../components/Navigator';
import { fetchFavoritesPets, fetchPostDetails } from '../../services/postService';

const Favorites = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const loadPosts = async () => {
            setLoading(true);
            const result = await fetchFavoritesPets(user.id);
            if (result.success) {
                const favorites = result.result;

                // Fazendo requisições simultâneas para buscar os detalhes dos posts
                const postDetailsPromises = favorites.map((fav) => fetchPostDetails(fav.postId));
                const postsResult = await Promise.all(postDetailsPromises);

                // Filtrando apenas os posts que tiveram sucesso na requisição
                const validPosts = postsResult
                    .filter((res) => res.success)
                    .map((res) => res.result);

                setPosts(validPosts);
            } else {
                Alert.alert('Erro', 'Não foi possível carregar seus posts.');
            }
            setLoading(false);
        };
        loadPosts();
    }, []);

    const openPostDetails = (postId)=>{
        router.push({pathname: 'postDetails', params:{postId: postId, currentUser: user}})
    }

    return (
        <View style={{ flex: 1 }}>
            <ScreenWrapper bg="white">
                <View style={styles.container}>
                    <ScrollView style={{ flex: 1 }}>
                        <Image
                            style={{ height: hp(10), width: '100%', alignSelf: 'center' }}
                            resizeMode="contain"
                            source={require('../../assets/images/favorites.png')}
                        />
                        {loading ? (
                            <ActivityIndicator size="large" color={theme.colors.primary} />
                        ) : posts.length > 0 ? (
                            <View style={styles.listContainer}>
                                {posts.map((item) => (
                                    <View key={item.id} style={styles.card}>
                                        <TouchableOpacity onPress={() => openPostDetails(item.id)}>
                                            <View style={{flexDirection: "row", alignItems: "center", gap: 10}}>
                                                <Image
                                                    source={{ uri: `${item?.image}` }}
                                                    style={styles.cardImage}
                                                    resizeMode="cover"
                                                />
                                                <View style={styles.cardContent}>
                                                    <Text style={{fontWeight: "bold"}}>{item.pet_name}</Text>
                                                    <Text style={styles.cardDescription}>
                                                    {`${item.sex} | ${item.age} ${item.age === 1 ? 'ano' : 'anos'}`}
                                                    </Text>
                                                </View>
                                            </View>
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
});

export default Favorites;
