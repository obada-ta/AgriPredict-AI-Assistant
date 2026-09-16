import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { BASE_URL } from '@/constants/Api';
import { useSocketStore } from './socketStore';

// أنواع الأدوار
export type UserRole = 'admin' | 'company' | 'client' | 'staff';

// نوع المستخدم
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  avatarUrl?: string;
  bio?: string;
  followersCount: number; // متابعين
  followingCount: number; // يتابع
  postsCount: number; // عدد المنشورات
}

// نوع الحالة
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  updateUserAvatar: (avatar: string, avatarUrl: string) => void;
}

// إنشاء الحالة
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (user, token) => {
        set({ user, token, isAuthenticated: true });
        useSocketStore
          .getState()
          .connect(token, user.id);
      },

      logout: async () => {
        const { token } = get();
        try {
          if (token) {
            // إرسال طلب تسجيل الخروج للخادم (لإضافة التوكن إلى الـ blacklist)
            await fetch(`${BASE_URL}/api/auth/logout`, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });
          }
        } catch (error) {
          console.warn('Logout API failed (proceeding locally):', error);
        } finally {
          // مسح الحالة محليًا
          useSocketStore.getState().disconnect();
          set({ user: null, token: null, isAuthenticated: false });
          router.replace('/(auth)/login');
        }
      },

      setUser: (user) => set({ user }),

      updateUserAvatar: (avatar, avatarUrl) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, avatar, avatarUrl } });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // اختياري: يمكنك تحديد ما يتم تخزينه فقط
      // partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
);