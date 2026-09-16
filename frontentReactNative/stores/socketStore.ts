// stores/socketStore.ts
import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import { BASE_URL } from '@/constants/Api';

interface SocketState {
  socket: Socket | null;
  onlineUsers: string[];
  connect: (token: string, userId: string) => void;
  disconnect: () => void;
}

let socketInstance: Socket | null = null;

export const useSocketStore = create<SocketState>((set) => ({
  socket: null,
  onlineUsers: [],

  connect: (token, userId) => {
    if (!token || !userId || socketInstance) return;

    socketInstance = io(BASE_URL, {
      transports: ['websocket'],
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    socketInstance.on('connect', () => {
      console.log('✅ Socket connected:', socketInstance?.id);
      socketInstance?.emit('setup', userId);
    });

    socketInstance.on('getOnlineUsers', (userIds: string[]) => {
      set({ onlineUsers: userIds });
    });

    socketInstance.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });

    set({ socket: socketInstance });
  },

  disconnect: () => {
    if (socketInstance) {
      socketInstance.disconnect();
      socketInstance = null;
    }
    set({ socket: null, onlineUsers: [] });
  },
}));
