// import { BASE_URL } from "@/constants/Api";
// import { COLORS } from "@/constants/theme";
// import { useAuthStore } from "@/stores/authstore";
// import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import { useEffect, useState } from "react";
// import {
//     View,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     FlatList,
//     SafeAreaView,
//     StyleSheet,
//     Platform,
//     ActivityIndicator,
//     Alert,
//     RefreshControl,
//     Image
// } from "react-native";

// interface User {
//     _id: string;
//     id: string;
//     name: string;
//     email: string;
//     avatarUrl?: string;
//     bio?: string;
//     role: string;
//     followers: string[];
//     following: string[];
// }

// export default function Users() {
//     const router = useRouter();
//     const { user, token } = useAuthStore();
//     const [users, setUsers] = useState<User[]>([]);
//     const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [loading, setLoading] = useState(true);
//     const [refreshing, setRefreshing] = useState(false);
//     const [activeTab, setActiveTab] = useState<'all' | 'followers' | 'following'>('all');
//     const [pagination, setPagination] = useState({
//         currentPage: 1,
//         totalPages: 1,
//         totalUsers: 0,
//         hasNext: false,
//         hasPrev: false
//     });

//     // دالة مساعدة لتحويل البيانات إلى النوع الصحيح
//     const normalizeUserData = (userData: any): User => {
//         return {
//             _id: userData._id || userData.id,
//             id: userData.id || userData._id,
//             name: userData.name || '',
//             email: userData.email || '',
//             avatarUrl: userData.avatarUrl || userData.avatar,
//             bio: userData.bio || '',
//             role: userData.role || 'client',
//             followers: Array.isArray(userData.followers)
//                 ? userData.followers.map((id: any) => id?.toString?.() || '')
//                 : [],
//             following: Array.isArray(userData.following)
//                 ? userData.following.map((id: any) => id?.toString?.() || '')
//                 : []
//         };
//     };

//     // جلب جميع المستخدمين
//     const fetchAllUsers = async (page = 1, search = '') => {
//         try {
//             setLoading(true);

//             const apiUrl = `${BASE_URL}/api/auth/users?page=${page}&limit=20&search=${search}`;

//             const response = await fetch(apiUrl, {
//                 method: 'GET',
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json',
//                 },
//             });

//             if (!response.ok) {
//                 throw new Error(`Failed to fetch users: ${response.status}`);
//             }

//             const result = await response.json();

//             if (result.success) {
//                 const normalizedUsers = result.data.map(normalizeUserData);

//                 if (page === 1) {
//                     setUsers(normalizedUsers);
//                     setFilteredUsers(normalizedUsers);
//                 } else {
//                     setUsers(prev => [...prev, ...normalizedUsers]);
//                     setFilteredUsers(prev => [...prev, ...normalizedUsers]);
//                 }
//                 setPagination(result.pagination);
//             }
//         } catch (error) {
//             console.error('Error fetching users:', error);
//             Alert.alert('Error', 'Failed to load users');
//         } finally {
//             setLoading(false);
//             setRefreshing(false);
//         }
//     };

//     // جلب المتابعين والمتابَعين
//     const fetchUserConnections = async () => {
//         try {
//             if (!user?.id) return;

//             const apiUrl = `${BASE_URL}/api/auth/followersMe/${user.id}`;

//             const response = await fetch(apiUrl, {
//                 method: 'GET',
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json',
//                 },
//             });

//             if (!response.ok) {
//                 throw new Error(`Failed to fetch connections: ${response.status}`);
//             }

//             const result = await response.json();

//             // تطبيع بيانات المتابعين والمتابَعين
//             if (activeTab === 'followers') {
//                 const normalizedFollowers = (result.followers || []).map(normalizeUserData);
//                 setFilteredUsers(normalizedFollowers);
//             } else if (activeTab === 'following') {
//                 const normalizedFollowing = (result.following || []).map(normalizeUserData);
//                 setFilteredUsers(normalizedFollowing);
//             }
//         } catch (error) {
//             console.error('Error fetching connections:', error);
//             Alert.alert('Error', 'Failed to load connections');
//         }
//     };

//     // متابعة/إلغاء متابعة مستخدم
//     const handleFollow = async (targetUserId: string, isCurrentlyFollowing: boolean) => {
//         try {
//             const apiUrl = `${BASE_URL}/api/auth/${isCurrentlyFollowing ? 'unfollow' : 'follow'}/${targetUserId}`;

//             const response = await fetch(apiUrl, {
//                 method: 'POST',
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json',
//                 },
//             });

//             if (!response.ok) {
//                 throw new Error(`Failed to ${isCurrentlyFollowing ? 'unfollow' : 'follow'}`);
//             }

//             const result = await response.json();

//             if (result.success) {
//                 // تحديث القائمة المحلية
//                 const updatedUsers = users.map(u => {
//                     if (u._id === targetUserId) {
//                         const updatedFollowers = isCurrentlyFollowing
//                             ? u.followers.filter(id => id !== user?.id)
//                             : [...u.followers, user?.id].filter(Boolean) as string[];

//                         return {
//                             ...u,
//                             followers: updatedFollowers
//                         };
//                     }
//                     return u;
//                 });

//                 setUsers(updatedUsers);

//                 // تحديث القائمة المصفاة بناءً على التبويب النشط
//                 if (activeTab === 'all') {
//                     setFilteredUsers(updatedUsers);
//                 } else {
//                     // إعادة تحميل بيانات المتابعين/المتابَعين
//                     fetchUserConnections();
//                 }

//                 Alert.alert('Success', `User ${isCurrentlyFollowing ? 'unfollowed' : 'followed'} successfully`);
//             }
//         } catch (error) {
//             console.error('Error following user:', error);
//             Alert.alert('Error', `Failed to ${isCurrentlyFollowing ? 'unfollow' : 'follow'} user`);
//         }
//     };

