// import React, { useState, useEffect, JSX } from 'react';
// import {
//     StyleSheet,
//     Text,
//     View,
//     FlatList,
//     TouchableOpacity,
//     ActivityIndicator,
//     RefreshControl,
//     Alert,
//     Image,
//     Modal,
//     TextInput,
//     ScrollView,
//     Dimensions
// } from 'react-native';
// import axios from 'axios';
// import { Ionicons } from '@expo/vector-icons';
// import { useAuthStore } from '@/stores/authstore';
// import { BASE_URL } from '@/constants/Api';
// import { COLORS } from '@/constants/theme';

// // تعريف الأنواع
// interface User {
//     _id: string;
//     name: string;
//     avatar?: string;
//     email?: string;
// }

// interface Company {
//     _id: string;
//     name: string;
//     logo?: string;
// }

// interface Post {
//     _id: string;
//     title: string;
//     content: string;
//     image?: string;
//     images?: string[];
//     company?: Company;
//     user?: User;
//     isApproved: boolean;
//     likes: string[];
//     createdAt: string;
//     updatedAt: string;
//     imageUrl?: string;
//     imagesUrls?: string[];
// }

// type TabType = 'all' | 'approved' | 'pending';

// const { width } = Dimensions.get('window');

// const PostsScreen: React.FC = () => {
//     const { user, token } = useAuthStore();
//     const [posts, setPosts] = useState<Post[]>([]);
//     const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
//     const [loading, setLoading] = useState<boolean>(true);
//     const [refreshing, setRefreshing] = useState<boolean>(false);
//     const [activeTab, setActiveTab] = useState<TabType>('all');
//     const [stats, setStats] = useState({
//         approved: 0,
//         pending: 0,
//         total: 0
//     });
//     const [selectedPost, setSelectedPost] = useState<Post | null>(null);
//     const [modalVisible, setModalVisible] = useState<boolean>(false);
//     const [searchQuery, setSearchQuery] = useState<string>('');
//     const [showSearch, setShowSearch] = useState<boolean>(false);

//     // جلب الإحصائيات - تم التصحيح
//     const fetchStats = async (): Promise<void> => {
//         try {
//             console.log('Fetching stats with token:', token ? 'Token exists' : 'No token');

//             const [allResponse, approvedResponse, pendingResponse] = await Promise.all([
//                 axios.get(`${BASE_URL}/api/posts/allPost`),
//                 axios.get(`${BASE_URL}/api/posts/`),
//                 axios.get(`${BASE_URL}/api/posts/getAllNotApprovedPosts`, {
//                     headers: token ? { Authorization: `Bearer ${token}` } : {}
//                 })
//             ]);

//             console.log('Stats Responses:', {
//                 all: allResponse.data,
//                 approved: approvedResponse.data,
//                 pending: pendingResponse.data
//             });

//             setStats({
//                 total: Array.isArray(allResponse.data) ? allResponse.data.length : 0,
//                 approved: Array.isArray(approvedResponse.data) ? approvedResponse.data.length : 0,
//                 pending: Array.isArray(pendingResponse.data) ? pendingResponse.data.length : 0
//             });
//         } catch (error: any) {
//             console.error('Error fetching stats:', {
//                 message: error.message,
//                 response: error.response?.data,
//                 url: error.config?.url
//             });
//         }
//     };

//     // جلب المنشورات بناءً على التبويب النشط - تم التصحيح
//     const fetchPosts = async (): Promise<void> => {
//         try {
//             setLoading(true);
//             let url = '';

//             // تحديد الرابط بناءً على التبويب - تم التصحيح
//             switch (activeTab) {
//                 case 'approved':
//                     url = `${BASE_URL}/api/posts/`; // يجلب المنشورات المعتمدة
//                     break;
//                 case 'pending':
//                     url = `${BASE_URL}/api/posts/getAllNotApprovedPosts`; // تم التصحيح هنا
//                     break;
//                 case 'all':
//                 default:
//                     url = `${BASE_URL}/api/posts/allPost`; // يجلب كل المنشورات
//                     break;
//             }

//             console.log('Fetching posts from:', url);
//             console.log('Active tab:', activeTab);

//             // إضافة التوكن فقط للمنشورات غير المعتمدة
//             const config = activeTab === 'pending' && token
//                 ? { headers: { Authorization: `Bearer ${token}` } }
//                 : {};

//             console.log('Request config:', config);

//             const response = await axios.get(url, config);
//             console.log('Response data:', response.data);

//             // معالجة الاستجابة بطرق مختلفة
//             if (response.data && Array.isArray(response.data)) {
//                 // إذا كانت الاستجابة مصفوفة مباشرة
//                 setPosts(response.data);
//                 setFilteredPosts(response.data);
//                 console.log(`Loaded ${response.data.length} posts`);
//             } else if (response.data?.data && Array.isArray(response.data.data)) {
//                 // إذا كانت البيانات داخل خاصية data
//                 setPosts(response.data.data);
//                 setFilteredPosts(response.data.data);
//                 console.log(`Loaded ${response.data.data.length} posts from data property`);
//             } else if (response.data?.success && Array.isArray(response.data.data)) {
//                 // إذا كان هناك بنية success/data
//                 setPosts(response.data.data);
//                 setFilteredPosts(response.data.data);
//                 console.log(`Loaded ${response.data.data.length} posts from success/data structure`);
//             } else {
//                 console.log('Unexpected response structure:', response.data);
//                 setPosts([]);
//                 setFilteredPosts([]);
//             }

//         } catch (error: any) {
//             console.error('Error fetching posts:', {
//                 message: error.message,
//                 response: error.response?.data,
//                 url: error.config?.url,
//                 status: error.response?.status
//             });

//             let errorMessage = 'حدث خطأ في جلب البيانات';

//             if (error.response?.status === 404) {
//                 errorMessage = 'الرابط غير صحيح. تحقق من عنوان API';
//             } else if (error.response?.status === 401) {
//                 errorMessage = 'غير مصرح لك. يرجى تسجيل الدخول';
//             } else if (error.response?.data?.message) {
//                 errorMessage = error.response.data.message;
//             }

//             Alert.alert('خطأ', errorMessage);
//         } finally {
//             setLoading(false);
//             setRefreshing(false);
//         }
//     };

//     useEffect(() => {
//         fetchPosts();
//         fetchStats();
//     }, [activeTab, token]); // أضف token كاعتمادية

