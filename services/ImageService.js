import { decode } from 'base64-arraybuffer'
import * as FileSystem from 'expo-file-system'
import { createSupabaseClient } from '../constants/supabaseInstance'

export const uploadImage = async (image, filePath, token) => {
    const supabase = createSupabaseClient(token);

    const { uri, type, name } = image;

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