//     // البحث
//     const handleSearch = (text: string) => {
//         setSearchQuery(text);
//         if (activeTab === 'all') {
//             const filtered = users.filter(u =>
//                 u.name.toLowerCase().includes(text.toLowerCase()) ||
//                 u.email.toLowerCase().includes(text.toLowerCase())
//             );
//             setFilteredUsers(filtered);
//         } else {
//             // البحث في قائمة المتابعين/المتابَعين
//             const currentList = activeTab === 'followers'
//                 ? filteredUsers
//                 : filteredUsers;

//             const filtered = currentList.filter(u =>
//                 u.name.toLowerCase().includes(text.toLowerCase()) ||
//                 u.email.toLowerCase().includes(text.toLowerCase())
//             );
//             setFilteredUsers(filtered);
//         }
//     };

//     // تحديث البيانات
//     const handleRefresh = () => {
//         setRefreshing(true);
//         if (activeTab === 'all') {
//             fetchAllUsers(1, searchQuery);
//         } else {
//             fetchUserConnections();
//         }
//     };

//     // تغيير التبويب
//     const handleTabChange = (tab: 'all' | 'followers' | 'following') => {
//         setActiveTab(tab);
//         setSearchQuery('');

//         if (tab === 'all') {
//             setFilteredUsers(users);
//         } else {
//             fetchUserConnections();
//         }
//     };

//     useEffect(() => {
//         fetchAllUsers();
//     }, []);

//     useEffect(() => {
//         if (activeTab !== 'all') {
//             fetchUserConnections();
//         }
//     }, [activeTab]);

//     const UserItem = ({ user: userItem }: { user: User }) => {
//         const isCurrentUser = userItem._id === user?.id;
//         const isFollowing = userItem.followers.includes(user?.id || '');

//         return (

//             <View style={styles.userItem}>
//                 <View style={styles.userInfo}>
//                     <View style={styles.avatarContainer}>
//                         {userItem.avatarUrl ? (
//                             <Image
//                                 source={{ uri: userItem.avatarUrl }}
//                                 style={styles.avatar}
//                             />
//                         ) : (
//                             <View style={styles.avatarPlaceholder}>
//                                 <Text style={styles.avatarText}>
//                                     {userItem.name.charAt(0).toUpperCase()}
//                                 </Text>
//                             </View>
//                         )}
//                     </View>
//                     <View style={styles.userDetails}>
//                         <Text style={styles.userName}>{userItem.name}</Text>
//                         <Text style={styles.userEmail}>{userItem.email}</Text>
//                         {userItem.bio && (
//                             <Text style={styles.userBio} numberOfLines={2}>
//                                 {userItem.bio}
//                             </Text>
//                         )}
//                     </View>
//                 </View>

//                 {!isCurrentUser && (
//                     <TouchableOpacity
//                         style={[
//                             styles.followButton,
//                             isFollowing ? styles.unfollowButton : styles.followButtonActive
//                         ]}
//                         onPress={() => handleFollow(userItem._id, isFollowing)}
//                     >
//                         <Text style={[
//                             styles.followButtonText,
//                             isFollowing ? styles.unfollowButtonText : styles.followButtonTextActive
//                         ]}>
//                             {isFollowing ? 'Following' : 'Follow'}
//                         </Text>
//                     </TouchableOpacity>
//                 )}
//             </View>

//         );
//     };

//     return (

//         <View style={[styles.container]}>
//             {/* HEADER */}
//             <View style={styles.header}>
//                 <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
//                     <Ionicons name="arrow-back" size={24} color={COLORS.text} />
//                 </TouchableOpacity>
//                 <Text style={styles.headerTitle}>Users</Text>
//                 <View style={{ width: 24 }} />
//             </View>

//             {/* TABS */}
//             <View style={styles.tabsContainer}>
//                 <TouchableOpacity
//                     style={[styles.tab, activeTab === 'all' && styles.activeTab]}
//                     onPress={() => handleTabChange('all')}
//                 >
//                     <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
//                         All Users
//                     </Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                     style={[styles.tab, activeTab === 'followers' && styles.activeTab]}
//                     onPress={() => handleTabChange('followers')}
//                 >
//                     <Text style={[styles.tabText, activeTab === 'followers' && styles.activeTabText]}>
//                         Followers
//                     </Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                     style={[styles.tab, activeTab === 'following' && styles.activeTab]}
//                     onPress={() => handleTabChange('following')}
//                 >
//                     <Text style={[styles.tabText, activeTab === 'following' && styles.activeTabText]}>
//                         Following
//                     </Text>
//                 </TouchableOpacity>
//             </View>

//             {/* SEARCH BAR */}
//             <View style={styles.searchContainer}>
//                 <Ionicons name="search-outline" size={20} color={COLORS.textLight} style={styles.searchIcon} />
//                 <TextInput
//                     style={styles.searchInput}
//                     placeholder={`Search ${activeTab}...`}
//                     placeholderTextColor={COLORS.textLight}
//                     value={searchQuery}
//                     onChangeText={handleSearch}
//                     autoCapitalize="none"
//                 />
//                 {searchQuery ? (
//                     <TouchableOpacity onPress={() => handleSearch('')}>
//                         <Ionicons name="close-circle" size={20} color={COLORS.textLight} />
//                     </TouchableOpacity>
//                 ) : null}
//             </View>

