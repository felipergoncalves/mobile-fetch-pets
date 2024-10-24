import createAxiosInstance from "../constants/axiosInstance";
import { supabase } from "../lib/supabase";

export const getUserData = async (userId) => {
    const axios = await createAxiosInstance();

    return await axios.get('/user/'+userId)
    .then(({data}) => {
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

export const resetPassword = async (email) => {
    const axios = await createAxiosInstance();

    return await axios.post('/auth/reset-password', {email})
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
        return {success: true};
    })
    .catch((error) => {
        return {success: false, msg: error.message};
    });
}