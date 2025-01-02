import createAxiosInstance from "../constants/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { deleteImage, uploadImage, verifyImage } from "./ImageService";

export const createPost = async (post, uid)=>{
    const axios = await createAxiosInstance();
    const token = await AsyncStorage.getItem('@auth_token');

    const image = {
        uri: post.file.uri,
        type: post.file.mimeType,
        name: post.file.fileName
    }

    // Realizando o Upload da Imagem no Supabase
    const { data: urlData, error:uploadImageError } = await uploadImage(image, 'postImages', token);
    if(uploadImageError){
        return {success: false, msg: "Erro ao fazer upload da imagem"};
    }
    // Remover a proriadade file do objeto post
    delete post.file;
    // Adicionando a URL da imagem no objeto post e o id do usuário
    post.image = urlData;
    post.userId = uid;
    // Enviando a req para o back-end
    return await axios.post('/posts', post)
        .then(({data}) => {
            return {success: true};
        })
        .catch((error) => {
            return {success: false, msg: error.message};
        })
}
export const updatepost = async (post, oldImagePath, image) => {
    const axios = await createAxiosInstance();
    const token = await AsyncStorage.getItem('@auth_token');

    let canUploadImage = false;

    if (!oldImagePath) canUploadImage = true;

    // Deletar imagem antiga
    if (oldImagePath && image) {
        const reqDeleteImage = await deleteImage(oldImagePath, token);

        if (!reqDeleteImage.success) {
            return {success: false, msg: reqDeleteImage.msg};
        }

        canUploadImage = true;
    }

    // Enviar nova imagem
    if (canUploadImage) {
        const reqUploadImage = await uploadImage(image, 'profiles', token);

        if (!reqUploadImage.success) {
            return {success: false, msg: reqUploadImage.msg};
        }

        newUser.image = reqUploadImage.data;
    }
};

export const fetchPosts = async (params) => {
    const axios = await createAxiosInstance();
    return await axios.get('/posts/', {params})
        .then(({data}) => {
            console.log("POSTS CHEGARAM: ", data.data)
            const result = data.data.filter(post => post.adopter === null);
            return {success: true, result};
        })
        .catch((error) => {
            return {success: false, msg: error.message};
        });
};

export const createPostLike = async (postLike)=>{
    const axios = await createAxiosInstance();

    return await axios.post('/favorites/')
        .then(({data}) => {
            result = data.data;
            return {success: true, result};
        })
        .catch((error) => {
            return {success: false, msg: error.message};
        });
}

export const getPostLikes = async (postId)=>{
    const axios = await createAxiosInstance();

    return await axios.get(`/favorites/${postId}`)
        .then(({data}) => {
            console.log("RESULTADO DOS LIKES: ", data);
            result = data.data;
            return {success: true, result};
        })
        .catch((error) => {
            return {success: false, msg: error.message};
        });
}

export const removePostLike = async (postId, userId)=>{
    try{

        const {error} = await supabase
            .from('postLikes')
            .delete()
            .eq('userId', userId)
            .eq('postId', postId)

        if(error){
            console.log("postLike error: ", error);
            return {success: false, msg: "Não foi possível remover a curtida da publicação"}
        }

        return {success: true};
    }catch(error){
        console.log("postLike error: ", error);
        return {success: false, msg: "Não foi possível remover a curtida da publicação"}
    }
}

export const fetchPostDetails = async (postId)=>{
    const axios = await createAxiosInstance();

    return await axios.get(`/posts/${postId}`)
        .then(({data}) => {
            result = data.data;
            return {success: true, result};
        })
        .catch((error) => {
            return {success: false, msg: error.message};
        });
}

export const removePost = async (postId)=>{
    const axios = await createAxiosInstance();

    return await axios.delete(`/posts/${postId}`)
        .then(({data}) => {
            return {success: true};
        })
        .catch((error) => {
            return {success: false, msg: error.message};
        });
}

export const fetchMyPosts = async (userId) => {
    const axios = await createAxiosInstance();

    return await axios.get(`/posts/user/${userId}`)
        .then(({data}) => {
            result = Array.isArray(data.data) ? data.data : [];
            return {success: true, result};
        })
        .catch((error) => {
            return {success: false, msg: error.message};
        });
}

export const fetchMyAdoptedPets = async (userId) => {
    const axios = await createAxiosInstance();

    return await axios.get(`/posts/adopted/${userId}`)
        .then(({data}) => {
            result = Array.isArray(data.data) ? data.data : [];
            console.log("Resultado dos pets adotados: ", result);
            return {success: true, result};
        })
        .catch((error) => {
            console.log("Deu ruim aqui em")
            return {success: false, msg: error.message};
        });
}