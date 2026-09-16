
// import { BASE_URL } from "@/constants/Api";
// import { COLORS } from "@/constants/theme";
// import { useAuthStore } from "@/stores/authstore";
// import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   FlatList,
//   StyleSheet,
//   ActivityIndicator,
//   Alert,
//   Image,
//   RefreshControl,
// } from "react-native";
// import {
//   SafeAreaView
// } from 'react-native-safe-area-context'

// interface Participant {
//   _id: string;
//   name: string;
//   avatarUrl?: string;
//   bio?: string;
// }

// interface ConversationItem {
//   _id: string;
//   participant: Participant;
//   lastMessage: string;
//   lastMessageAt: string;
//   unreadCount: number;
// }

// export default function ChatListScreen() {
//   const router = useRouter();
//   const { token, user: currentUser } = useAuthStore();
//   const [conversations, setConversations] = useState<ConversationItem[]>([]);
//   const [connections, setConnections] = useState<Participant[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [loadingConnections, setLoadingConnections] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   console.log(currentUser);

//   // جلب المحادثات
//   const fetchConversations = async () => {
//     try {
//       const res = await fetch(`${BASE_URL}/api/chat/conversations`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//       });

//       if (!res.ok) {
//         const err = await res.json();
//         throw new Error(err.message || 'Failed to load conversations');
//       }

//       const data = await res.json();
//       setConversations(data.conversations || []);
//     } catch (error: any) {
//       console.error('Fetch conversations error:', error);
//       Alert.alert('Error', error.message || 'Could not load chats');
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   // جلب الاتصالات (الأشخاص الذين تتبعهم)
//   const fetchConnections = async () => {
//     if (!token || !currentUser?.id) {
//       setLoadingConnections(false);
//       return;
//     }

//     try {
//       const res = await fetch(`${BASE_URL}/api/auth/followersMe/${currentUser.id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (res.ok) {
//         const data = await res.json();
//         console.log("📡 Full API response:", data);
//         console.log("👥 Following array:", data.following);
//         console.log("🔢 Following length:", data.following?.length);

//         const cleanFollowing = (data.following || []).filter((u: any) => u && (u._id || u.id));
//         console.log("🧹 Cleaned following:", cleanFollowing);

//         setConnections(cleanFollowing);
//       } else {
//         console.log("❌ API error:", await res.text());
//       }
//     } catch (err) {
//       console.warn("Failed to load connections:", err);
//     } finally {
//       setLoadingConnections(false);
//     }
//   };

//   // بدء محادثة جديدة
//   const startNewChat = async (receiverId: string) => {
//     if (!token) return;

//     try {
//       const res = await fetch(`${BASE_URL}/api/chat/conversation`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ receiverId }),
//       });

//       if (res.ok) {
//         const conversation = await res.json();
//         router.push({
//           pathname: '/chat/[id]',
//           params: { id: conversation._id }
//         });
//       } else {
//         const err = await res.json();
//         Alert.alert('Error', err.message || 'Could not start chat');
//       }
//     } catch (err: any) {
//       Alert.alert('Error', err.message || 'Could not start chat');
//     }
//   };

//   const openChat = (conversationId: string) => {
//     router.push({
//       pathname: '/chat/[id]',
//       params: { id: conversationId }
//     });
//   };

//   // const onRefresh = () => {
//   //   setRefreshing(true);
//   //   fetchConversations();
//   // };

//   useEffect(() => {
//     if (token) {
//       fetchConversations();
//       fetchConnections();
//     }
//   }, [token]);

//   const formatTime = (timestamp: string) => {
//     const date = new Date(timestamp);
//     const now = new Date();
//     const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

//     if (diffInHours < 24) {
//       return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     } else if (diffInHours < 168) {
//       return date.toLocaleDateString([], { weekday: 'short' });
//     } else {
//       return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
//     }
//   };

//   const ConversationItem = ({ item }: { item: ConversationItem }) => (
//     <TouchableOpacity
//       style={styles.chatItem}
//       onPress={() => openChat(item._id)}
//       activeOpacity={0.7}
//     >
//       <View style={styles.avatarContainer}>
//         {item.participant.avatarUrl ? (
//           <Image
//             source={{ uri: item.participant.avatarUrl }}
//             style={styles.avatar}
//           />
//         ) : (
//           <View style={styles.avatarPlaceholder}>
//             <Text style={styles.avatarText}>
//               {item.participant.name.charAt(0).toUpperCase()}
//             </Text>
//           </View>
//         )}
//         {item.unreadCount > 0 && (
//           <View style={styles.badge}>
//             <Text style={styles.badgeText}>
//               {item.unreadCount > 99 ? '99+' : item.unreadCount}
//             </Text>
//           </View>
//         )}
//       </View>

