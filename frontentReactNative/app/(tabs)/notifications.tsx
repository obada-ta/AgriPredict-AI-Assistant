import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { COLORS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import Notification from "@/components/Notification";
import { useNotificationStore } from "@/stores/notificationStore";
import { useAuthStore } from "@/stores/authstore";
import { useEffect } from "react";

export default function NotificationsScreen() {
  const token = useAuthStore(s => s.token);
  const { notifications, fetchNotifications, markAllAsRead } = useNotificationStore();

  useEffect(() => {
    if (token) {
      fetchNotifications(token);
    }
  }, [token]);

  const handleMarkAll = () => {
    if (token) {
      markAllAsRead(token);
    }
  };
  
  

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: '700' }}>Notifications</Text>
        {notifications.some(n => !n.isRead) && (
          <TouchableOpacity onPress={handleMarkAll}>
            <Text style={{ color: COLORS.primary }}>Mark all as read</Text>
          </TouchableOpacity>
        )}
      </View>

      {notifications.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Ionicons name="notifications-outline" size={64} color={COLORS.textLight} />
          <Text>No notifications yet</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={({ item }) => <Notification notification={item} />}
          keyExtractor={item => item._id}

          ListFooterComponent={
            <View style={{ marginVertical: 60, flexDirection: "column", justifyContent: 'center', alignItems: "center" }}>
              <Text style={{ padding: 30, fontSize: 24, color: 'white' }}>End Notification</Text>
            </View>}
        />
      )}
    </SafeAreaView>
  );
}