//     // البحث في المنشورات
//     useEffect(() => {
//         if (searchQuery.trim() === '') {
//             setFilteredPosts(posts);
//         } else {
//             const filtered = posts.filter(post =>
//                 post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                 post.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                 post.company?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                 post.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
//             );
//             setFilteredPosts(filtered);
//         }
//     }, [searchQuery, posts]);

//     const onRefresh = (): void => {
//         setRefreshing(true);
//         fetchPosts();
//         fetchStats();
//     };

//     // الموافقة على منشور - تم التصحيح
//     const handleApprovePost = async (postId: string): Promise<void> => {
//         try {
//             Alert.alert(
//                 'موافقة على المنشور',
//                 'هل تريد الموافقة على هذا المنشور؟',
//                 [
//                     { text: 'إلغاء', style: 'cancel' },
//                     {
//                         text: 'موافقة',
//                         onPress: async () => {
//                             const response = await axios.patch(
//                                 `${BASE_URL}/posts/${postId}/approve`, // تم التصحيح هنا
//                                 {},
//                                 { headers: { Authorization: `Bearer ${token}` } }
//                             );

//                             if (response.data) {
//                                 Alert.alert('نجاح', 'تمت الموافقة على المنشور');
//                                 fetchPosts();
//                                 fetchStats();
//                             }
//                         }
//                     }
//                 ]
//             );
//         } catch (error: any) {
//             console.error('Error approving post:', error);
//             Alert.alert('خطأ', error.response?.data?.message || 'فشل في الموافقة على المنشور');
//         }
//     };

//     // رفض منشور - تم التصحيح
//     const handleRejectPost = async (postId: string): Promise<void> => {
//         try {
//             Alert.alert(
//                 'رفض المنشور',
//                 'هل تريد رفض هذا المنشور؟',
//                 [
//                     { text: 'إلغاء', style: 'cancel' },
//                     {
//                         text: 'رفض',
//                         style: 'destructive',
//                         onPress: async () => {
//                             const response = await axios.delete(
//                                 `${BASE_URL}/posts/${postId}/reject`, // تم التصحيح هنا
//                                 { headers: { Authorization: `Bearer ${token}` } }
//                             );

//                             if (response.data) {
//                                 Alert.alert('نجاح', 'تم رفض المنشور');
//                                 fetchPosts();
//                                 fetchStats();
//                             }
//                         }
//                     }
//                 ]
//             );
//         } catch (error: any) {
//             console.error('Error rejecting post:', error);
//             Alert.alert('خطأ', error.response?.data?.message || 'فشل في رفض المنشور');
//         }
//     };

//     // حذف منشور - تم التصحيح
//     const handleDeletePost = async (postId: string): Promise<void> => {
//         try {
//             Alert.alert(
//                 'حذف المنشور',
//                 'هل أنت متأكد من حذف هذا المنشور؟',
//                 [
//                     { text: 'إلغاء', style: 'cancel' },
//                     {
//                         text: 'حذف',
//                         style: 'destructive',
//                         onPress: async () => {
//                             const response = await axios.delete(
//                                 `${BASE_URL}/posts/${postId}`, // تم التصحيح هنا
//                                 { headers: { Authorization: `Bearer ${token}` } }
//                             );

//                             if (response.data) {
//                                 Alert.alert('نجاح', 'تم حذف المنشور');
//                                 fetchPosts();
//                                 fetchStats();
//                             }
//                         }
//                     }
//                 ]
//             );
//         } catch (error: any) {
//             console.error('Error deleting post:', error);
//             Alert.alert('خطأ', error.response?.data?.message || 'فشل في حذف المنشور');
//         }
//     };

//     // عرض تفاصيل المنشور
//     const showPostDetails = (post: Post): void => {
//         setSelectedPost(post);
//         setModalVisible(true);
//     };

//     // دالة مساعدة لعرض الصور بشكل آمن
//     const getImageUrl = (post: Post): string | undefined => {
//         if (post.imageUrl) return post.imageUrl;
//         if (post.image) {
//             // تحويل المسار إذا لزم الأمر
//             const imagePath = post.image.replace(/\\/g, '/');
//             return `${BASE_URL}${imagePath}`;
//         }
//         return undefined;
//     };

//     // عرض عنصر المنشور
//     const renderPostItem = ({ item }: { item: Post }): JSX.Element => {
//         const imageUrl = getImageUrl(item);

//         return (
//             <TouchableOpacity
//                 style={styles.postCard}
//                 activeOpacity={0.8}
//                 onPress={() => showPostDetails(item)}
//             >
//                 {/* صورة المنشور */}
//                 {imageUrl ? (
//                     <Image
//                         source={{ uri: imageUrl }}
//                         style={styles.postImage}
//                         resizeMode="cover"
//                         onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
//                     />
//                 ) : (
//                     <View style={styles.noImageContainer}>
//                         <Ionicons name="image-outline" size={40} color="#ccc" />
//                         <Text style={styles.noImageText}>لا توجد صورة</Text>
//                     </View>
//                 )}

//                 <View style={styles.postContent}>
//                     {/* العنوان والحالة */}
//                     <View style={styles.titleRow}>
//                         <Text style={styles.postTitle} numberOfLines={1}>
//                             {item.title || 'بدون عنوان'}
//                         </Text>
//                         <View style={[
//                             styles.statusBadge,
//                             item.isApproved ? styles.approvedBadge : styles.pendingBadge
//                         ]}>
//                             <Text style={styles.statusText}>
//                                 {item.isApproved ? '✓' : '⌛'}
//                             </Text>
//                         </View>
//                     </View>

//                     {/* المحتوى */}
//                     <Text style={styles.postContentText} numberOfLines={2}>
//                         {item.content || 'لا يوجد محتوى'}
//                     </Text>

//                     {/* معلومات إضافية */}
//                     <View style={styles.metaInfo}>
//                         {item.company && (
//                             <View style={styles.metaItem}>
//                                 <Ionicons name="business-outline" size={14} color="#666" />
//                                 <Text style={styles.metaText}>{item.company.name}</Text>
//                             </View>
//                         )}

//                         {item.user && (
//                             <View style={styles.metaItem}>
//                                 <Ionicons name="person-outline" size={14} color="#666" />
//                                 <Text style={styles.metaText}>{item.user.name}</Text>
//                             </View>
//                         )}