//             {/* USERS LIST */}
//             {loading && !refreshing ? (
//                 <View style={styles.loadingContainer}>
//                     <ActivityIndicator size="large" color={COLORS.primary} />
//                     <Text style={styles.loadingText}>Loading users...</Text>
//                 </View>
//             ) : (
//                 <FlatList
//                     data={filteredUsers}
//                     renderItem={({ item }) => <UserItem user={item} />}
//                     keyExtractor={(item) => item._id || item.id}
//                     showsVerticalScrollIndicator={false}
//                     contentContainerStyle={styles.usersList}
//                     refreshControl={
//                         <RefreshControl
//                             refreshing={refreshing}
//                             onRefresh={handleRefresh}
//                             colors={[COLORS.primary]}
//                         />
//                     }
//                     ListEmptyComponent={
//                         <View style={styles.emptyContainer}>
//                             <Ionicons name="people-outline" size={64} color={COLORS.textLight} />
//                             <Text style={styles.emptyText}>
//                                 {activeTab === 'all' ? 'No users found' :
//                                     activeTab === 'followers' ? 'No followers yet' :
//                                         'Not following anyone yet'}
//                             </Text>
//                         </View>
//                     }
//                 />
//             )}
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: COLORS.background,
//         gap: 10
//     },
//     header: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         paddingHorizontal: 20,
//         paddingVertical: 16,
//         backgroundColor: COLORS.surface,
//         borderBottomWidth: StyleSheet.hairlineWidth,
//         borderBottomColor: COLORS.border,
//     },
//     headerTitle: {
//         fontSize: 20,
//         fontWeight: '700',
//         color: COLORS.text,
//     },
//     tabsContainer: {
//         flexDirection: 'row',
//         paddingHorizontal: 20,
//         marginTop: 16,
//     },
//     tab: {
//         flex: 1,
//         paddingVertical: 12,
//         alignItems: 'center',
//         borderBottomWidth: 2,
//         borderBottomColor: 'transparent',
//     },
//     activeTab: {
//         borderBottomColor: COLORS.primary,
//     },
//     tabText: {
//         fontSize: 14,
//         fontWeight: '600',
//         color: COLORS.textLight,
//     },
//     activeTabText: {
//         color: COLORS.primary,
//     },
//     searchContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         backgroundColor: COLORS.surface,
//         marginHorizontal: 20,
//         marginTop: 16,
//         paddingHorizontal: 16,
//         paddingVertical: 12,
//         borderRadius: 12,
//         borderWidth: 1,
//         borderColor: COLORS.border,
//     },
//     searchIcon: {
//         marginRight: 10,
//     },
//     searchInput: {
//         flex: 1,
//         fontSize: 16,
//         color: COLORS.text,
//         marginRight: 8,
//     },
//     usersList: {
//         paddingHorizontal: 20,
//         paddingBottom: 20,
//     },
//     userItem: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         paddingVertical: 16,
//         backgroundColor: COLORS.surface,
//         borderRadius: 12,
//         marginBottom: 12,
//         paddingHorizontal: 16,
//         ...Platform.select({
//             ios: {
//                 shadowColor: '#000',
//                 shadowOffset: { width: 0, height: 1 },
//                 shadowOpacity: 0.05,
//                 shadowRadius: 3,
//             },
//             android: {
//                 elevation: 1,
//             },
//         }),
//     },
//     userInfo: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         flex: 1,
//     },
//     avatarContainer: {
//         marginRight: 12,
//     },
//     avatar: {
//         width: 50,
//         height: 50,
//         borderRadius: 25,
//     },
//     avatarPlaceholder: {
//         width: 50,
//         height: 50,
//         borderRadius: 25,
//         backgroundColor: COLORS.primary,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     avatarText: {
//         color: COLORS.white,
//         fontSize: 18,
//         fontWeight: 'bold',
//     },
//     userDetails: {
//         flex: 1,
//     },
//     userName: {
//         fontSize: 16,
//         fontWeight: '600',
//         color: COLORS.text,
//         marginBottom: 2,
//     },
//     userEmail: {
//         fontSize: 14,
//         color: COLORS.textLight,
//         marginBottom: 4,
//     },
//     userBio: {
//         fontSize: 12,
//         color: COLORS.textLight,
//         lineHeight: 16,
//     },
//     followButton: {
//         paddingHorizontal: 16,
//         paddingVertical: 8,
//         borderRadius: 20,
//         borderWidth: 1,
//     },
//     followButtonActive: {
//         backgroundColor: COLORS.primary,
//         borderColor: COLORS.primary,
//     },
//     unfollowButton: {
//         backgroundColor: 'transparent',
//         borderColor: COLORS.textLight,
//     },
//     followButtonText: {
//         fontSize: 14,
//         fontWeight: '600',
//     },
//     followButtonTextActive: {
//         color: COLORS.white,
//     },
//     unfollowButtonText: {
//         color: COLORS.textLight,
//     },
//     loadingContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     loadingText: {
//         marginTop: 12,
//         fontSize: 16,
//         color: COLORS.textLight,
//     },
//     emptyContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         paddingVertical: 60,
//     },
//     emptyText: {
//         fontSize: 16,
//         color: COLORS.textLight,
//         textAlign: 'center',
//         marginTop: 16,
//     },
// });
// import { BASE_URL } from "@/constants/Api";
// import { COLORS } from "@/constants/theme";
// import { useAuthStore } from "@/stores/authstore"; // تأكد من الاسم الصحيح
// import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import { useEffect, useState } from "react";
// import {
//     View,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     FlatList,
//     StyleSheet,
//     Platform,
//     ActivityIndicator,
//     Alert,
//     RefreshControl,
//     Image
// } from "react-native";

// // نوع المستخدم من Backend
// interface User {
//     _id: string;
//     name: string;
//     email: string;
//     avatarUrl?: string;
//     bio?: string;
//     role: 'client' | 'company' | 'admin' | 'staff';
//     followers: string[];   // array of user IDs
//     following: string[];   // array of user IDs
// }

// export default function Users() {
//     const router = useRouter();
//     const { user: currentUser, token } = useAuthStore();
//     const [users, setUsers] = useState<User[]>([]);
//     const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [loading, setLoading] = useState(true);
//     const [refreshing, setRefreshing] = useState(false);
//     const [activeTab, setActiveTab] = useState<'all' | 'followers' | 'following'>('all');

//     // تحويل البيانات من API إلى النوع الموحد
//     const normalizeUserData = (userData: any): User => ({
//         _id: userData._id,
//         name: userData.name || '',
//         email: userData.email || '',
//         avatarUrl: userData.avatarUrl || userData.avatar || undefined,
//         bio: userData.bio || undefined,
//         role: userData.role || 'client',
//         followers: Array.isArray(userData.followers)
//             ? userData.followers.map((id: any) => String(id))
//             : [],
//         following: Array.isArray(userData.following)
//             ? userData.following.map((id: any) => String(id))
//             : [],
//     });

//     // جلب جميع العملاء والشركات
//     const fetchAllUsers = async () => {
//         try {
//             setLoading(true);
//             // ✅ التصحيح هنا
//             const apiUrl = `${BASE_URL}/api/auth/users/clients-companies`;

