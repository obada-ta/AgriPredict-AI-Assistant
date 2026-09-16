// // hooks/useAuth.ts
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import { useAuth } from '@/stores/auth';
// import { api } from '@/lib/axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { router } from 'expo-router';

// interface LoginData {
//   email: string;
//   password: string;
// }

// interface RegisterData {
//   name: string;
//   email: string;
//   password: string;
//   role?: string;
// }

// interface AuthResponse {
//   message: string;
//   token: string;
//   user: {
//     id: string;
//     name: string;
//     email: string;
//     role: string;
//   };
// }

// // دالة تسجيل الدخول
// const loginUser = async (data: LoginData): Promise<AuthResponse> => {
//   const response = await api.post('/api/auth/login', data);
//   // const response = await axios.post('http://192.168.105.130:3000/api/auth/login', data);

//   return response.data;
// };

// // دالة التسجيل
// const registerUser = async (data: RegisterData): Promise<AuthResponse> => {
//   const response = await api.post('/api/auth/register', data);
//   return response.data;
// };

// // دالة تسجيل الخروج
// const logoutUser = async (): Promise<{ message: string }> => {
//   const response = await api.post('/api/auth/logout');
//   return response.data;
// };

// export const useLogin = () => {
//   const { login, setLoading } = useAuth();
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: loginUser,
//     onMutate: () => {
//       setLoading(true);
//     },
//     onSuccess: async (data) => {
//       // حفظ التوكن في AsyncStorage
//       await AsyncStorage.setItem('auth_token', data.token);
//       await AsyncStorage.setItem('user_data', JSON.stringify(data.user));

//       // تحديث Zustand store
//       login(data.user, data.token);

//       // إبطال أي queries مرتبطة بالمستخدم
//       queryClient.invalidateQueries({ queryKey: ['user'] });
//     },
//     onError: (error: any) => {
//       console.error('Login error:', error);
//       throw new Error(error.response?.data?.message || 'Login failed');
//     },
//     onSettled: () => {
//       setLoading(false);
//     },
//   });
// };

// export const useRegister = () => {
//   const { login, setLoading } = useAuth();
//   const queryClient = useQueryClient();
//   const router = useRouter(); // إذا أردت التوجيه يدويًا (اختياري)

//   return useMutation({
//     mutationFn: registerUser,
//     onMutate: () => {
//       setLoading(true);
//     },
//     onSuccess: async (data, variables) => {
//       // ✅ الخطوة 1: تم التسجيل بنجاح
//       Alert.alert("نجح التسجيل", "تم إنشاء حسابك بنجاح!");

//       // ✅ الخطوة 2: تسجيل الدخول تلقائيًا باستخدام نفس البريد وكلمة المرور
//       const loginData = {
//         email: variables.email,
//         password: variables.password,
//       };

//       try {
//         const loginResponse = await loginUser(loginData);

//         // ✅ حفظ الجلسة
//         await AsyncStorage.setItem('auth_token', loginResponse.token);
//         await AsyncStorage.setItem('user_data', JSON.stringify(loginResponse.user));
//         login(loginResponse.user, loginResponse.token);
//         queryClient.invalidateQueries({ queryKey: ['user'] });

//         // ✅ التوجيه إلى الـ tabs
//         router.replace("/(tabs)");
//       } catch (loginError) {
//         // إذا فشل تسجيل الدخول التلقائي، نعيد توجيه المستخدم ليدخل يدويًا
//         Alert.alert("تسجيل الدخول مطلوب", "يرجى تسجيل الدخول يدويًا.");
//         router.replace("/login");
//       }
//     },
//     onError: (error: any) => {
//       console.error('Registration error:', error);
//       throw new Error(error.response?.data?.message || 'Registration failed');
//     },
//     onSettled: () => {
//       setLoading(false);
//     },
//   });
// };

// // hooks/useAuth.ts
// import { useRouter } from 'expo-router'; // ✅ أضف هذا
// import { Alert } from 'react-native';

// export const useLogout = () => {
//   const { logout: zustandLogout } = useAuth();
//   const queryClient = useQueryClient();
//   const router = useRouter(); // ✅

//   return useMutation({
//     mutationFn: logoutUser,
//     onSuccess: async () => {
//       await AsyncStorage.removeItem('auth_token');
//       await AsyncStorage.removeItem('user_data');
//       zustandLogout();
//       queryClient.clear();
//       router.replace('/login'); // ✅ التوجيه الفوري
//     },
//     onError: async (error: any) => {
//       console.error('Logout error:', error);
//       // نقوم بال logout محليًا على أي حال
//       await AsyncStorage.removeItem('auth_token');
//       await AsyncStorage.removeItem('user_data');
//       zustandLogout();
//       queryClient.clear();
//       router.replace('/login'); // ✅ حتى في حالة الخطأ
//     },
//   });
// };

// // للتحقق من حالة المصادقة
// export const useCheckAuth = () => {
//   const { setCheckingAuth, login } = useAuth();

//   return useQuery({
//     queryKey: ['checkAuth'],
//     queryFn: async () => {
//       try {
//         const [token, userData] = await Promise.all([
//           AsyncStorage.getItem('auth_token'),
//           AsyncStorage.getItem('user_data'),
//         ]);

//         if (token && userData) {
//           const user = JSON.parse(userData);
//           login(user, token);
//           return { isAuthenticated: true, user };
//         }

//         return { isAuthenticated: false, user: null };
//       } catch (error) {
//         return { isAuthenticated: false, user: null };
//       }
//     },
//     // onSettled: () => {
//     //   setCheckingAuth(false);
//     // },
//     retry: false,
//   });
// };

// hook/useAuth.ts
// hooks/useAuth.ts
import { BASE_URL } from '@/constants/Api';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authstore';

// أنواع الاستجابة
interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'company' | 'client' | 'staff';
    avatar?: string;
    avatarUrl?: string;
    bio?: string;
    followersCount: number, // إضافة followersCount
    followingCount: number, // إضافة followingCount
    postsCount: number
  };
}

// تسجيل حساب جديد
export const useRegister = () => {
  return useMutation({
    mutationFn: async (userData: { name: string; email: string; password: string; role: string }) => {
      const response = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'فشل في التسجيل');
      }

      return response.json() as Promise<AuthResponse>;
    },
  });
};

// تسجيل الدخول
export const useLogin = () => {
  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'فشل في تسجيل الدخول');
      }

      return response.json() as Promise<AuthResponse>;
    },
  });
};