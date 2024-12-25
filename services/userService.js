import createAxiosInstance from "../constants/axiosInstance";
import { uploadImage } from "./ImageService";

export const getUserData = async (userId) => {
    const axios = await createAxiosInstance();

    return await axios.get('/user/'+userId)
    .then(({data}) => {
        console.log(data)
        return {success: true, data};
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

export const updateUser = async (userId, data)=>{
    try{
        const {error} = await supabase
        .from('users')
        .update(data)
        .eq('id', userId);

        if(error){
            return {success: false, msg: error.message};
        }else{
            return {success: true, data};
        }
    }catch(error){
        console.log("Got error: ", error);
        return {success: false, msg: error.message};
    }
}

export const signUp = async (data) => {
    const axios = await createAxiosInstance();
    console.log('[UserService] signUp');	

    const formData = new FormData();

    formData.append('birthDate', data.birthDate.toISOString());

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
    const {data:imageUpdated ,error} = await uploadImage(data.image, 'profiles', res.data.token);

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