//             const response = await fetch(apiUrl, {
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                 },
//             });

//             if (!response.ok) {
//                 const error = await response.json();
//                 throw new Error(error.message || 'Failed to load users');
//             }

//             const usersArray = await response.json(); // مصفوفة مباشرة
//             const normalized = usersArray.map(normalizeUserData);
//             setUsers(normalized);
//             setFilteredUsers(normalized);
//         } catch (error: any) {
//             console.error('Error fetching users:', error);
//             Alert.alert('Error', error.message || 'Failed to load users');
//         } finally {
//             setLoading(false);
//             setRefreshing(false);
//         }
//     };

//     // جلب المتابعين أو المتابَعين
//     const fetchUserConnections = async () => {
//         if (!currentUser?.id) return;

//         try {
//             const response = await fetch(`${BASE_URL}/api/auth/followersMe/${currentUser.id}`, {
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                 },
//             });

//             if (!response.ok) {
//                 const error = await response.json();
//                 throw new Error(error.message || 'Failed to load connections');
//             }

//             const result = await response.json();

//             if (activeTab === 'followers') {
//                 const followers = (result.followers || []).map(normalizeUserData);
//                 setFilteredUsers(followers);
//             } else if (activeTab === 'following') {
//                 const following = (result.following || []).map(normalizeUserData);
//                 setFilteredUsers(following);
//             }
//         } catch (error: any) {
//             console.error('Error fetching connections:', error);
//             Alert.alert('Error', error.message || 'Failed to load connections');
//         }
//     };

//     // متابعة أو إلغاء متابعة
//  const handleFollow = async (targetUserId: string, isCurrentlyFollowing: boolean) => {
//   try {
//     const apiUrl = `${BASE_URL}/api/auth/follower/${targetUserId}`;

//     const response = await fetch(apiUrl, {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     });

//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.message || 'Operation failed');
//     }

//     // ✅ تحديث القائمة المحلية بعد النجاح
//     const updatedUsers = users.map(u => {
//       if (u._id === targetUserId) {
//         const updatedFollowers = isCurrentlyFollowing
//           ? u.followers.filter(id => id !== currentUser?.id)
//           : [...u.followers, currentUser?.id].filter(Boolean) as string[];

//         return { ...u, followers: updatedFollowers };
//       }
//       return u;
//     });

//     setUsers(updatedUsers);
//     if (activeTab === 'all') {
//       setFilteredUsers(updatedUsers);
//     } else {
//       // إذا كنت في تبويب followers/following، أعد التحميل
//       fetchUserConnections();
//     }

//     Alert.alert('Success', `User ${isCurrentlyFollowing ? 'unfollowed' : 'followed'} successfully`);
//   } catch (error: any) {
//     console.error('Follow error:', error);
//     Alert.alert('Error', error.message || 'Failed to update follow status');
//   }
// };

//     // البحث محلي (بدون Backend)
//     const handleSearch = (text: string) => {
//         setSearchQuery(text);
//         const list = activeTab === 'all' ? users : filteredUsers;
//         const filtered = list.filter(u =>
//             u.name.toLowerCase().includes(text.toLowerCase()) ||
//             u.email.toLowerCase().includes(text.toLowerCase())
//         );
//         setFilteredUsers(filtered);
//     };

//     const handleRefresh = () => {
//         setRefreshing(true);
//         if (activeTab === 'all') {
//             fetchAllUsers();
//         } else {
//             fetchUserConnections();
//         }
//     };

//     const handleTabChange = (tab: 'all' | 'followers' | 'following') => {
//         setActiveTab(tab);
//         setSearchQuery('');
//         if (tab === 'all') {
//             setFilteredUsers(users);
//         } else {
//             fetchUserConnections();
//         }
//     };

//     // التحميل الأولي
//     useEffect(() => {
//         fetchAllUsers();
//     }, []);

//     useEffect(() => {
//         if (activeTab !== 'all') {
//             fetchUserConnections();
//         }
//     }, [activeTab]);

//     // مكون عنصر المستخدم
//     const UserItem = ({ user: userItem }: { user: User }) => {
//         const isCurrentUser = userItem._id === currentUser?.id;
//         const isFollowing = userItem.followers.includes(currentUser?.id || '');

//         return (
//             <View style={styles.userItem}>
//                 <View style={styles.userInfo}>
//                     <View style={styles.avatarContainer}>
//                         {userItem.avatarUrl ? (
//                             <Image source={{ uri: userItem.avatarUrl }} style={styles.avatar} />
//                         ) : (
//                             <View style={styles.avatarPlaceholder}>
//                                 <Text style={styles.avatarText}>
//                                     {userItem.name.charAt(0).toUpperCase()}
//                                 </Text>
//                             </View>
//                         )}
//                     </View>
//                     <View style={styles.userDetails}>
//                         <Text style={styles.userName}>{userItem.name}</Text>
//                         <Text style={styles.userEmail}>{userItem.email}</Text>
//                         {userItem.bio && <Text style={styles.userBio} numberOfLines={2}>{userItem.bio}</Text>}
//                         <Text style={styles.userRole}>{userItem.role.charAt(0).toUpperCase() + userItem.role.slice(1)}</Text>
//                     </View>
//                 </View>

//                 {!isCurrentUser && (
//                     <TouchableOpacity
//                         style={[styles.followButton, isFollowing ? styles.unfollowButton : styles.followButtonActive]}
//                         onPress={() => handleFollow(userItem._id, isFollowing)}
//                     >
//                         <Text style={[styles.followButtonText, isFollowing ? styles.unfollowButtonText : styles.followButtonTextActive]}>
//                             {isFollowing ? 'Following' : 'Follow'}
//                         </Text>
//                     </TouchableOpacity>
//                 )}
//             </View>
//         );
//     };

//     return (
//         <View style={styles.container}>
//             {/* Header */}
//             <View style={styles.header}>
//                 <TouchableOpacity onPress={() => router.back()}>
//                     <Ionicons name="arrow-back" size={24} color={COLORS.text} />
//                 </TouchableOpacity>
//                 <Text style={styles.headerTitle}>Users</Text>
//                 <View style={{ width: 24 }} />
//             </View>