//       <View style={styles.chatInfo}>
//         <View style={styles.chatHeader}>
//           <Text style={styles.participantName} numberOfLines={1}>
//             {item.participant.name}
//           </Text>
//           <Text style={styles.timestamp}>
//             {formatTime(item.lastMessageAt)}
//           </Text>
//         </View>
//         <Text
//           style={[
//             styles.lastMessage,
//             item.unreadCount > 0 && styles.unreadMessage
//           ]}
//           numberOfLines={2}
//         >
//           {item.lastMessage}
//         </Text>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Chats</Text>
//         <TouchableOpacity
//           style={styles.newChatButton}
//         // onPress={() => router.push('/chat/contacts')}
//         >
//           <Ionicons name="create-outline" size={24} color={COLORS.primary} />
//         </TouchableOpacity>
//       </View>

//       {loading ? (
//         <View style={styles.center}>
//           <ActivityIndicator size="large" color={COLORS.primary} />
//           <Text style={styles.loadingText}>Loading chats...</Text>
//         </View>
//       ) : (
//         <>
//           <FlatList
//             data={conversations}
//             renderItem={({ item }) => <ConversationItem item={item} />}
//             keyExtractor={(item) => item._id}
//             contentContainerStyle={styles.listContainer}
//             refreshControl={
//               <RefreshControl
//                 refreshing={refreshing}
//                 // onRefresh={onRefresh}
//                 colors={[COLORS.primary]}
//               />
//             }
//             showsVerticalScrollIndicator={false}
//           />

//           {/* ✅ عرض الاتصالات دائمًا */}
//           {!loadingConnections && connections.length > 0 && (
//             <View style={styles.suggestionsSection}>
//               <Text style={styles.suggestionsTitle}>People you follow</Text>
//               <FlatList
//                 data={connections}
//                 horizontal
//                 showsHorizontalScrollIndicator={false}
//                 renderItem={({ item }) => (
//                   <TouchableOpacity
//                     style={styles.suggestionItem}
//                     onPress={() => startNewChat(item._id)}
//                   >
//                     {item.avatarUrl ? (
//                       <Image source={{ uri: item.avatarUrl }} style={styles.suggestionAvatar} />
//                     ) : (
//                       <View style={styles.suggestionAvatarPlaceholder}>
//                         <Text style={styles.suggestionAvatarText}>
//                           {item.name.charAt(0).toUpperCase()}
//                         </Text>
//                       </View>
//                     )}
//                     <Text style={styles.suggestionName} numberOfLines={1}>
//                       {item.name || 'Unknown'}
//                     </Text>
//                   </TouchableOpacity>
//                 )}
//                 keyExtractor={(item) => item._id}
//               />
//             </View>
//           )}

