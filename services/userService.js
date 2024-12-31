import createAxiosInstance from "../constants/axiosInstance";
import { normalizeToDDMMYYYY } from "../helpers/common";
import { deleteImage, uploadImage, verifyImage } from "./ImageService";

export const getUserData = async (userId) => {
    const axios = await createAxiosInstance();

    return await axios.get('/users/'+userId)
    .then(({data}) => {
        result = data.user
        return {success: true, result, data};
    })
    .catch((error) => {
        return {success: false, msg: error.message};
    });
}

export const logout = async () => {
    const axios = await createAxiosInstance();

    return await axios.post('/auth/logout')
    .then(({data}) => {
        return {success: true};
    })
    .catch((error) => {
        return {success: false};
    });
}

export const updateUser = async (newUser, oldImagePath, image, token) =>{
    const axios = await createAxiosInstance();
    let canUploadImage = false;

    console.log('Verificando imagem...')
    console.log(oldImagePath)

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

    const formData = new FormData();
    const bithDate = normalizeToDDMMYYYY(newUser.birthDate);
    console.log(newUser.birthDate);
    formData.append('birthDate', bithDate);

    // Adicionando outros campos
    for (const key in newUser) {
        if (newUser.hasOwnProperty(key) && key !== 'birthDate') {
            formData.append(key, newUser[key]);
        }
    }

    return await axios.put('/auth/update', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    })
    .then(({data}) => {
        return {success: true};
    })
    .catch((error) => {
        return {success: false, msg: error.message};
    });
}

export const signUp = async (data, image) => {
    const axios = await createAxiosInstance();

    const formData = new FormData();

    formData.append('birthDate', data.birthDate);

    // Adicionando outros campos
    for (const key in data) {
        if (data.hasOwnProperty(key) && key !== 'image' && key !== 'birthDate') {
            formData.append(key, data[key]);
        }
    }

    // Enviando requisição - Cadastro
    const res =  await axios.post('/auth/signup', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    if (res.data.error) {
        return {success: false, msg: res.data.error.message};
    }

    // Envia a Imagem para o supabase
    const {data:imageUpdated ,error} = await uploadImage(image, 'profiles', res.data.token);

    if (error) {
        return {success: false, msg: error.message};
    }
    console.log('Salvando no banco...')
    // Salvar no banco a referencia da imagem
    return await axios.post('/auth/save-image', {token: res.data.token, image: imageUpdated, uid: res.data.user.id})
    .then(({data}) => {
        return { success: true };
    })
    .catch((error) => {
        return {success: false, msg: error.message};
    });

}

export const sendResetPassword = async (email) => {
    const axios = await createAxiosInstance();

    return await axios.post('/auth/send-email-password', {email})
    .then(({data}) => {
        return {success: true};
    })
    .catch((error) => {
        return {success: false, msg: error.message};
    });
}

export const resetPassword = async (email, password, user) => {
    const axios = await createAxiosInstance();

    return await axios.post('/auth/reset-password', {email, password, user})
    .then(({data}) => {
        return {success: true};
    })
    .catch((error) => {
        return {success: false, msg: error.message};
    });
}

export const verifyCode = async (email, code) => {
    const axios = await createAxiosInstance();

    return await axios.post('/auth/verify-token', {email, token: code})
    .then(({data}) => {
        return {success: true, user: data.data.session};
    })
    .catch((error) => {
        return {success: false, msg: error.message};
    });
}

export const getAdressInformation = async (cep) => {
    const axios = await createAxiosInstance();

    return await axios.get('https://viacep.com.br/ws/'+cep+'/json/')
    .then(({data}) => {
        return {success: true, data};
    })
    .catch((error) => {
        return {success: false, msg: error.message};
    });
}