//                         <View style={styles.metaItem}>
//                             <Ionicons name="calendar-outline" size={14} color="#666" />
//                             <Text style={styles.metaText}>
//                                 {item.createdAt ? new Date(item.createdAt).toLocaleDateString('ar-SA') : 'غير معروف'}
//                             </Text>
//                         </View>
//                     </View>

//                     {/* أزرار الإجراءات */}
//                     <View style={styles.actionsContainer}>
//                         {!item.isApproved && (
//                             <>
//                                 <TouchableOpacity
//                                     style={styles.approveButton}
//                                     onPress={() => handleApprovePost(item._id)}
//                                 >
//                                     <Ionicons name="checkmark-circle" size={18} color="white" />
//                                     <Text style={styles.buttonText}>موافقة</Text>
//                                 </TouchableOpacity>

//                                 <TouchableOpacity
//                                     style={styles.rejectButton}
//                                     onPress={() => handleRejectPost(item._id)}
//                                 >
//                                     <Ionicons name="close-circle" size={18} color="white" />
//                                     <Text style={styles.buttonText}>رفض</Text>
//                                 </TouchableOpacity>
//                             </>
//                         )}

//                         <TouchableOpacity
//                             style={styles.deleteButton}
//                             onPress={() => handleDeletePost(item._id)}
//                         >
//                             <Ionicons name="trash-outline" size={18} color="white" />
//                             <Text style={styles.buttonText}>حذف</Text>
//                         </TouchableOpacity>

//                         <TouchableOpacity
//                             style={styles.detailsButton}
//                             onPress={() => showPostDetails(item)}
//                         >
//                             <Ionicons name="information-circle-outline" size={18} color={COLORS.primary} />
//                             <Text style={styles.detailsButtonText}>تفاصيل</Text>
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//             </TouchableOpacity>
//         );
//     };

//     return (
//         <View style={styles.container}>
//             {/* الترويسة */}
//             <View style={styles.header}>
//                 <View style={styles.headerTop}>
//                     <Text style={styles.headerTitle}>إدارة المنشورات</Text>
//                     <TouchableOpacity
//                         style={styles.searchButton}
//                         onPress={() => setShowSearch(!showSearch)}
//                     >
//                         <Ionicons name="search-outline" size={24} color="white" />
//                     </TouchableOpacity>
//                 </View>

//                 {/* شريط البحث */}
//                 {showSearch && (
//                     <View style={styles.searchContainer}>
//                         <TextInput
//                             style={styles.searchInput}
//                             placeholder="ابحث في المنشورات..."
//                             placeholderTextColor="#999"
//                             value={searchQuery}
//                             onChangeText={setSearchQuery}
//                         />
//                         {searchQuery.length > 0 && (
//                             <TouchableOpacity onPress={() => setSearchQuery('')}>
//                                 <Ionicons name="close-outline" size={20} color="#999" />
//                             </TouchableOpacity>
//                         )}
//                     </View>
//                 )}

//                 {/* الإحصائيات */}
//                 <View style={styles.statsContainer}>
//                     <View style={styles.statItem}>
//                         <Text style={styles.statNumber}>{stats.total}</Text>
//                         <Text style={styles.statLabel}>الكل</Text>
//                     </View>
//                     <View style={[styles.statItem, styles.approvedStat]}>
//                         <Text style={styles.statNumber}>{stats.approved}</Text>
//                         <Text style={styles.statLabel}>معتمد</Text>
//                     </View>
//                     <View style={[styles.statItem, styles.pendingStat]}>
//                         <Text style={styles.statNumber}>{stats.pending}</Text>
//                         <Text style={styles.statLabel}>قيد المراجعة</Text>
//                     </View>
//                 </View>
//             </View>

//             {/* أزرار التبويب */}
//             <View style={styles.tabContainer}>
//                 <TouchableOpacity
//                     style={[styles.tabButton, activeTab === 'all' && styles.activeTabButton]}
//                     onPress={() => setActiveTab('all')}
//                 >
//                     <Ionicons
//                         name="list-outline"
//                         size={20}
//                         color={activeTab === 'all' ? COLORS.primary : '#666'}
//                     />
//                     <Text style={[
//                         styles.tabText,
//                         activeTab === 'all' && styles.activeTabText
//                     ]}>
//                         الكل
//                     </Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                     style={[styles.tabButton, activeTab === 'approved' && styles.activeTabButton]}
//                     onPress={() => setActiveTab('approved')}
//                 >
//                     <Ionicons
//                         name="checkmark-done-outline"
//                         size={20}
//                         color={activeTab === 'approved' ? COLORS.primary : '#666'}
//                     />
//                     <Text style={[
//                         styles.tabText,
//                         activeTab === 'approved' && styles.activeTabText
//                     ]}>
//                         المعتمدة
//                     </Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                     style={[styles.tabButton, activeTab === 'pending' && styles.activeTabButton]}
//                     onPress={() => setActiveTab('pending')}
//                 >
//                     <Ionicons
//                         name="time-outline"
//                         size={20}
//                         color={activeTab === 'pending' ? COLORS.primary : '#666'}
//                     />
//                     <Text style={[
//                         styles.tabText,
//                         activeTab === 'pending' && styles.activeTabText
//                     ]}>
//                         قيد المراجعة
//                     </Text>
//                 </TouchableOpacity>
//             </View>

//             {/* القائمة */}
//             {loading ? (
//                 <View style={styles.centerContainer}>
//                     <ActivityIndicator size="large" color={COLORS.primary} />
//                     <Text style={styles.loadingText}>جاري تحميل البيانات...</Text>
//                 </View>
//             ) : (
//                 <FlatList
//                     data={filteredPosts}
//                     renderItem={renderPostItem}
//                     keyExtractor={(item) => item._id || Math.random().toString()}
//                     contentContainerStyle={styles.listContainer}
//                     refreshControl={
//                         <RefreshControl
//                             refreshing={refreshing}
//                             onRefresh={onRefresh}
//                             colors={[COLORS.primary]}
//                             tintColor={COLORS.primary}
//                         />
//                     }
//                     ListEmptyComponent={
//                         <View style={styles.emptyContainer}>
//                             <Ionicons name="document-text-outline" size={60} color="#ccc" />
//                             <Text style={styles.emptyText}>
//                                 {searchQuery
//                                     ? 'لا توجد نتائج للبحث'
//                                     : activeTab === 'all'
//                                         ? 'لا توجد منشورات'
//                                         : activeTab === 'approved'
//                                             ? 'لا توجد منشورات معتمدة'
//                                             : 'لا توجد منشورات قيد المراجعة'
//                                 }
//                             </Text>
//                             {!token && activeTab === 'pending' && (
//                                 <Text style={styles.authMessage}>
//                                     تحتاج إلى تسجيل الدخول لعرض المنشورات قيد المراجعة
//                                 </Text>
//                             )}
//                         </View>
//                     }
//                     ListFooterComponent={<View style={{ margin: 30 }}></View>}
//                 />
//             )}

