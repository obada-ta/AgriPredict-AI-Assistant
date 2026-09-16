// lib/axios.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// استخدم عنوان IP حقيقي بدلاً من localhost
const BASE_URL = 'http://10.210.178.156:3000'; // استبدل بعنوان IP خادمك
// const BASE_URL = 'http://localhost:3000'

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 ثواني
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor لإضافة التوكن
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.log('Error getting token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor للتعامل مع الأخطاء
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log('API Error:', error);

    if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
      throw new Error('تعذر الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت');
    }

    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user_data');
    }

    return Promise.reject(error);
  }
);