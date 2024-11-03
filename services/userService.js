import createAxiosInstance from "../constants/axiosInstance";
import { supabase } from "../lib/supabase";

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

    const formData = new FormData();

    if (data.image) {
        formData.append('image', JSON.parse(JSON.stringify(data.image)));
    }

    formData.append('birthDate', data.birthDate.toISOString());

    // Adicionando outros campos
    for (const key in data) {
        if (data.hasOwnProperty(key) && key !== 'image' && key !== 'birthDate') {
            formData.append(key, data[key]);
        }
    }

    return await axios.post('/auth/signup', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
    .then(({ data }) => {
        return { success: true };
    })
    .catch((error) => {
        console.error("Erro ao enviar a requisição:", error);
        return { success: false, msg: error.message };
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