//             {/* نافذة تفاصيل المنشور */}
//             <Modal
//                 animationType="slide"
//                 transparent={true}
//                 visible={modalVisible}
//                 onRequestClose={() => setModalVisible(false)}
//             >
//                 <View style={styles.modalContainer}>
//                     <View style={styles.modalContent}>
//                         <View style={styles.modalHeader}>
//                             <Text style={styles.modalTitle}>تفاصيل المنشور</Text>
//                             <TouchableOpacity onPress={() => setModalVisible(false)}>
//                                 <Ionicons name="close-outline" size={24} color="#666" />
//                             </TouchableOpacity>
//                         </View>

//                         <ScrollView style={styles.modalBody}>
//                             {selectedPost && (
//                                 <>
//                                     <Text style={styles.detailTitle}>
//                                         {selectedPost.title || 'بدون عنوان'}
//                                     </Text>

//                                     {getImageUrl(selectedPost) && (
//                                         <Image
//                                             source={{ uri: getImageUrl(selectedPost) }}
//                                             style={styles.detailImage}
//                                             resizeMode="cover"
//                                         />
//                                     )}

//                                     <Text style={styles.detailContent}>
//                                         {selectedPost.content || 'لا يوجد محتوى'}
//                                     </Text>

//                                     <View style={styles.detailMeta}>
//                                         <View style={styles.detailRow}>
//                                             <Text style={styles.detailLabel}>الحالة:</Text>
//                                             <Text style={[
//                                                 styles.detailValue,
//                                                 selectedPost.isApproved ? styles.approvedText : styles.pendingText
//                                             ]}>
//                                                 {selectedPost.isApproved ? 'معتمد' : 'قيد المراجعة'}
//                                             </Text>
//                                         </View>

//                                         {selectedPost.company && (
//                                             <View style={styles.detailRow}>
//                                                 <Text style={styles.detailLabel}>الشركة:</Text>
//                                                 <Text style={styles.detailValue}>
//                                                     {selectedPost.company.name}
//                                                 </Text>
//                                             </View>
//                                         )}

//                                         {selectedPost.user && (
//                                             <View style={styles.detailRow}>
//                                                 <Text style={styles.detailLabel}>المستخدم:</Text>
//                                                 <Text style={styles.detailValue}>
//                                                     {selectedPost.user.name}
//                                                 </Text>
//                                             </View>
//                                         )}

//                                         <View style={styles.detailRow}>
//                                             <Text style={styles.detailLabel}>تاريخ الإنشاء:</Text>
//                                             <Text style={styles.detailValue}>
//                                                 {selectedPost.createdAt
//                                                     ? new Date(selectedPost.createdAt).toLocaleString('ar-SA')
//                                                     : 'غير معروف'}
//                                             </Text>
//                                         </View>

//                                         <View style={styles.detailRow}>
//                                             <Text style={styles.detailLabel}>عدد الإعجابات:</Text>
//                                             <Text style={styles.detailValue}>
//                                                 {selectedPost.likes?.length || 0}
//                                             </Text>
//                                         </View>

//                                         {selectedPost.imagesUrls && selectedPost.imagesUrls.length > 0 && (
//                                             <View style={styles.detailRow}>
//                                                 <Text style={styles.detailLabel}>عدد الصور:</Text>
//                                                 <Text style={styles.detailValue}>
//                                                     {selectedPost.imagesUrls.length}
//                                                 </Text>
//                                             </View>
//                                         )}
//                                     </View>
//                                 </>
//                             )}
//                         </ScrollView>

