import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api'; 
export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData);
        return response.data; // إرجاع البيانات المستلمة
    } catch (error) {
        throw error; // التعامل مع الأخطاء
    }
};

export const loginUser = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/login`, credentials);
        return response.data; 
    } catch (error) {
        throw error; 
    }
};