import { supabase } from "../lib/supabase";
import { uploadFile } from "./ImageService";

export const createOrUpdatePost = async (post)=>{
    try{
        //upload image
        if(post.file && typeof post.file == 'object'){
            let isImage = post?.file?.type == 'image';
            let folderName = isImage? 'postImages' : 'postVideos'
            let fileResult = await uploadFile(folderName, post?.file?.uri, isImage);
            if(fileResult.success) post.file = fileResult.data;
            else{
                return fileResult;
            }
        }

        const {data, error} = await supabase
        .from('posts')
        .upsert({
            // id: pet.id, // id pode ser usado para atualização, se existir
            pet_name: post.petName,
            sex: post.sex,
            species: post.species,
            breed: post.breed,
            age: post.age,
            weight_kg: post.weight,
            health_status: post.healthStatus,
            behavior: post.behavior,
            special_preferences: post.specialPreferences,
            userId: post.userId, // ID do usuário que está cadastrando o post
            file: post.file, // URL da imagem após upload
            opt_in: post.isConfirmed
          })
        .select()
        .single();

        console.log("Post Values:", post);

        if(error){
            console.log("createPost error: ", error);
            return {success: false, msg: "Não foi possível criar seu post"}
        }

        return {success: true, data: data};
    }catch(error){
        console.log("createPost error: ", error);
        return {success: false, msg: "Não foi possível criar seu post"}
    }
}

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
    try {
      // Inicia a query básica
      let query = supabase
        .from('posts')
        .select(`
          *,
          user: users (id, name, image),
          postLikes (*),
          comments (count)
        `)
        .order('created_at', { ascending: false })
        // .limit(limit);
  
      // Adiciona o filtro de espécie, se necessário
      if (species) {
        query = query.eq('species', species);
      }
  
      const { data, error } = await query;
  
      if (error) {
        console.log("fetchPosts error: ", error);
        return { success: false, msg: "Não foi possível buscar as publicações" };
      }
  
      return { success: true, data: data };
    } catch (error) {
      console.log("fetchPosts error: ", error);
      return { success: false, msg: "Não foi possível buscar as publicações" };
    }
  };
  

export const createPostLike = async (postLike)=>{
    try{
        
        const {data, error} = await supabase
        .from('postLikes')
        .insert(postLike)
        .select()
        .single();

        if(error){
            console.log("postLike error: ", error);
            return {success: false, msg: "Não foi possível curtir a publicação"}
        }

        return {success: true, data: data};
    }catch(error){
        console.log("postLike error: ", error);
        return {success: false, msg: "Não foi possível curtir a publicação"}
    }
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
    try{
        const {data, error} = await supabase
        .from('posts')
        .select(`
            *,
            user: users (id, name, image),
            postLikes (*),
            comments(*, user: users(id, name, image))
        `)
        .eq('id', postId)
        .order("created_at", {ascending: false, foreignTable: 'comments'})
        .single();

        if(error){
            console.log("fetchPostsDetails error: ", error);
            return {success: false, msg: "Não foi possível buscar as publicações"}
        }

        return {success: true, data: data};
    }catch(error){
        console.log("fetchPostsDetails error: ", error);
        return {success: false, msg: "Não foi possível buscar as publicações"}
    }
}

export const createComment = async (comment)=>{
    try{
        
        const {data, error} = await supabase
        .from('comments')
        .insert(comment)
        .select()
        .single();

        if(error){
            console.log("comment error: ", error);
            return {success: false, msg: "Não foi possível comentar na publicação"}
        }

        return {success: true, data: data};
    }catch(error){
        console.log("comment error: ", error);
        return {success: false, msg: "Não foi possível comentar na publicação"}
    }
}

export const removeComment = async (commentId)=>{
    try{
        
        const {error} = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)

        if(error){
            console.log("removeComment error: ", error);
            return {success: false, msg: "Não foi possível remover o comentário"}
        }

        return {success: true, data: {commentId}};
    }catch(error){
        console.log("removeComment error: ", error);
        return {success: false, msg: "Não foi possível remover o comentário"}
    }
}

export const removePost = async (postId)=>{
    try{
        
        const {error} = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)

        if(error){
            console.log("removePost error: ", error);
            return {success: false, msg: "Não foi possível remover a publicação"}
        }

        return {success: true, data: {postId}};
    }catch(error){
        console.log("removePost error: ", error);
        return {success: false, msg: "Não foi possível remover a publicação"}
    }
}