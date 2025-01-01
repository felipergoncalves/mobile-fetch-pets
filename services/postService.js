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
// export const fetchPosts = async (limit=10, userId, species=null)=>{
//     try{
//         if(userId){
//             const {data, error} = await supabase
//             .from('posts')
//             .select(`
//                 *,
//                 user: users (id, name, image),
//                 postLikes (*),
//                 comments (count)
//             `)
//             .order('created_at', {ascending: false})
//             .eq('userId', userId)
//             .limit(limit);

//             // Se o filtro de species for passado, adicionar o filtro de espécie
//             if (species) {
//                 query = query.eq('species', species);
//             }

//             if(error){
//                 console.log("fetchPosts error: ", error);
//                 return {success: false, msg: "Não foi possível buscar as publicações"}
//             }

//             return {success: true, data: data};
//         }else{
//             const {data, error} = await supabase
//             .from('posts')
//             .select(`
//                 *,
//                 user: users (id, name, image),
//                 postLikes (*),
//                 comments (count)
//             `)
//             .order('created_at', {ascending: false})
//             .limit(limit);

//             if(error){
//                 console.log("fetchPosts error: ", error);
//                 return {success: false, msg: "Não foi possível buscar as publicações"}
//             }

//             return {success: true, data: data};
//         }
//     }catch(error){
//         console.log("fetchPosts error: ", error);
//         return {success: false, msg: "Não foi possível buscar as publicações"}
//     }
// }

export const fetchPosts = async (limit = 10, species = null) => {
    const axios = await createAxiosInstance();
    
    return await axios.get('/posts/')
    .then(({data}) => {
        // console.log("POSTS CHEGARAM: ", data.data)
        result = data.data;
        return {success: true, result};
    })
    .catch((error) => {
        return {success: false, msg: error.message};
    });

    // try {
    //   // Inicia a query básica
    //   let query = supabase
    //     .from('posts')
    //     .select(`
    //       *,
    //       user: users (id, name, image),
    //       postLikes (*),
    //       comments (count)
    //     `)
    //     .order('created_at', { ascending: false })
    //     // .limit(limit);
  
    //   // Adiciona o filtro de espécie, se necessário
    //   if (species) {
    //     query = query.eq('species', species);
    //   }
  
    //   const { data, error } = await query;
  
    //   if (error) {
    //     console.log("fetchPosts error: ", error);
    //     return { success: false, msg: "Não foi possível buscar as publicações" };
    //   }
  
    //   return { success: true, data: data };
    // } catch (error) {
    //   console.log("fetchPosts error: ", error);
    //   return { success: false, msg: "Não foi possível buscar as publicações" };
    // }
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
    // try{
    //     const {data, error} = await supabase
    //     .from('posts')
    //     .select(`
    //         *,
    //         user: users (id, name, image),
    //         postLikes (*),
    //         comments(*, user: users(id, name, image))
    //     `)
    //     .eq('id', postId)
    //     .order("created_at", {ascending: false, foreignTable: 'comments'})
    //     .single();

    //     if(error){
    //         console.log("fetchPostsDetails error: ", error);
    //         return {success: false, msg: "Não foi possível buscar as publicações"}
    //     }

    //     return {success: true, data: data};
    // }catch(error){
    //     console.log("fetchPostsDetails error: ", error);
    //     return {success: false, msg: "Não foi possível buscar as publicações"}
    // }
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