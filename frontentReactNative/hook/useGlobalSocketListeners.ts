import { useEffect } from "react";
import Toast from "react-native-toast-message";
import { useSocketStore } from "@/stores/socketStore";
import { useAuthStore } from "@/stores/authstore";
import { useNotificationStore } from "@/stores/notificationStore";
import { playNotificationSound } from "@/utils/playNotificationSound";

import { Ionicons } from "@expo/vector-icons";
export const useGlobalSocketListeners = () => {
  const socket = useSocketStore(s => s.socket);
  const currentUserId = useAuthStore(s => s.user?.id);
  const addNotification = useNotificationStore(s => s.addNotification);
  const comment =
    useEffect(() => {
      if (!socket || !currentUserId) return;

      const handleReceiveMessage = (message: any) => {
        if (message.sender?._id === currentUserId) return;

        playNotificationSound();

        Toast.show({
          type: "success",
          text1: "💬 New message",
          text2: `${message.sender?.name ?? "User"}: ${message.content?.slice(0, 30)}`,
        });
      };

      const handleNewNotification = (notification: any) => {
        if (notification.senderId?._id === currentUserId) return;

        addNotification(notification);
        playNotificationSound();

        let title = "🔔 Notification";
        let body = "You have a new notification";

        switch (notification.type) {
          case "follow":
            title = "👤 New follower";
            body = `${notification.senderId?.name ?? "Someone"} followed you`;
            break;

          case "message":
            title = "💬 New message";
            body = `${notification.senderId?.name ?? "Someone"} sent you a message`;
            break;
          case "message_deleted":
            title = "💬 delete message";
            body = `${notification.senderId?.name ?? "Someone"} was deleted`;
            break;

          case "comment":
            title = "💬 New comment";
            body = `${notification.senderId?.name ?? "Someone"} commented on your post`;
            break;

          case "like":
            title = "❤️ New like";
            body = `${notification.senderId?.name ?? "Someone"} liked your post`;
            break;
        }

        Toast.show({
          type: "success",
          text1: title,
          text2: body,
        });
      };


      socket.on("receiveMessage", handleReceiveMessage);
      socket.on("newNotification", handleNewNotification);

      return () => {
        socket.off("receiveMessage", handleReceiveMessage);
        socket.off("newNotification", handleNewNotification);
      };
    }, [socket, currentUserId]);
};