//           {loadingConnections && !loading && (
//             <View style={styles.loadingConnectionsContainer}>
//               <ActivityIndicator size="small" color={COLORS.primary} />
//             </View>
//           )}
//         </>
//       )}
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.background,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 20,
//     paddingVertical: 16,
//     backgroundColor: COLORS.surface,
//     borderBottomWidth: StyleSheet.hairlineWidth,
//     borderBottomColor: COLORS.border,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: COLORS.text,
//   },
//   newChatButton: {
//     padding: 4,
//   },
//   listContainer: {
//     paddingHorizontal: 16,
//     paddingTop: 12,
//   },
//   chatItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 12,
//     paddingHorizontal: 8,
//     marginBottom: 8,
//     backgroundColor: COLORS.surface,
//     borderRadius: 12,
//   },
//   avatarContainer: {
//     position: 'relative',
//     marginRight: 14,
//   },
//   avatar: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//   },
//   avatarPlaceholder: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: COLORS.primary,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   avatarText: {
//     color: COLORS.white,
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   badge: {
//     position: 'absolute',
//     top: -2,
//     right: -2,
//     backgroundColor: COLORS.error,
//     borderRadius: 10,
//     minWidth: 18,
//     height: 18,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: COLORS.surface,
//   },
//   badgeText: {
//     color: 'white',
//     fontSize: 10,
//     fontWeight: '600',
//   },
//   chatInfo: {
//     flex: 1,
//   },
//   chatHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 4,
//   },
//   participantName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: COLORS.text,
//     flex: 1,
//     marginRight: 8,
//   },
//   lastMessage: {
//     fontSize: 14,
//     color: COLORS.textLight,
//     lineHeight: 18,
//   },
//   unreadMessage: {
//     color: COLORS.text,
//     fontWeight: '500',
//   },
//   timestamp: {
//     fontSize: 12,
//     color: COLORS.textLight,
//   },
//   center: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     marginTop: 12,
//     fontSize: 16,
//     color: COLORS.textLight,
//   },
//   // ✅ أنماط جديدة للاتصالات
//   suggestionsSection: {
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     backgroundColor: COLORS.surface,
//     marginTop: 12,
//   },
//   suggestionsTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: COLORS.text,
//     marginBottom: 12,
//   },
//   suggestionItem: {
//     alignItems: 'center',
//     marginRight: 20,
//     width: 80,
//   },
//   suggestionAvatar: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     marginBottom: 6,
//   },
//   suggestionAvatarPlaceholder: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: COLORS.primary,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 6,
//   },
//   suggestionAvatarText: {
//     color: COLORS.white,
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   suggestionName: {
//     fontSize: 12,
//     color: COLORS.text,
//     textAlign: 'center',
//     width: 80,
//   },
//   loadingConnectionsContainer: {
//     paddingVertical: 12,
//     alignItems: 'center',
//   },
// });

import { BASE_URL } from "@/constants/Api";
import { COLORS } from "@/constants/theme";
import { useAuthStore } from "@/stores/authstore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
} from "react-native";
import {
  SafeAreaView
} from 'react-native-safe-area-context'

interface Participant {
  _id: string;
  name: string;
  avatarUrl?: string;
  bio?: string;
}

interface ConversationItem {
  _id: string;
  participant?: Participant; // جعلها اختيارية
  participants?: Participant[]; // إضافة المشاركين كمجموعة
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  name?: string; // اسم المشارك
  avatarUrl?: string; // صورة المشارك
}

export default function ChatListScreen() {
  const router = useRouter();
  const { token, user: currentUser } = useAuthStore();
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [connections, setConnections] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingConnections, setLoadingConnections] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // جلب المحادثات
  const fetchConversations = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/chat/conversations`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to load conversations');
      }

      const data = await res.json();
      console.log('📱 Conversations data:', data); // لتصحيح الأخطاء
      
      // معالجة البيانات لتكون آمنة
      const safeConversations = (data.conversations || []).map((conv: any) => ({
        _id: conv._id || conv.id || '',
        participant: conv.participant || conv.otherParticipant || 
                    (conv.participants && conv.participants[0]) || 
                    { _id: '', name: 'Unknown User' },
        participants: conv.participants || [],
        lastMessage: conv.lastMessage || 'No messages yet',
        lastMessageAt: conv.lastMessageAt || conv.updatedAt || new Date().toISOString(),
        unreadCount: conv.unreadCount || 0,
        name: conv.name || conv.participant?.name || 'Unknown User',
        avatarUrl: conv.avatarUrl || conv.participant?.avatarUrl
      }));
      
      setConversations(safeConversations);
    } catch (error: any) {
      console.error('Fetch conversations error:', error);
      Alert.alert('Error', error.message || 'Could not load chats');
      setConversations([]); // ضبط مصفوفة فارغة في حالة الخطأ
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // جلب الاتصالات (الأشخاص الذين تتبعهم)
  const fetchConnections = async () => {
    if (!token || !currentUser?.id) {
      setLoadingConnections(false);
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/auth/followersMe/${currentUser.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        console.log("📡 Full API response:", data);
        
        const cleanFollowing = (data.following || []).filter((u: any) => u && (u._id || u.id));
        setConnections(cleanFollowing);
      } else {
        console.log("❌ API error:", await res.text());
      }
    } catch (err) {
      console.warn("Failed to load connections:", err);
    } finally {
      setLoadingConnections(false);
    }
  };

  // بدء محادثة جديدة
  const startNewChat = async (receiverId: string) => {
    if (!token) return;

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
        router.push({
          pathname: '/chat/[id]',
          params: { id: conversation._id }
        });
      } else {
        const err = await res.json();
        Alert.alert('Error', err.message || 'Could not start chat');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not start chat');
    }
  };

  const openChat = (conversationId: string) => {
    router.push({
      pathname: '/chat/[id]',
      params: { id: conversationId }
    });
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchConversations();
    fetchConnections();
  };

  useEffect(() => {
    if (token) {
      fetchConversations();
      fetchConnections();
    }
  }, [token]);

  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

      if (diffInHours < 24) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else if (diffInHours < 168) {
        return date.toLocaleDateString([], { weekday: 'short' });
      } else {
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      }
    } catch {
      return 'Just now';
    }
  };

  const ConversationItem = ({ item }: { item: ConversationItem }) => {
    // الحصول على معلومات المشارك بشكل آمن
    const participant = item.participant || 
                      (item.participants && item.participants[0]) || 
                      { _id: '', name: item.name || 'Unknown User', avatarUrl: item.avatarUrl };
    
    const participantName = participant.name || item.name || 'Unknown User';
    const avatarUrl = participant.avatarUrl || item.avatarUrl;
    const lastMessage = item.lastMessage || 'No messages yet';
    const timestamp = item.lastMessageAt ? formatTime(item.lastMessageAt) : 'Just now';

    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => openChat(item._id)}
        activeOpacity={0.7}
      >
        <View style={styles.avatarContainer}>
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {participantName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          {item.unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {item.unreadCount > 99 ? '99+' : item.unreadCount}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.chatInfo}>
          <View style={styles.chatHeader}>
            <Text style={styles.participantName} numberOfLines={1}>
              {participantName}
            </Text>
            <Text style={styles.timestamp}>
              {timestamp}
            </Text>
          </View>
          <Text
            style={[
              styles.lastMessage,
              item.unreadCount > 0 && styles.unreadMessage
            ]}
            numberOfLines={2}
          >
            {lastMessage}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chats</Text>
        <TouchableOpacity
          style={styles.newChatButton}
        >
          <Ionicons name="create-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading chats...</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={conversations}
            renderItem={({ item }) => <ConversationItem item={item} />}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[COLORS.primary]}
              />
            }
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="chatbubble-outline" size={60} color={COLORS.textLight} />
                <Text style={styles.emptyText}>No conversations yet</Text>
                <Text style={styles.emptySubText}>
                  Start a chat with someone you follow
                </Text>
              </View>
            }
          />

          {/* ✅ عرض الاتصالات دائمًا */}
          {!loadingConnections && connections.length > 0 && (
            <View style={styles.suggestionsSection}>
              <Text style={styles.suggestionsTitle}>People you follow</Text>
              <FlatList
                data={connections}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.suggestionItem}
                    onPress={() => startNewChat(item._id)}
                  >
                    {item.avatarUrl ? (
                      <Image source={{ uri: item.avatarUrl }} style={styles.suggestionAvatar} />
                    ) : (
                      <View style={styles.suggestionAvatarPlaceholder}>
                        <Text style={styles.suggestionAvatarText}>
                          {item.name?.charAt(0).toUpperCase() || '?'}
                        </Text>
                      </View>
                    )}
                    <Text style={styles.suggestionName} numberOfLines={1}>
                      {item.name || 'Unknown'}
                    </Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item._id || Math.random().toString()}
              />
            </View>
          )}

          {loadingConnections && !loading && (
            <View style={styles.loadingConnectionsContainer}>
              <ActivityIndicator size="small" color={COLORS.primary} />
            </View>
          )}
        </>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  newChatButton: {
    padding: 4,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    flexGrow: 1,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 8,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 14,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: COLORS.error,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  participantName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
    marginRight: 8,
  },
  lastMessage: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 18,
  },
  unreadMessage: {
    color: COLORS.text,
    fontWeight: '500',
  },
  timestamp: {
    fontSize: 12,
    color: COLORS.textLight,
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
  // ✅ أنماط جديدة للاتصالات
  suggestionsSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    marginTop: 12,
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  suggestionItem: {
    alignItems: 'center',
    marginRight: 20,
    width: 80,
  },
  suggestionAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 6,
  },
  suggestionAvatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  suggestionAvatarText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  suggestionName: {
    fontSize: 12,
    color: COLORS.text,
    textAlign: 'center',
    width: 80,
  },
  loadingConnectionsContainer: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textLight,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: COLORS.grey,
    textAlign: 'center',
  },
});