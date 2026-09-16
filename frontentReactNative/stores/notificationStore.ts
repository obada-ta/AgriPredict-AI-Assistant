// stores/notificationStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@/constants/Api';

export interface NotificationType {
  _id: string;
  senderId: {
    _id: string;
    name: string;
    avatarUrl?: string;
  };
  receiverId: string;
  type: string;
  data: any;
  isRead: boolean;
  createdAt: string;
}

interface NotificationState {
  notifications: NotificationType[];
  unreadCount: number;

  fetchNotifications: (token: string) => Promise<void>;
  addNotification: (notification: NotificationType) => void;

  markAsRead: (id: string, token: string) => Promise<void>;
  markAllAsRead: (token: string) => Promise<void>;
  deleteNotification: (id: string, token: string) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,

      // 📥 جلب الإشعارات
      fetchNotifications: async (token) => {
        if (!token) return;

        const res = await fetch(`${BASE_URL}/api/notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data: NotificationType[] = await res.json();
          set({
            notifications: data,
            unreadCount: data.filter(n => !n.isRead).length,
          });
        }
      },

      // ➕ من Socket
      addNotification: (notification) => {
        set((state) => ({
          notifications: [notification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        }));
      },

      // 👁️ قراءة إشعار
      markAsRead: async (id, token) => {
        if (!token) return;

        const res = await fetch(`${BASE_URL}/api/notifications/${id}/read`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          set((state) => ({
            notifications: state.notifications.map(n =>
              n._id === id ? { ...n, isRead: true } : n
            ),
            unreadCount: Math.max(0, state.unreadCount - 1),
          }));
        }
      },

      // 👁️👁️ قراءة الكل
      markAllAsRead: async (token) => {
        if (!token) return;

        const res = await fetch(`${BASE_URL}/api/notifications/read-all`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          set((state) => ({
            notifications: state.notifications.map(n => ({ ...n, isRead: true })),
            unreadCount: 0,
          }));
        }
      },

      // 🗑️ حذف إشعار
      // deleteNotification: async (id, token) => {
      //   if (!token) return;

      //   const res = await fetch(`${BASE_URL}/api/notifications/${id}`, {
      //     method: 'DELETE',
      //     headers: { Authorization: `Bearer ${token}` },
      //   });

      //   if (res.ok) {
      //     set((state) => {
      //       const removed = state.notifications.find(n => n._id === id);
      //       return {
      //         notifications: state.notifications.filter(n => n._id !== id),
      //         unreadCount:
      //           removed && !removed.isRead
      //             ? Math.max(0, state.unreadCount - 1)
      //             : state.unreadCount,
      //       };
      //     });
      //     console.log('تم حذف الاشعار بنجاح');

      //   }
      // },
      // stores/notificationStore.ts - تحديث دالة deleteNotification
      deleteNotification: async (id: string, token: string) => {
        if (!token) {
          console.log('No token available');
          return;
        }

        try {
          console.log('Deleting notification with ID:', id);
          console.log('Using token:', token.substring(0, 20) + '...');

          const res = await fetch(`${BASE_URL}/api/notifications/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
          });

          console.log('Response status:', res.status);

          if (res.ok) {
            const data = await res.json();
            console.log('Delete successful:', data);

            // تحديث الحالة
            set((state) => {
              const removed = state.notifications.find(n => n._id === id);
              return {
                notifications: state.notifications.filter(n => n._id !== id),
                unreadCount: removed && !removed.isRead
                  ? Math.max(0, state.unreadCount - 1)
                  : state.unreadCount,
              };
            });

            // إشعار للمستخدم
            console.log('✅ تم حذف الإشعار بنجاح');
          } else {
            const errorData = await res.json().catch(() => ({ message: 'Unknown error' }));
            console.log('❌ Delete failed:', errorData);

            // يمكنك إظهار رسالة خطأ للمستخدم هنا
            // Alert.alert('Error', errorData.message || 'Failed to delete notification');
          }
        } catch (error: any) {
          console.log('❌ Network error:', error.message);
          // Alert.alert('Network Error', 'Please check your internet connection');
        }
      },
    }),
    {
      name: 'notification-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