//             {/* Tabs */}
//             <View style={styles.tabsContainer}>
//                 {(['all', 'followers', 'following'] as const).map(tab => (
//                     <TouchableOpacity
//                         key={tab}
//                         style={[styles.tab, activeTab === tab && styles.activeTab]}
//                         onPress={() => handleTabChange(tab)}
//                     >
//                         <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
//                             {tab === 'all' ? 'All Users' : tab === 'followers' ? 'Followers' : 'Following'}
//                         </Text>
//                     </TouchableOpacity>
//                 ))}
//             </View>

//             {/* Search */}
//             <View style={styles.searchContainer}>
//                 <Ionicons name="search-outline" size={20} color={COLORS.textLight} style={styles.searchIcon} />
//                 <TextInput
//                     style={styles.searchInput}
//                     placeholder={`Search ${activeTab}...`}
//                     value={searchQuery}
//                     onChangeText={handleSearch}
//                     autoCapitalize="none"
//                 />
//                 {searchQuery ? (
//                     <TouchableOpacity onPress={() => handleSearch('')}>
//                         <Ionicons name="close-circle" size={20} color={COLORS.textLight} />
//                     </TouchableOpacity>
//                 ) : null}
//             </View>

//             {/* List */}
//             {loading && !refreshing ? (
//                 <View style={styles.loadingContainer}>
//                     <ActivityIndicator size="large" color={COLORS.primary} />
//                     <Text style={styles.loadingText}>Loading users...</Text>
//                 </View>
//             ) : (
//                 <FlatList
//                     data={filteredUsers}
//                     renderItem={({ item }) => <UserItem user={item} />}
//                     keyExtractor={item => item._id}
//                     refreshControl={
//                         <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[COLORS.primary]} />
//                     }
//                     ListEmptyComponent={
//                         <View style={styles.emptyContainer}>
//                             <Ionicons name="people-outline" size={64} color={COLORS.textLight} />
//                             <Text style={styles.emptyText}>
//                                 {activeTab === 'all' ? 'No clients or companies found' :
//                                     activeTab === 'followers' ? 'No followers yet' :
//                                         'Not following anyone yet'}
//                             </Text>
//                         </View>
//                     }
//                     contentContainerStyle={styles.usersList}
//                     showsVerticalScrollIndicator={false}
//                 />
//             )}
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: COLORS.background,
//     },
//     header: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         paddingHorizontal: 20,
//         paddingVertical: 16,
//         backgroundColor: COLORS.surface,
//         borderBottomWidth: StyleSheet.hairlineWidth,
//         borderBottomColor: COLORS.border,
//     },
//     headerTitle: {
//         fontSize: 20,
//         fontWeight: '700',
//         color: COLORS.text,
//     },
//     tabsContainer: {
//         flexDirection: 'row',
//         paddingHorizontal: 20,
//         marginTop: 16,
//     },
//     tab: {
//         flex: 1,
//         paddingVertical: 12,
//         alignItems: 'center',
//         borderBottomWidth: 2,
//         borderBottomColor: 'transparent',
//     },
//     activeTab: {
//         borderBottomColor: COLORS.primary,
//     },
//     tabText: {
//         fontSize: 14,
//         fontWeight: '600',
//         color: COLORS.textLight,
//     },
//     activeTabText: {
//         color: COLORS.primary,
//     },
//     searchContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         backgroundColor: COLORS.surface,
//         marginHorizontal: 20,
//         marginTop: 16,
//         paddingHorizontal: 16,
//         paddingVertical: 12,
//         borderRadius: 12,
//         borderWidth: 1,
//         borderColor: COLORS.border,
//     },
//     searchIcon: {
//         marginRight: 10,
//     },
//     searchInput: {
//         flex: 1,
//         fontSize: 16,
//         color: COLORS.text,
//     },
//     usersList: {
//         paddingHorizontal: 20,
//         paddingBottom: 20,
//     },
//     userItem: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         paddingVertical: 16,
//         backgroundColor: COLORS.surface,
//         borderRadius: 12,
//         marginBottom: 12,
//         paddingHorizontal: 16,
//         ...Platform.select({
//             ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3 },
//             android: { elevation: 1 },
//         }),
//     },
//     userInfo: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         flex: 1,
//     },
//     avatarContainer: {
//         marginRight: 12,
//     },
//     avatar: {
//         width: 50,
//         height: 50,
//         borderRadius: 25,
//     },
//     avatarPlaceholder: {
//         width: 50,
//         height: 50,
//         borderRadius: 25,
//         backgroundColor: COLORS.primary,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     avatarText: {
//         color: COLORS.white,
//         fontSize: 18,
//         fontWeight: 'bold',
//     },
//     userDetails: {
//         flex: 1,
//     },
//     userName: {
//         fontSize: 16,
//         fontWeight: '600',
//         color: COLORS.text,
//         marginBottom: 2,
//     },
//     userEmail: {
//         fontSize: 14,
//         color: COLORS.textLight,
//         marginBottom: 2,
//     },
//     userBio: {
//         fontSize: 12,
//         color: COLORS.textLight,
//         lineHeight: 16,
//     },
//     userRole: {
//         fontSize: 12,
//         color: COLORS.primary,
//         fontStyle: 'italic',
//     },
//     followButton: {
//         paddingHorizontal: 16,
//         paddingVertical: 8,
//         borderRadius: 20,
//         borderWidth: 1,
//     },
//     followButtonActive: {
//         backgroundColor: COLORS.primary,
//         borderColor: COLORS.primary,
//     },
//     unfollowButton: {
//         backgroundColor: 'transparent',
//         borderColor: COLORS.textLight,
//     },
//     followButtonText: {
//         fontSize: 14,
//         fontWeight: '600',
//     },
//     followButtonTextActive: {
//         color: COLORS.white,
//     },
//     unfollowButtonText: {
//         color: COLORS.textLight,
//     },
//     loadingContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     loadingText: {
//         marginTop: 12,
//         fontSize: 16,
//         color: COLORS.textLight,
//     },
//     emptyContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         paddingVertical: 60,
//     },
//     emptyText: {
//         fontSize: 16,
//         color: COLORS.textLight,
//         textAlign: 'center',
//         marginTop: 16,
//     },
// });
// import { BASE_URL } from "@/constants/Api";
// import { COLORS } from "@/constants/theme";
// import { useAuthStore } from "@/stores/authstore";
// import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import { useEffect, useState } from "react";
// import {
//     View,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     FlatList,
//     StyleSheet,
//     Platform,
//     ActivityIndicator,
//     Alert,
//     RefreshControl,
//     Image
// } from "react-native";

