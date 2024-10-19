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
        .upsert(post)
        .select()
        .single();

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

export const fetchPosts = async (limit=10, userId)=>{
    try{
        if(userId){
            const {data, error} = await supabase
            .from('posts')
            .select(`
                *,
                user: users (id, name, image),
                postLikes (*),
                comments (count)
            `)
            .order('created_at', {ascending: false})
            .eq('userId', userId)
            .limit(limit);

            if(error){
                console.log("fetchPosts error: ", error);
                return {success: false, msg: "Não foi possível buscar as publicações"}
            }

            return {success: true, data: data};
        }else{
            const {data, error} = await supabase
            .from('posts')
            .select(`
                *,
                user: users (id, name, image),
                postLikes (*),
                comments (count)
            `)
            .order('created_at', {ascending: false})
            .limit(limit);

            if(error){
                console.log("fetchPosts error: ", error);
                return {success: false, msg: "Não foi possível buscar as publicações"}
            }

            return {success: true, data: data};
        }
    }catch(error){
        console.log("fetchPosts error: ", error);
        return {success: false, msg: "Não foi possível buscar as publicações"}
    }
}

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