//                         <View style={styles.modalFooter}>
//                             <TouchableOpacity
//                                 style={styles.closeButton}
//                                 onPress={() => setModalVisible(false)}
//                             >
//                                 <Text style={styles.closeButtonText}>إغلاق</Text>
//                             </TouchableOpacity>
//                         </View>
//                     </View>
//                 </View>
//             </Modal>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#f8f9fa',
//     },
//     header: {
//         backgroundColor: COLORS.primary,
//         padding: 15,
//         paddingTop: 50,
//     },
//     headerTop: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: 10,
//     },
//     headerTitle: {
//         color: 'white',
//         fontSize: 22,
//         fontWeight: 'bold',
//     },
//     searchButton: {
//         padding: 5,
//     },
//     searchContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         backgroundColor: 'rgba(255,255,255,0.9)',
//         borderRadius: 8,
//         paddingHorizontal: 10,
//         marginBottom: 15,
//     },
//     searchInput: {
//         flex: 1,
//         padding: 10,
//         color: '#333',
//         fontSize: 14,
//     },
//     statsContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-around',
//     },
//     statItem: {
//         alignItems: 'center',
//         backgroundColor: 'rgba(255,255,255,0.2)',
//         padding: 10,
//         borderRadius: 8,
//         minWidth: 80,
//     },
//     approvedStat: {
//         backgroundColor: 'rgba(40,167,69,0.3)',
//     },
//     pendingStat: {
//         backgroundColor: 'rgba(255,193,7,0.3)',
//     },
//     statNumber: {
//         color: 'white',
//         fontSize: 20,
//         fontWeight: 'bold',
//     },
//     statLabel: {
//         color: 'white',
//         fontSize: 12,
//         marginTop: 5,
//     },
//     tabContainer: {
//         flexDirection: 'row',
//         backgroundColor: 'white',
//         borderBottomWidth: 1,
//         borderBottomColor: '#e0e0e0',
//     },
//     tabButton: {
//         flex: 1,
//         padding: 15,
//         alignItems: 'center',
//         flexDirection: 'row',
//         justifyContent: 'center',
//     },
//     activeTabButton: {
//         borderBottomWidth: 3,
//         borderBottomColor: COLORS.primary,
//         backgroundColor: '#f0f8ff',
//     },
//     tabText: {
//         fontSize: 14,
//         color: '#666',
//         fontWeight: '500',
//         marginLeft: 5,
//     },
//     activeTabText: {
//         color: COLORS.primary,
//         fontWeight: 'bold',
//     },
//     listContainer: {
//         padding: 15,
//     },
//     postCard: {
//         backgroundColor: 'white',
//         borderRadius: 12,
//         marginBottom: 15,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 6,
//         elevation: 3,
//         overflow: 'hidden',
//     },
//     postImage: {
//         width: '100%',
//         height: 180,
//     },
//     noImageContainer: {
//         width: '100%',
//         height: 180,
//         backgroundColor: '#f5f5f5',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     noImageText: {
//         color: '#999',
//         marginTop: 5,
//         fontSize: 12,
//     },
//     postContent: {
//         padding: 15,
//     },
//     titleRow: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: 10,
//     },
//     postTitle: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         color: '#333',
//         flex: 1,
//         marginRight: 10,
//     },
//     statusBadge: {
//         width: 30,
//         height: 30,
//         borderRadius: 15,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     approvedBadge: {
//         backgroundColor: '#d4edda',
//     },
//     pendingBadge: {
//         backgroundColor: '#fff3cd',
//     },
//     statusText: {
//         fontSize: 16,
//         fontWeight: 'bold',
//     },
//     postContentText: {
//         fontSize: 14,
//         color: '#666',
//         lineHeight: 22,
//         marginBottom: 15,
//     },
//     metaInfo: {
//         flexDirection: 'row',
//         flexWrap: 'wrap',
//         marginBottom: 15,
//     },
//     metaItem: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginRight: 15,
//         marginBottom: 5,
//     },
//     metaText: {
//         fontSize: 12,
//         color: '#666',
//         marginLeft: 5,
//     },
//     actionsContainer: {
//         flexDirection: 'row',
//         flexWrap: 'wrap',
//         gap: 10,
//     },
//     approveButton: {
//         backgroundColor: '#28a745',
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingHorizontal: 12,
//         paddingVertical: 8,
//         borderRadius: 8,
//         flex: 1,
//         minWidth: 80,
//         justifyContent: 'center',
//     },
//     rejectButton: {
//         backgroundColor: '#dc3545',
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingHorizontal: 12,
//         paddingVertical: 8,
//         borderRadius: 8,
//         flex: 1,
//         minWidth: 80,
//         justifyContent: 'center',
//     },
//     deleteButton: {
//         backgroundColor: '#6c757d',
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingHorizontal: 12,
//         paddingVertical: 8,
//         borderRadius: 8,
//         flex: 1,
//         minWidth: 80,
//         justifyContent: 'center',
//     },
//     detailsButton: {
//         backgroundColor: 'transparent',
//         borderWidth: 1,
//         borderColor: COLORS.primary,
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingHorizontal: 12,
//         paddingVertical: 8,
//         borderRadius: 8,
//         flex: 1,
//         minWidth: 80,
//         justifyContent: 'center',
//     },
//     buttonText: {
//         color: 'white',
//         fontSize: 12,
//         fontWeight: '600',
//         marginLeft: 5,
//     },
//     detailsButtonText: {
//         color: COLORS.primary,
//         fontSize: 12,
//         fontWeight: '600',
//         marginLeft: 5,
//     },
//     centerContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     loadingText: {
//         marginTop: 10,
//         color: '#666',
//         fontSize: 14,
//     },
//     emptyContainer: {
//         alignItems: 'center',
//         justifyContent: 'center',
//         padding: 50,
//     },
//     emptyText: {
//         fontSize: 16,
//         color: '#999',
//         textAlign: 'center',
//         marginTop: 10,
//     },
//     authMessage: {
//         fontSize: 14,
//         color: '#dc3545',
//         textAlign: 'center',
//         marginTop: 10,
//         fontWeight: '500',
//     },
//     modalContainer: {
//         flex: 1,
//         backgroundColor: 'rgba(0,0,0,0.5)',
//         justifyContent: 'flex-end',
//     },
//     modalContent: {
//         backgroundColor: 'white',
//         borderTopLeftRadius: 20,
//         borderTopRightRadius: 20,
//         maxHeight: '80%',
//     },
//     modalHeader: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         padding: 20,
//         borderBottomWidth: 1,
//         borderBottomColor: '#eee',
//     },
//     modalTitle: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         color: '#333',
//     },
//     modalBody: {
//         padding: 20,
//     },
//     detailTitle: {
//         fontSize: 22,
//         fontWeight: 'bold',
//         color: '#333',
//         marginBottom: 15,
//     },
//     detailImage: {
//         width: '100%',
//         height: 200,
//         borderRadius: 10,
//         marginBottom: 15,
//     },
//     detailContent: {
//         fontSize: 16,
//         color: '#555',
//         lineHeight: 26,
//         marginBottom: 20,
//     },
//     detailMeta: {
//         backgroundColor: '#f8f9fa',
//         borderRadius: 10,
//         padding: 15,
//     },
//     detailRow: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginBottom: 10,
//     },
//     detailLabel: {
//         fontSize: 14,
//         color: '#666',
//         fontWeight: '500',
//     },
//     detailValue: {
//         fontSize: 14,
//         color: '#333',
//         fontWeight: '600',
//     },
//     approvedText: {
//         color: '#28a745',
//     },
//     pendingText: {
//         color: '#ffc107',
//     },
//     modalFooter: {
//         padding: 20,
//         borderTopWidth: 1,
//         borderTopColor: '#eee',
//     },
//     closeButton: {
//         backgroundColor: COLORS.primary,
//         padding: 15,
//         borderRadius: 10,
//         alignItems: 'center',
//     },
//     closeButtonText: {
//         color: 'white',
//         fontSize: 16,
//         fontWeight: 'bold',
//     },
// });

// export default PostsScreen;
import React, { useState, useEffect, JSX } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    Alert,
    Image,
    Modal,
    TextInput,
    ScrollView,
    Dimensions
} from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/stores/authstore';
import { BASE_URL } from '@/constants/Api';
import { COLORS } from '@/constants/theme';

// Type Definitions
interface User {
    _id: string;
    name: string;
    avatar?: string;
    email?: string;
}

interface Company {
    _id: string;
    name: string;
    logo?: string;
}