// interface User {
//     _id: string;
//     name: string;
//     email: string;
//     avatarUrl?: string;
//     bio?: string;
//     role: 'client' | 'company' | 'admin' | 'staff';
//     followers: string[];
//     following: string[];
// }

// export default function Users() {
//     const router = useRouter();
//     const { user: currentUser, token } = useAuthStore();
//     const [allUsers, setAllUsers] = useState<User[]>([]);
//     const [followers, setFollowers] = useState<User[]>([]);
//     const [following, setFollowing] = useState<User[]>([]);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [loading, setLoading] = useState(true);
//     const [refreshing, setRefreshing] = useState(false);

//     const normalizeUserData = (userData: any): User => ({
//         _id: userData._id,
//         name: userData.name || '',
//         email: userData.email || '',
//         avatarUrl: userData.avatarUrl || userData.avatar || undefined,
//         bio: userData.bio || undefined,
//         role: userData.role || 'client',
//         followers: Array.isArray(userData.followers)
//             ? userData.followers.map((id: any) => String(id))
//             : [],
//         following: Array.isArray(userData.following)
//             ? userData.following.map((id: any) => String(id))
//             : [],
//     });

//     const fetchAllData = async () => {
//         try {
//             setLoading(true);

//             // جلب جميع العملاء والشركات
//             const allUsersRes = await fetch(`${BASE_URL}/api/auth/users/clients-companies`, {
//                 headers: { 'Authorization': `Bearer ${token}` },
//             });
//             const allUsersData = allUsersRes.ok ? await allUsersRes.json() : [];
//             const normalizedAll = allUsersData.map(normalizeUserData);

//             // جلب المتابعين والمتابَعين
//             let normalizedFollowers: User[] = [];
//             let normalizedFollowing: User[] = [];

//             if (currentUser?.id) {
//                 const connectionsRes = await fetch(`${BASE_URL}/api/auth/followersMe/${currentUser.id}`, {
//                     headers: { 'Authorization': `Bearer ${token}` },
//                 });

//                 if (connectionsRes.ok) {
//                     const connections = await connectionsRes.json();
//                     normalizedFollowers = (connections.followers || []).map(normalizeUserData);
//                     normalizedFollowing = (connections.following || []).map(normalizeUserData);
//                 }
//             }

//             setAllUsers(normalizedAll);
//             setFollowers(normalizedFollowers);
//             setFollowing(normalizedFollowing);
//         } catch (error: any) {
//             console.error('Error fetching data:', error);
//             Alert.alert('Error', error.message || 'Failed to load data');
//         } finally {
//             setLoading(false);
//             setRefreshing(false);
//         }
//     };

//     const handleFollow = async (targetUserId: string, isCurrentlyFollowing: boolean) => {
//         try {
//             const apiUrl = `${BASE_URL}/api/auth/follower/${targetUserId}`;
//             const response = await fetch(apiUrl, {
//                 method: 'POST',
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json',
//                 },
//             });

//             if (!response.ok) {
//                 const error = await response.json();
//                 throw new Error(error.message || 'Operation failed');
//             }

//             // تحديث جميع القوائم لأن المستخدم قد يظهر في أكثر من قسم
//             fetchAllData();
//             Alert.alert('Success', `User ${isCurrentlyFollowing ? 'unfollowed' : 'followed'} successfully`);
//         } catch (error: any) {
//             console.error('Follow error:', error);
//             Alert.alert('Error', error.message || 'Failed to update follow status');
//         }
//     };

//     const handleSearch = (text: string) => {
//         setSearchQuery(text);
//     };

//     const handleRefresh = () => {
//         setRefreshing(true);
//         fetchAllData();
//     };

//     const filteredAllUsers = allUsers.filter(u =>
//         u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         u.email.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//     const filteredFollowers = followers.filter(u =>
//         u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         u.email.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//     const filteredFollowing = following.filter(u =>
//         u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         u.email.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//     useEffect(() => {
//         fetchAllData();
//     }, []);

//     const UserItem = ({ user: userItem }: { user: User }) => {
//         const isCurrentUser = userItem._id === currentUser?.id;
//         const isFollowing = userItem.followers.includes(currentUser?.id || '');

//         return (
//             <View style={styles.userItem}>
//                 <View style={styles.userInfo}>
//                     <View style={styles.avatarContainer}>
//                         {userItem.avatarUrl ? (
//                             <Image source={{ uri: userItem.avatarUrl }} style={styles.avatar} />
//                         ) : (
//                             <View style={styles.avatarPlaceholder}>
//                                 <Text style={styles.avatarText}>
//                                     {userItem.name.charAt(0).toUpperCase()}
//                                 </Text>
//                             </View>
//                         )}
//                     </View>
//                     <View style={styles.userDetails}>
//                         <Text style={styles.userName}>{userItem.name}</Text>
//                         <Text style={styles.userEmail}>{userItem.email}</Text>
//                         {userItem.bio && <Text style={styles.userBio} numberOfLines={2}>{userItem.bio}</Text>}
//                         <Text style={styles.userRole}>{userItem.role.charAt(0).toUpperCase() + userItem.role.slice(1)}</Text>
//                     </View>
//                 </View>

//                 {!isCurrentUser && (
//                     <TouchableOpacity
//                         style={[styles.followButton, isFollowing ? styles.unfollowButton : styles.followButtonActive]}
//                         onPress={() => handleFollow(userItem._id, isFollowing)}
//                     >
//                         <Text style={[styles.followButtonText, isFollowing ? styles.unfollowButtonText : styles.followButtonTextActive]}>
//                             {isFollowing ? 'Following' : 'Follow'}
//                         </Text>
//                     </TouchableOpacity>
//                 )}
//             </View>
//         );
//     };

