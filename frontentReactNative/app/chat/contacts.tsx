// app/chat/contacts.tsx
import { Alert, FlatList, Image, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS } from '@/constants/theme';
import { BASE_URL } from '@/constants/Api';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/authstore';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator } from 'react-native';

interface Participant {
  _id: string;
  name: string;
  avatarUrl?: string;
  bio?: string;
}

export default function ContactsScreen() {
  const router = useRouter();
  const { token, user: currentUser } = useAuthStore();
  const [connections, setConnections] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // جلب الاتصالات (الأشخاص الذين تتبعهم)
  const fetchConnections = async () => {
    if (!token || !currentUser?.id) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/auth/followersMe/${currentUser.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to load contacts');
      }

      const data = await res.json();
      // ✅ تأكد أن following مصفوفة
      const followingArray = Array.isArray(data.following) ? data.following : [];

      const cleanFollowing = followingArray
        .filter((u: any) => u && (u._id || u.id)) // تحقق من وجود معرف
        .map((user: any) => ({
          _id: String(user._id || user.id), // ⚠️ يجب أن يكون نصًا
          name: String(user.name || 'Unknown'),
          avatarUrl: user.avatarUrl || user.avatar || undefined,
          bio: user.bio || undefined,
        }));

      setConnections(cleanFollowing);
    } catch (err: any) {
      console.warn("Failed to load connections:", err);
      Alert.alert('Error', err.message || 'Could not load contacts');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const startNewChat = async (receiverId: string) => {
    if (!token || !receiverId) return;

    try {
      const res = await fetch(`${BASE_URL}/api/chat/conversation`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ receiverId }),
      });

      if (res.ok) {
        const conversation = await res.json();
        router.push({ pathname: '/chat/[id]', params: { id: conversation._id } });
      } else {
        const err = await res.json();
        Alert.alert('Error', err.message || 'Could not start chat');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not start chat');
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchConnections();
  };

  useEffect(() => {
    if (token) {
      fetchConnections();
    }
  }, [token]);

  const renderContact = ({ item }: { item: Participant }) => {
    // 🔒 تجاهل العناصر بدون _id (رغم أن التنظيف أعلاه يمنع ذلك)
    if (!item._id) return null;

    const displayName = item.name || 'Unknown';
    const displayBio = item.bio || '';

    return (
      <TouchableOpacity
        style={styles.contactItem}
        onPress={() => startNewChat(item._id)}
        activeOpacity={0.7}
      >
        {item.avatarUrl ? (
          <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {displayName.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <View style={styles.contactInfo}>
          <Text style={styles.contactName} numberOfLines={1}>
            {displayName}
          </Text>
          {displayBio ? (
            <Text style={styles.contactBio} numberOfLines={1}>
              {displayBio}
            </Text>
          ) : null}
        </View>
        <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Message</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading contacts...</Text>
        </View>
      ) : connections.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="person-outline" size={64} color={COLORS.textLight} />
          <Text style={styles.emptyText}>No contacts found</Text>
          <Text style={styles.emptySubtext}>Follow users to start chatting with them</Text>
        </View>
      ) : (
        <FlatList
          data={connections}
          renderItem={renderContact}
          keyExtractor={(item) => item._id} // الآن _id نص دائمًا
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.textLight,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 20,
  },
  listContainer: {
    padding: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 14,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  contactBio: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 2,
  },
});