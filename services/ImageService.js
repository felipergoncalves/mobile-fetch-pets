import { decode } from 'base64-arraybuffer'
import * as FileSystem from 'expo-file-system'
import { createSupabaseClient } from '../constants/supabaseInstance'
import { supabaseUrl } from '../constants'

// export const uploadFile = async (folderName, fileUri, isImage=true)=>{
//     try{
//         let fileName = getFilePath(folderName, isImage);
//         const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
//             encoding: FileSystem.EncodingType.Base64
//         });
//         let imageData = decode(fileBase64); //array buffer
//         let {data, error} = await supabase
//         .storage
//         .from('uploads')
//         .upload(fileName, imageData, {
//             cacheControl: '3600',
//             upsert: false,
//             contentType: isImage ? 'image/*':'video/*'
//         });
//         if(error){
//             console.log('File upload error: ', error);
//             return {success: false, msg: 'Não foi possível atualizar a imagem'}
//         }

//         return {success: true, data: data.path}

//     }catch(error){
//         console.log('File upload error: ', error);
//         return {success: false, msg: 'Não foi possível atualizar a imagem'}
//     }
// }

export const uploadImage = async (image, filePath, token) => {
    const supabase = createSupabaseClient(token);

    const { name, uri, type } = image;

    const fileBase64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64
    })

    const imageData = decode(fileBase64); // array buffer

    const path = `${filePath}/${name}`

    // Upload image to Supabase
    const {error } = await supabase.storage.from('uploads').upload(path, imageData, {
        contentType: `image/${type.split('/')[1]}`,
    })    

    // Retorna erro se houver.
    if (error) {
        return { success: false, msg: error.message };
    }

    // Pegando a URL publica
    const { data: publicUrlData, error: publicUrlError } = supabase.storage.from('uploads').getPublicUrl(path)

    if (publicUrlError) {
        return { success: false, msg: publicUrlError.message };
    }

    const publicUrl = publicUrlData.publicUrl

    return { success: true, data: publicUrl }
}

export const deleteImage = async (filePath, token) => {
    const supabase = createSupabaseClient(token);

    // Extract the file path from the public URL
    const filePathParts = filePath.split('/');
    const fileName = filePathParts.slice(-2).join('/');

    const { error } = await supabase.storage.from('uploads').remove([fileName]);

    if (error) {
        return { success: false, msg: error.message };
    }

    return { success: true, msg: 'Imagem deletada com sucesso' };
}

export const getFilePath = (folderName, isImage)=>{
    return `/${folderName}/${(new Date()).getTime()}${isImage? '.png': '.mp4'}`;
}