//     const SectionHeader = ({ title, count }: { title: string; count: number }) => (
//         <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitle}>{title}</Text>
//             <Text style={styles.sectionCount}>{count}</Text>
//         </View>
//     );

//     if (loading && !refreshing) {
//         return (
//             <View style={styles.loadingContainer}>
//                 <ActivityIndicator size="large" color={COLORS.primary} />
//                 <Text style={styles.loadingText}>Loading users...</Text>
//             </View>
//         );
//     }

//     return (
//         <View style={styles.container}>
//             {/* Header */}
//             <View style={styles.header}>
//                 <TouchableOpacity onPress={() => router.back()}>
//                     <Ionicons name="arrow-back" size={24} color={COLORS.text} />
//                 </TouchableOpacity>
//                 <Text style={styles.headerTitle}>Users</Text>
//                 <View style={{ width: 24 }} />
//             </View>

//             {/* Search */}
//             <View style={styles.searchContainer}>
//                 <Ionicons name="search-outline" size={20} color={COLORS.textLight} style={styles.searchIcon} />
//                 <TextInput
//                     style={styles.searchInput}
//                     placeholder="Search all sections..."
//                     value={searchQuery}
//                     onChangeText={handleSearch}
//                     autoCapitalize="none"
//                 />
//                 {searchQuery ? (
//                     <TouchableOpacity onPress={() => setSearchQuery('')}>
//                         <Ionicons name="close-circle" size={20} color={COLORS.textLight} />
//                     </TouchableOpacity>
//                 ) : null}
//             </View>

//             {/* Scrollable Content */}
//             <FlatList
//                 data={[]}
//                 renderItem={null}
//                 keyExtractor={() => 'empty'}
//                 refreshControl={
//                     <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[COLORS.primary]} />
//                 }
//                 ListHeaderComponent={
//                     <>
//                         {/* All Users */}
//                         <SectionHeader title="All Users" count={filteredAllUsers.length} />
//                         {filteredAllUsers.length > 0 ? (
//                             filteredAllUsers.map(user => <UserItem key={user._id} user={user} />)
//                         ) : (
//                             <Text style={styles.emptySectionText}>No clients or companies found</Text>
//                         )}

//                         {/* My Followers */}
//                         <SectionHeader title="My Followers" count={filteredFollowers.length} />
//                         {filteredFollowers.length > 0 ? (
//                             filteredFollowers.map(user => <UserItem key={user._id} user={user} />)
//                         ) : (
//                             <Text style={styles.emptySectionText}>No followers yet</Text>
//                         )}

//                         {/* I'm Following */}
//                         <SectionHeader title="I'm Following" count={filteredFollowing.length} />
//                         {filteredFollowing.length > 0 ? (
//                             filteredFollowing.map(user => <UserItem key={user._id} user={user} />)
//                         ) : (
//                             <Text style={styles.emptySectionText}>Not following anyone yet</Text>
//                         )}
//                     </>
//                 }
//                 contentContainerStyle={styles.contentContainer}
//                 showsVerticalScrollIndicator={false}
//             />
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: COLORS.background,
//     },
//     header: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         paddingHorizontal: 20,
//         paddingVertical: 16,
//         backgroundColor: COLORS.surface,
//         borderBottomWidth: StyleSheet.hairlineWidth,
//         borderBottomColor: COLORS.border,
//     },
//     headerTitle: {
//         fontSize: 20,
//         fontWeight: '700',
//         color: COLORS.text,
//     },
//     searchContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         backgroundColor: COLORS.surface,
//         marginHorizontal: 20,
//         marginTop: 16,
//         paddingHorizontal: 16,
//         paddingVertical: 12,
//         borderRadius: 12,
//         borderWidth: 1,
//         borderColor: COLORS.border,
//     },
//     searchIcon: {
//         marginRight: 10,
//     },
//     searchInput: {
//         flex: 1,
//         fontSize: 16,
//         color: COLORS.text,
//     },
//     contentContainer: {
//         padding: 20,
//     },
//     sectionHeader: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginVertical: 16,
//     },
//     sectionTitle: {
//         fontSize: 18,
//         fontWeight: '700',
//         color: COLORS.text,
//     },
//     sectionCount: {
//         fontSize: 16,
//         color: COLORS.textLight,
//     },
//     userItem: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         paddingVertical: 16,
//         backgroundColor: COLORS.surface,
//         borderRadius: 12,
//         marginBottom: 12,
//         paddingHorizontal: 16,
//         ...Platform.select({
//             ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3 },
//             android: { elevation: 1 },
//         }),
//     },
//     userInfo: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         flex: 1,
//     },
//     avatarContainer: {
//         marginRight: 12,
//     },
//     avatar: {
//         width: 50,
//         height: 50,
//         borderRadius: 25,
//     },
//     avatarPlaceholder: {
//         width: 50,
//         height: 50,
//         borderRadius: 25,
//         backgroundColor: COLORS.primary,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     avatarText: {
//         color: COLORS.white,
//         fontSize: 18,
//         fontWeight: 'bold',
//     },
//     userDetails: {
//         flex: 1,
//     },
//     userName: {
//         fontSize: 16,
//         fontWeight: '600',
//         color: COLORS.text,
//         marginBottom: 2,
//     },
//     userEmail: {
//         fontSize: 14,
//         color: COLORS.textLight,
//         marginBottom: 2,
//     },
//     userBio: {
//         fontSize: 12,
//         color: COLORS.textLight,
//         lineHeight: 16,
//     },
//     userRole: {
//         fontSize: 12,
//         color: COLORS.primary,
//         fontStyle: 'italic',
//     },
//     followButton: {
//         paddingHorizontal: 16,
//         paddingVertical: 8,
//         borderRadius: 20,
//         borderWidth: 1,
//     },
//     followButtonActive: {
//         backgroundColor: COLORS.primary,
//         borderColor: COLORS.primary,
//     },
//     unfollowButton: {
//         backgroundColor: 'transparent',
//         borderColor: COLORS.textLight,
//     },
//     followButtonText: {
//         fontSize: 14,
//         fontWeight: '600',
//     },
//     followButtonTextActive: {
//         color: COLORS.white,
//     },
//     unfollowButtonText: {
//         color: COLORS.textLight,
//     },
//     emptySectionText: {
//         fontSize: 14,
//         color: COLORS.textLight,
//         textAlign: 'center',
//         marginVertical: 8,
//         fontStyle: 'italic',
//     },
//     loadingContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     loadingText: {
//         marginTop: 12,
//         fontSize: 16,
//         color: COLORS.textLight,
//     },
// });


