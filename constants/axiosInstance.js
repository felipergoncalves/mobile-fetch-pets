import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const createAxiosInstance = async () => {
    const token = await AsyncStorage.getItem('@auth_token');

    return axios.create({
        baseURL: 'http://192.168.0.108:3000',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    });
};

export default createAxiosInstance;