interface Post {
    _id: string;
    title: string;
    content: string;
    image?: string;
    images?: string[];
    company?: Company;
    user?: User;
    isApproved: boolean;
    likes: string[];
    createdAt: string;
    updatedAt: string;
    imageUrl?: string;
    imagesUrls?: string[];
}

type TabType = 'all' | 'approved' | 'pending';

const { width } = Dimensions.get('window');

const PostsScreen: React.FC = () => {
    const { user, token } = useAuthStore();
    const [posts, setPosts] = useState<Post[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<TabType>('all');
    const [stats, setStats] = useState({
        approved: 0,
        pending: 0,
        total: 0
    });
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [showSearch, setShowSearch] = useState<boolean>(false);

    // Fetch statistics - corrected
    const fetchStats = async (): Promise<void> => {
        try {
            console.log('Fetching stats with token:', token ? 'Token exists' : 'No token');

            const [allResponse, approvedResponse, pendingResponse] = await Promise.all([
                axios.get(`${BASE_URL}/api/posts/allPost`),
                axios.get(`${BASE_URL}/api/posts/`),
                axios.get(`${BASE_URL}/api/posts/getAllNotApprovedPosts`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                })
            ]);

            console.log('Stats Responses:', {
                all: allResponse.data,
                approved: approvedResponse.data,
                pending: pendingResponse.data
            });

            setStats({
                total: Array.isArray(allResponse.data) ? allResponse.data.length : 0,
                approved: Array.isArray(approvedResponse.data) ? approvedResponse.data.length : 0,
                pending: Array.isArray(pendingResponse.data) ? pendingResponse.data.length : 0
            });
        } catch (error: any) {
            console.error('Error fetching stats:', {
                message: error.message,
                response: error.response?.data,
                url: error.config?.url
            });
        }
    };

    // Fetch posts based on active tab - corrected
    const fetchPosts = async (): Promise<void> => {
        try {
            setLoading(true);
            let url = '';

            // Determine URL based on tab - corrected
            switch (activeTab) {
                case 'approved':
                    url = `${BASE_URL}/api/posts/`; // Fetch approved posts
                    break;
                case 'pending':
                    url = `${BASE_URL}/api/posts/getAllNotApprovedPosts`; // Corrected here
                    break;
                case 'all':
                default:
                    url = `${BASE_URL}/api/posts/allPost`; // Fetch all posts
                    break;
            }

            console.log('Fetching posts from:', url);
            console.log('Active tab:', activeTab);

            // Add token only for pending posts
            const config = activeTab === 'pending' && token
                ? { headers: { Authorization: `Bearer ${token}` } }
                : {};

            console.log('Request config:', config);

            const response = await axios.get(url, config);
            console.log('Response data:', response.data);

            // Handle response in different ways
            if (response.data && Array.isArray(response.data)) {
                // If response is directly an array
                setPosts(response.data);
                setFilteredPosts(response.data);
                console.log(`Loaded ${response.data.length} posts`);
            } else if (response.data?.data && Array.isArray(response.data.data)) {
                // If data is inside data property
                setPosts(response.data.data);
                setFilteredPosts(response.data.data);
                console.log(`Loaded ${response.data.data.length} posts from data property`);
            } else if (response.data?.success && Array.isArray(response.data.data)) {
                // If there's success/data structure
                setPosts(response.data.data);
                setFilteredPosts(response.data.data);
                console.log(`Loaded ${response.data.data.length} posts from success/data structure`);
            } else {
                console.log('Unexpected response structure:', response.data);
                setPosts([]);
                setFilteredPosts([]);
            }

        } catch (error: any) {
            console.error('Error fetching posts:', {
                message: error.message,
                response: error.response?.data,
                url: error.config?.url,
                status: error.response?.status
            });

            let errorMessage = 'Error fetching data';

            if (error.response?.status === 404) {
                errorMessage = 'Invalid URL. Check API address';
            } else if (error.response?.status === 401) {
                errorMessage = 'Unauthorized. Please log in';
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            Alert.alert('Error', errorMessage);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchPosts();
        fetchStats();
    }, [activeTab, token]); // Added token as dependency

    // Search in posts
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredPosts(posts);
        } else {
            const filtered = posts.filter(post =>
                post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.company?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredPosts(filtered);
        }
    }, [searchQuery, posts]);

    const onRefresh = (): void => {
        setRefreshing(true);
        fetchPosts();
        fetchStats();
    };

    // Approve post - corrected
    const handleApprovePost = async (postId: string): Promise<void> => {
        try {
            Alert.alert(
                'Approve Post',
                'Do you want to approve this post?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Approve',
                        onPress: async () => {
                            const response = 
                            await axios.patch(
                                `${BASE_URL}/api/posts/${postId}/approve`, // Corrected here
                                {},
                                { headers: { Authorization: `Bearer ${token}` } }
                            );

                            if (response.data) {
                                Alert.alert('Success', 'Post approved successfully');
                                fetchPosts();
                                fetchStats();
                            }
                        }
                    }
                ]
            );
        } catch (error: any) {
            console.error('Error approving post:', error);
            Alert.alert('Error', error.response?.data?.message || 'Failed to approve post');
        }
    };

    // Reject post - corrected
    const handleRejectPost = async (postId: string): Promise<void> => {
        try {
            Alert.alert(
                'Reject Post',
                'Do you want to reject this post?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Reject',
                        style: 'destructive',
                        onPress: async () => {
                            const response = await axios.delete(
                                `${BASE_URL}/api/posts/${postId}/reject`, // Corrected here
                                { headers: { Authorization: `Bearer ${token}` } }
                            );

                            if (response.data) {
                                Alert.alert('Success', 'Post rejected');
                                fetchPosts();
                                fetchStats();
                            }
                        }
                    }
                ]
            );
        } catch (error: any) {
            console.error('Error rejecting post:', error);
            Alert.alert('Error', error.response?.data?.message || 'Failed to reject post');
        }
    };

    // Delete post - corrected
    const handleDeletePost = async (postId: string): Promise<void> => {
        try {
            Alert.alert(
                'Delete Post',
                'Are you sure you want to delete this post?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Delete',
                        style: 'destructive',
                        onPress: async () => {
                            const response = await axios.delete(
                                `${BASE_URL}/api/posts/${postId}`, // Corrected here
                                { headers: { Authorization: `Bearer ${token}` } }
                            );

                            if (response.data) {
                                Alert.alert('Success', 'Post deleted');
                                fetchPosts();
                                fetchStats();
                            }
                        }
                    }
                ]
            );
        } catch (error: any) {
            console.error('Error deleting post:', error);
            Alert.alert('Error', error.response?.data?.message || 'Failed to delete post');
        }
    };

    // Show post details
    const showPostDetails = (post: Post): void => {
        setSelectedPost(post);
        setModalVisible(true);
    };

    // Helper function to safely display images
    const getImageUrl = (post: Post): string | undefined => {
        if (post.imageUrl) return post.imageUrl;
        if (post.image) {
            // Convert path if necessary
            const imagePath = post.image.replace(/\\/g, '/');
            return `${BASE_URL}${imagePath}`;
        }
        return undefined;
    };

    // Render post item
    const renderPostItem = ({ item }: { item: Post }): JSX.Element => {
        const imageUrl = getImageUrl(item);

        return (
            <TouchableOpacity
                style={styles.postCard}
                activeOpacity={0.8}
                onPress={() => showPostDetails(item)}
            >
                {/* Post Image */}
                {imageUrl ? (
                    <Image
                        source={{ uri: imageUrl }}
                        style={styles.postImage}
                        resizeMode="cover"
                        onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
                    />
                ) : (
                    <View style={styles.noImageContainer}>
                        <Ionicons name="image-outline" size={40} color="#ccc" />
                        <Text style={styles.noImageText}>No Image</Text>
                    </View>
                )}

                <View style={styles.postContent}>
                    {/* Title and Status */}
                    <View style={styles.titleRow}>
                        <Text style={styles.postTitle} numberOfLines={1}>
                            {item.title || 'No Title'}
                        </Text>
                        <View style={[
                            styles.statusBadge,
                            item.isApproved ? styles.approvedBadge : styles.pendingBadge
                        ]}>
                            <Text style={styles.statusText}>
                                {item.isApproved ? '✓' : '⌛'}
                            </Text>
                        </View>
                    </View>

                    {/* Content */}
                    <Text style={styles.postContentText} numberOfLines={2}>
                        {item.content || 'No Content'}
                    </Text>

                    {/* Additional Info */}
                    <View style={styles.metaInfo}>
                        {item.company && (
                            <View style={styles.metaItem}>
                                <Ionicons name="business-outline" size={14} color="#666" />
                                <Text style={styles.metaText}>{item.company.name}</Text>
                            </View>
                        )}

                        {item.user && (
                            <View style={styles.metaItem}>
                                <Ionicons name="person-outline" size={14} color="#666" />
                                <Text style={styles.metaText}>{item.user.name}</Text>
                            </View>
                        )}

                        <View style={styles.metaItem}>
                            <Ionicons name="calendar-outline" size={14} color="#666" />
                            <Text style={styles.metaText}>
                                {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US') : 'Unknown'}
                            </Text>
                        </View>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.actionsContainer}>
                        {!item.isApproved && (
                            <>
                                <TouchableOpacity
                                    style={styles.approveButton}
                                    onPress={() => handleApprovePost(item._id)}
                                >
                                    <Ionicons name="checkmark-circle" size={18} color="white" />
                                    <Text style={styles.buttonText}>Approve</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.rejectButton}
                                    onPress={() => handleRejectPost(item._id)}
                                >
                                    <Ionicons name="close-circle" size={18} color="white" />
                                    <Text style={styles.buttonText}>Reject</Text>
                                </TouchableOpacity>
                            </>
                        )}

                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => handleDeletePost(item._id)}
                        >
                            <Ionicons name="trash-outline" size={18} color="white" />
                            <Text style={styles.buttonText}>Delete</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.detailsButton}
                            onPress={() => showPostDetails(item)}
                        >
                            <Ionicons name="information-circle-outline" size={18} color={COLORS.primary} />
                            <Text style={styles.detailsButtonText}>Details</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <Text style={styles.headerTitle}>Posts Management</Text>
                    <TouchableOpacity
                        style={styles.searchButton}
                        onPress={() => setShowSearch(!showSearch)}
                    >
                        <Ionicons name="search-outline" size={24} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                {showSearch && (
                    <View style={styles.searchContainer}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search posts..."
                            placeholderTextColor="#999"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchQuery('')}>
                                <Ionicons name="close-outline" size={20} color="#999" />
                            </TouchableOpacity>
                        )}
                    </View>
                )}

                {/* Statistics */}
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{stats.total}</Text>
                        <Text style={styles.statLabel}>All</Text>
                    </View>
                    <View style={[styles.statItem, styles.approvedStat]}>
                        <Text style={styles.statNumber}>{stats.approved}</Text>
                        <Text style={styles.statLabel}>Approved</Text>
                    </View>
                    <View style={[styles.statItem, styles.pendingStat]}>
                        <Text style={styles.statNumber}>{stats.pending}</Text>
                        <Text style={styles.statLabel}>Pending</Text>
                    </View>
                </View>
            </View>

            {/* Tab Buttons */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'all' && styles.activeTabButton]}
                    onPress={() => setActiveTab('all')}
                >
                    <Ionicons
                        name="list-outline"
                        size={20}
                        color={activeTab === 'all' ? COLORS.primary : '#666'}
                    />
                    <Text style={[
                        styles.tabText,
                        activeTab === 'all' && styles.activeTabText
                    ]}>
                        All
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'approved' && styles.activeTabButton]}
                    onPress={() => setActiveTab('approved')}
                >
                    <Ionicons
                        name="checkmark-done-outline"
                        size={20}
                        color={activeTab === 'approved' ? COLORS.primary : '#666'}
                    />
                    <Text style={[
                        styles.tabText,
                        activeTab === 'approved' && styles.activeTabText
                    ]}>
                        Approved
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'pending' && styles.activeTabButton]}
                    onPress={() => setActiveTab('pending')}
                >
                    <Ionicons
                        name="time-outline"
                        size={20}
                        color={activeTab === 'pending' ? COLORS.primary : '#666'}
                    />
                    <Text style={[
                        styles.tabText,
                        activeTab === 'pending' && styles.activeTabText
                    ]}>
                        Pending
                    </Text>
                </TouchableOpacity>
            </View>

            {/* List */}
            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={styles.loadingText}>Loading data...</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredPosts}
                    renderItem={renderPostItem}
                    keyExtractor={(item) => item._id || Math.random().toString()}
                    contentContainerStyle={styles.listContainer}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[COLORS.primary]}
                            tintColor={COLORS.primary}
                        />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="document-text-outline" size={60} color="#ccc" />
                            <Text style={styles.emptyText}>
                                {searchQuery
                                    ? 'No search results'
                                    : activeTab === 'all'
                                        ? 'No posts'
                                        : activeTab === 'approved'
                                            ? 'No approved posts'
                                            : 'No pending posts'
                                }
                            </Text>
                            {!token && activeTab === 'pending' && (
                                <Text style={styles.authMessage}>
                                    You need to log in to view pending posts
                                </Text>
                            )}
                        </View>
                    }
                    ListFooterComponent={<View style={{ margin: 30 }}></View>}
                />
            )}

            {/* Post Details Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Post Details</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Ionicons name="close-outline" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalBody}>
                            {selectedPost && (
                                <>
                                    <Text style={styles.detailTitle}>
                                        {selectedPost.title || 'No Title'}
                                    </Text>

                                    {getImageUrl(selectedPost) && (
                                        <Image
                                            source={{ uri: getImageUrl(selectedPost) }}
                                            style={styles.detailImage}
                                            resizeMode="cover"
                                        />
                                    )}

                                    <Text style={styles.detailContent}>
                                        {selectedPost.content || 'No Content'}
                                    </Text>

                                    <View style={styles.detailMeta}>
                                        <View style={styles.detailRow}>
                                            <Text style={styles.detailLabel}>Status:</Text>
                                            <Text style={[
                                                styles.detailValue,
                                                selectedPost.isApproved ? styles.approvedText : styles.pendingText
                                            ]}>
                                                {selectedPost.isApproved ? 'Approved' : 'Pending'}
                                            </Text>
                                        </View>

                                        {selectedPost.company && (
                                            <View style={styles.detailRow}>
                                                <Text style={styles.detailLabel}>Company:</Text>
                                                <Text style={styles.detailValue}>
                                                    {selectedPost.company.name}
                                                </Text>
                                            </View>
                                        )}

                                        {selectedPost.user && (
                                            <View style={styles.detailRow}>
                                                <Text style={styles.detailLabel}>User:</Text>
                                                <Text style={styles.detailValue}>
                                                    {selectedPost.user.name}
                                                </Text>
                                            </View>
                                        )}

                                        <View style={styles.detailRow}>
                                            <Text style={styles.detailLabel}>Created At:</Text>
                                            <Text style={styles.detailValue}>
                                                {selectedPost.createdAt
                                                    ? new Date(selectedPost.createdAt).toLocaleString('en-US')
                                                    : 'Unknown'}
                                            </Text>
                                        </View>

                                        <View style={styles.detailRow}>
                                            <Text style={styles.detailLabel}>Likes Count:</Text>
                                            <Text style={styles.detailValue}>
                                                {selectedPost.likes?.length || 0}
                                            </Text>
                                        </View>

                                        {selectedPost.imagesUrls && selectedPost.imagesUrls.length > 0 && (
                                            <View style={styles.detailRow}>
                                                <Text style={styles.detailLabel}>Images Count:</Text>
                                                <Text style={styles.detailValue}>
                                                    {selectedPost.imagesUrls.length}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                </>
                            )}
                        </ScrollView>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default PostsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        backgroundColor: COLORS.primary,
        padding: 15,
        paddingTop: 50,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    headerTitle: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
    },
    searchButton: {
        padding: 5,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 15,
    },
    searchInput: {
        flex: 1,
        padding: 10,
        color: '#333',
        fontSize: 14,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: 10,
        borderRadius: 8,
        minWidth: 80,
    },
    approvedStat: {
        backgroundColor: 'rgba(40,167,69,0.3)',
    },
    pendingStat: {
        backgroundColor: 'rgba(255,193,7,0.3)',
    },
    statNumber: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    statLabel: {
        color: 'white',
        fontSize: 12,
        marginTop: 5,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    tabButton: {
        flex: 1,
        padding: 15,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    activeTabButton: {
        borderBottomWidth: 3,
        borderBottomColor: COLORS.primary,
        backgroundColor: '#f0f8ff',
    },
    tabText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
        marginLeft: 5,
    },
    activeTabText: {
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    listContainer: {
        padding: 15,
    },
    postCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
        overflow: 'hidden',
    },
    postImage: {
        width: '100%',
        height: 180,
    },
    noImageContainer: {
        width: '100%',
        height: 180,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    noImageText: {
        color: '#999',
        marginTop: 5,
        fontSize: 12,
    },
    postContent: {
        padding: 15,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    postTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
        marginRight: 10,
    },
    statusBadge: {
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    approvedBadge: {
        backgroundColor: '#d4edda',
    },
    pendingBadge: {
        backgroundColor: '#fff3cd',
    },
    statusText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    postContentText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 22,
        marginBottom: 15,
    },
    metaInfo: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 15,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
        marginBottom: 5,
    },
    metaText: {
        fontSize: 12,
        color: '#666',
        marginLeft: 5,
    },
    actionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    approveButton: {
        backgroundColor: '#28a745',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        flex: 1,
        minWidth: 80,
        justifyContent: 'center',
    },
    rejectButton: {
        backgroundColor: '#dc3545',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        flex: 1,
        minWidth: 80,
        justifyContent: 'center',
    },
    deleteButton: {
        backgroundColor: '#6c757d',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        flex: 1,
        minWidth: 80,
        justifyContent: 'center',
    },
    detailsButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: COLORS.primary,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        flex: 1,
        minWidth: 80,
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 5,
    },
    detailsButtonText: {
        color: COLORS.primary,
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 5,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        color: '#666',
        fontSize: 14,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 50,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
        marginTop: 10,
    },
    authMessage: {
        fontSize: 14,
        color: '#dc3545',
        textAlign: 'center',
        marginTop: 10,
        fontWeight: '500',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    modalBody: {
        padding: 20,
    },
    detailTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    detailImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 15,
    },
    detailContent: {
        fontSize: 16,
        color: '#555',
        lineHeight: 26,
        marginBottom: 20,
    },
    detailMeta: {
        backgroundColor: '#f8f9fa',
        borderRadius: 10,
        padding: 15,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    detailLabel: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    detailValue: {
        fontSize: 14,
        color: '#333',
        fontWeight: '600',
    },
    approvedText: {
        color: '#28a745',
    },
    pendingText: {
        color: '#ffc107',
    },
    modalFooter: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    closeButton: {
        backgroundColor: COLORS.primary,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});