import { BASE_URL } from "@/constants/Api";
import { COLORS } from "@/constants/theme";
import { useAuthStore } from "@/stores/authstore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { routeToScreen } from "expo-router/build/useScreens";
import { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Platform,
    ActivityIndicator,
    Alert,
    RefreshControl,
    Image,
    StatusBar
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface User {
    _id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    bio?: string;
    role: 'client' | 'company';
    followers: string[];
}

export default function Users() {
    const router = useRouter();
    const { user: currentUser, token } = useAuthStore();
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const normalizeUserData = (userData: any): User => ({
        _id: userData._id,
        name: userData.name || '',
        email: userData.email || '',
        avatarUrl: userData.avatarUrl || userData.avatar || undefined,
        bio: userData.bio || undefined,
        role: userData.role || 'client',
        followers: Array.isArray(userData.followers)
            ? userData.followers.map((id: any) => String(id))
            : [],
    });

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${BASE_URL}/api/auth/users/clients-companies`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Failed to load users');
            }

            const data = await res.json();
            const normalized = data.map(normalizeUserData);
            setUsers(normalized);
            setFilteredUsers(normalized);
        } catch (error: any) {
            console.error('Error:', error);
            Alert.alert('Error', error.message || 'Could not load users');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleFollow = async (targetUserId: string, isCurrentlyFollowing: boolean) => {
        try {
            const res = await fetch(`${BASE_URL}/api/auth/follower/${targetUserId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Operation failed');
            }

            const updatedUsers = users.map(u => {
                if (u._id === targetUserId) {
                    const updatedFollowers = isCurrentlyFollowing
                        ? u.followers.filter(id => id !== currentUser?.id)
                        : [...u.followers, currentUser?.id].filter(Boolean) as string[];
                    return { ...u, followers: updatedFollowers };
                }
                return u;
            });

            setUsers(updatedUsers);
            setFilteredUsers(updatedUsers);
            Alert.alert('Success', `User ${isCurrentlyFollowing ? 'unfollowed' : 'followed'} successfully`);
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to update follow status');
        }
    };

    const handleSearch = (text: string) => {
        setSearchQuery(text);
        const filtered = users.filter(u =>
            u.name.toLowerCase().includes(text.toLowerCase()) ||
            u.email.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredUsers(filtered);
    };

    const handleRefresh = () => {
        setRefreshing(true);
        fetchUsers();
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const UserItem = ({ user }: { user: User }) => {
        const isCurrentUser = user._id === currentUser?.id;
        const isFollowing = user.followers.includes(currentUser?.id || '');

        if (isCurrentUser) return null; // ضمان عدم الظهور

        return (
            <View style={styles.userItem}>
                <View style={styles.userInfo}>
                    <View style={styles.avatarContainer}>
                        <TouchableOpacity onPress={() => router.push(`/user/${user._id}`)}>
                            {user.avatarUrl ? (
                                <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
                            ) : (
                                <View style={styles.avatarPlaceholder}>
                                    <Text style={styles.avatarText}>
                                        {user.name.charAt(0).toUpperCase()}
                                    </Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
                    <View style={styles.userDetails}>
                        <Text style={styles.userName}>{user.name}</Text>
                        {/* <Text style={styles.userEmail}>{user.email}</Text> */}
                        {user.bio && <Text style={styles.userBio} numberOfLines={2}>{user.bio}</Text>}
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.followButton, isFollowing ? styles.unfollowButton : styles.followButtonActive]}
                    onPress={() => handleFollow(user._id, isFollowing)}
                >
                    <Text style={[styles.followButtonText, isFollowing ? styles.unfollowButtonText : styles.followButtonTextActive]}>
                        {isFollowing ? 'Following' : 'Follow'}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Users</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={20} color={COLORS.textLight} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search users..."
                    value={searchQuery}
                    onChangeText={handleSearch}
                    autoCapitalize="none"
                />
                {searchQuery ? (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <Ionicons name="close-circle" size={20} color={COLORS.textLight} />
                    </TouchableOpacity>
                ) : null}
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={styles.loadingText}>Loading...</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredUsers}
                    renderItem={({ item }) => <UserItem user={item} />}
                    keyExtractor={item => item._id}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[COLORS.primary]} />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No users found</Text>
                        </View>
                    }
                    contentContainerStyle={styles.listContent}
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
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        marginHorizontal: 25,
        marginVertical: 20,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: COLORS.text,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    userItem: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
        paddingVertical: 16,
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        marginBottom: 12,
        paddingHorizontal: 16,
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3 },
            android: { elevation: 1 },
        }),
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        marginRight: 12,
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
    userDetails: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
    },
    userEmail: {
        fontSize: 14,
        color: COLORS.textLight,
        marginTop: 2,
    },
    userBio: {
        fontSize: 12,
        color: COLORS.textLight,
        lineHeight: 16,
        marginTop: 4,
    },
    followButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        position: "absolute",
        right: 10,

    },
    followButtonActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    unfollowButton: {
        backgroundColor: 'transparent',
        borderColor: COLORS.textLight,
    },
    followButtonText: {

        fontSize: 12,
        fontWeight: '600',
    },
    followButtonTextActive: {
        color: 'white',
    },
    unfollowButtonText: {
        color: COLORS.textLight,
    },
    loadingContainer: {
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
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 16,
        color: COLORS.textLight,
    },
});