
// (adminandStaff)/companies/index.tsx
// import React, { useEffect, useState } from 'react';
// import {
//     View,
//     Text,
//     FlatList,
//     TouchableOpacity,
//     ActivityIndicator,
//     StyleSheet,
//     RefreshControl,
//     Alert,
//     Modal,
//     TextInput,
//     ScrollView,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useAuthStore } from '@/stores/authstore';
// import axios from 'axios';
// import { BASE_URL } from '@/constants/Api';
// import { Ionicons } from '@expo/vector-icons';

// // الألوان المحددة
// export const COLORS = {
//   primary: "#4ADE80",
//   secondary: "#2DD4BF",
//   background: '#FFFFFF',
//   surface: '#F2F2F7',
//   text: '#000000',
//   textLight: '#8E8E93',
//   border: '#C6C6C8',
//   error: '#FF3B30',
//   success: '#34C759',
//   warning: '#FF9500',
//   grey: "#9CA3AF",
//   white: '#FFFFFF'
// };

// const CompaniesScreen = () => {
//     const { user, token } = useAuthStore();
//     const [companies, setCompanies] = useState([]);
//     const [eligibleUsers, setEligibleUsers] = useState([]); // قائمة المستخدمين المؤهلين
//     const [loading, setLoading] = useState(true);
//     const [loadingUsers, setLoadingUsers] = useState(false);
//     const [refreshing, setRefreshing] = useState(false);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [addModalVisible, setAddModalVisible] = useState(false);
//     const [adding, setAdding] = useState(false);
//     const [userSearchQuery, setUserSearchQuery] = useState('');
//     const [selectedUser, setSelectedUser] = useState<any>(null);

//     const [formData, setFormData] = useState({
//         name: '',
//         description: '',
//     });

//     const fetchCompanies = async () => {
//         try {
//             setLoading(true);
//             const res = await axios.get(`${BASE_URL}/api/company`, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });
//             setCompanies(res.data || []);
//         } catch (err: any) {
//             console.error(err);
//             Alert.alert('Error', err.response?.data?.message || 'Failed to load companies');
//         } finally {
//             setLoading(false);
//             setRefreshing(false);
//         }
//     };

//     const fetchEligibleUsers = async () => {
//         try {
//             setLoadingUsers(true);
//             const res = await axios.get(`${BASE_URL}/api/company/eligible-users`, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });
//             setEligibleUsers(res.data || []);
//         } catch (err: any) {
//             console.error(err);
//             Alert.alert('Error', err.response?.data?.message || 'Failed to load eligible users');
//         } finally {
//             setLoadingUsers(false);
//         }
//     };

//     const approveCompany = async (companyId: string) => {
//         try {
//             const response = await axios.patch(
//                 `${BASE_URL}/api/company/${companyId}/approve`, 
//                 {},
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 }
//             );

//             // تحديث القائمة بعد الموافقة
//             setCompanies((prev: any) =>
//                 prev.map((comp: any) =>
//                     comp._id === companyId ? { ...comp, isApproved: true } : comp
//                 )
//             );

//             Alert.alert('Success', response.data.message || 'Company approved successfully');
//         } catch (err: any) {
//             console.error(err);
//             Alert.alert('Error', err.response?.data?.message || 'Failed to approve company');
//         }
//     };

//     const deleteCompany = async (companyId: string) => {
//         Alert.alert(
//             'Delete Company',
//             'Are you sure you want to delete this company? This action cannot be undone.',
//             [
//                 { text: 'Cancel', style: 'cancel' },
//                 {
//                     text: 'Delete',
//                     style: 'destructive',
//                     onPress: async () => {
//                         try {
//                             const response = await axios.delete(`${BASE_URL}/api/company/${companyId}`, {
//                                 headers: {
//                                     Authorization: `Bearer ${token}`,
//                                 },
//                             });

//                             // تحديث القائمة بعد الحذف
//                             setCompanies((prev: any) =>
//                                 prev.filter((comp: any) => comp._id !== companyId)
//                             );

//                             Alert.alert('Success', response.data.message || 'Company deleted successfully');
//                         } catch (err: any) {
//                             console.error(err);
//                             Alert.alert('Error', err.response?.data?.message || 'Failed to delete company');
//                         }
//                     }
//                 }
//             ]
//         );
//     };

//     const handleCreateCompanyForUser = async () => {
//         // التحقق من الحقول المطلوبة
//         if (!formData.name.trim()) {
//             Alert.alert('Error', 'Company name is required');
//             return;
//         }

//         if (!selectedUser) {
//             Alert.alert('Error', 'Please select a user to be the owner');
//             return;
//         }

//         try {
//             setAdding(true);

//             const requestData = {
//                 userId: selectedUser._id,
//                 name: formData.name,
//                 description: formData.description
//             };

//             const response = await axios.post(
//                 `${BASE_URL}/api/company/for-user`, 
//                 requestData,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         'Content-Type': 'application/json',
//                     },
//                 }
//             );

//             // إضافة الشركة الجديدة إلى القائمة
//             // setCompanies((prev:any) => [response.data.company, ...prev]);

//             // تحديث قائمة المستخدمين المؤهلين
//             setEligibleUsers(prev => prev.filter((u: any) => u._id !== selectedUser._id));

//             // إغلاق المودال وإعادة تعيين النموذج
//             setAddModalVisible(false);
//             resetForm();

//             Alert.alert('Success', response.data.message || 'Company created successfully!');
//         } catch (error: any) {
//             console.error('Create company error:', error);
//             Alert.alert(
//                 'Error',
//                 error.response?.data?.message || 'Failed to create company. Please try again.'
//             );
//         } finally {
//             setAdding(false);
//         }
//     };

//     const resetForm = () => {
//         setFormData({
//             name: '',
//             description: '',
//         });
//         setSelectedUser(null);
//         setUserSearchQuery('');
//     };

//     const handleInputChange = (field: string, value: string) => {
//         setFormData(prev => ({
//             ...prev,
//             [field]: value
//         }));
//     };

//     const handleUserSelect = (user: any) => {
//         setSelectedUser(user);
//     };

//     useEffect(() => {
//         if (token) {
//             fetchCompanies();
//         }
//     }, [token]);

//     const onRefresh = () => {
//         setRefreshing(true);
//         fetchCompanies();
//     };

//     // فتح المودال وجلب المستخدمين المؤهلين
//     const openAddModal = () => {
//         fetchEligibleUsers();
//         setAddModalVisible(true);
//     };

//     const filteredCompanies = companies.filter((company:any) =>
//         company.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         company.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         company.owner?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         company.owner?.email?.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//     const filteredUsers = eligibleUsers.filter((user:any) =>
//         user.name?.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
//         user.email?.toLowerCase().includes(userSearchQuery.toLowerCase())
//     );

//     const renderCompany = ({ item }: { item: any }) => (
//         <View style={styles.companyCard}>
//             <View style={styles.companyHeader}>
//                 <View style={styles.companyLogo}>
//                     <Ionicons name="business-outline" size={24} color={COLORS.primary} />
//                 </View>
//                 <View style={styles.companyTitleContainer}>
//                     <Text style={styles.companyName} numberOfLines={1}>{item.name}</Text>
//                     <View style={[
//                         styles.statusBadge,
//                         { 
//                             backgroundColor: item.isApproved ? `${COLORS.success}20` : `${COLORS.warning}20`,
//                             borderColor: item.isApproved ? COLORS.success : COLORS.warning
//                         }
//                     ]}>
//                         <Ionicons 
//                             name={item.isApproved ? "checkmark-circle" : "time-outline"} 
//                             size={14} 
//                             color={item.isApproved ? COLORS.success : COLORS.warning} 
//                         />
//                         <Text style={[
//                             styles.statusText,
//                             { color: item.isApproved ? COLORS.success : COLORS.warning }
//                         ]}>
//                             {item.isApproved ? 'Approved' : 'Pending'}
//                         </Text>
//                     </View>
//                 </View>

//                 <View style={styles.companyActions}>
//                     <TouchableOpacity
//                         style={styles.actionButton}
//                         onPress={() => deleteCompany(item._id)}
//                     >
//                         <Ionicons name="trash-outline" size={20} color={COLORS.error} />
//                     </TouchableOpacity>
//                 </View>
//             </View>

//             <Text style={styles.companyDescription} numberOfLines={2}>
//                 {item.description || 'No description available'}
//             </Text>

//             {item.owner && (
//                 <View style={styles.ownerContainer}>
//                     <Ionicons name="person-outline" size={14} color={COLORS.textLight} />
//                     <View style={styles.ownerInfo}>
//                         <Text style={styles.ownerText}>
//                             Owner: {item.owner.name} • {item.owner.email}
//                         </Text>
//                         {item.owner.role === 'company' && (
//                             <View style={styles.companyRoleBadge}>
//                                 <Ionicons name="business" size={10} color={COLORS.white} />
//                                 <Text style={styles.companyRoleText}>COMPANY</Text>
//                             </View>
//                         )}
//                     </View>
//                 </View>
//             )}

//             <View style={styles.companyFooter}>
//                 <Text style={styles.companyId}>
//                     <Ionicons name="key-outline" size={12} color={COLORS.grey} /> 
//                     ID: {item._id?.substring(0, 8)}...
//                 </Text>

//                 {!item.isApproved && user?.role === 'admin' && (
//                     <TouchableOpacity
//                         style={styles.approveButton}
//                         onPress={() => approveCompany(item._id)}
//                     >
//                         <Ionicons name="checkmark-outline" size={16} color={COLORS.white} />
//                         <Text style={styles.approveText}>Approve</Text>
//                     </TouchableOpacity>
//                 )}
//             </View>
//         </View>
//     );

//     const renderUserItem = ({ item }: { item: any }) => (
//         <TouchableOpacity
//             style={[
//                 styles.userItem,
//                 selectedUser?._id === item._id && styles.selectedUserItem
//             ]}
//             onPress={() => handleUserSelect(item)}
//         >
//             <View style={styles.userAvatar}>
//                 <Ionicons name="person" size={24} color={COLORS.primary} />
//             </View>
//             <View style={styles.userInfo}>
//                 <Text style={styles.userName}>{item.name || 'No Name'}</Text>
//                 <Text style={styles.userEmail}>{item.email}</Text>
//                 <Text style={styles.userRole}>Role: {item.role}</Text>
//             </View>
//             {selectedUser?._id === item._id && (
//                 <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
//             )}
//         </TouchableOpacity>
//     );

//     return (
//         <SafeAreaView style={styles.container}>
//             {/* Header */}
//             <View style={styles.header}>
//                 <View style={styles.headerLeft}>
//                     <Ionicons name="business" size={28} color={COLORS.primary} />
//                     <Text style={styles.headerTitle}>Companies</Text>
//                 </View>

//                 {user?.role === 'admin' && (
//                     <View style={styles.headerRight}>
//                         <TouchableOpacity
//                             style={styles.addButton}
//                             onPress={openAddModal}
//                         >
//                             <Ionicons name="add" size={24} color={COLORS.white} />
//                         </TouchableOpacity>
//                     </View>
//                 )}
//             </View>

//             {/* Search Bar */}
//             <View style={styles.searchContainer}>
//                 <Ionicons name="search" size={20} color={COLORS.textLight} style={styles.searchIcon} />
//                 <TextInput
//                     style={styles.searchInput}
//                     placeholder="Search companies..."
//                     placeholderTextColor={COLORS.textLight}
//                     value={searchQuery}
//                     onChangeText={setSearchQuery}
//                 />
//                 {searchQuery.length > 0 && (
//                     <TouchableOpacity onPress={() => setSearchQuery('')}>
//                         <Ionicons name="close-circle" size={20} color={COLORS.textLight} />
//                     </TouchableOpacity>
//                 )}
//             </View>

//             {/* Stats */}
//             <View style={styles.statsContainer}>
//                 <View style={styles.statCard}>
//                     <Text style={styles.statNumber}>{companies.length}</Text>
//                     <Text style={styles.statLabel}>Total</Text>
//                 </View>
//                 <View style={styles.statCard}>
//                     <Text style={[styles.statNumber, { color: COLORS.success }]}>
//                         {companies.filter((c:any)=> c.isApproved).length}
//                     </Text>
//                     <Text style={styles.statLabel}>Approved</Text>
//                 </View>
//                 <View style={styles.statCard}>
//                     <Text style={[styles.statNumber, { color: COLORS.warning }]}>
//                         {companies.filter((c:any)=> !c.isApproved).length}
//                     </Text>
//                     <Text style={styles.statLabel}>Pending</Text>
//                 </View>
//             </View>

//             {/* Loading State */}
//             {loading ? (
//                 <View style={styles.loadingContainer}>
//                     <ActivityIndicator size="large" color={COLORS.primary} />
//                     <Text style={styles.loadingText}>Loading companies...</Text>
//                 </View>
//             ) : (
//                 <FlatList
//                     data={filteredCompanies}
//                     keyExtractor={(item) => item._id}
//                     renderItem={renderCompany}
//                     refreshControl={
//                         <RefreshControl 
//                             refreshing={refreshing} 
//                             onRefresh={onRefresh}
//                             colors={[COLORS.primary]}
//                         />
//                     }
//                     ListEmptyComponent={
//                         <View style={styles.emptyContainer}>
//                             <Ionicons name="business-outline" size={80} color={COLORS.border} />
//                             <Text style={styles.emptyText}>No companies found</Text>
//                             <Text style={styles.emptySubText}>
//                                 {searchQuery ? 'Try a different search' : 'No companies yet'}
//                             </Text>
//                             {!searchQuery && user?.role === 'admin' && (
//                                 <TouchableOpacity
//                                     style={styles.addFirstButton}
//                                     onPress={openAddModal}
//                                 >
//                                     <Ionicons name="add" size={20} color={COLORS.white} />
//                                     <Text style={styles.addFirstText}>Create First Company</Text>
//                                 </TouchableOpacity>
//                             )}
//                         </View>
//                     }
//                     contentContainerStyle={styles.listContent}
//                     showsVerticalScrollIndicator={false}
//                 />
//             )}

//             {/* Create Company Modal */}
//             <Modal
//                 animationType="slide"
//                 transparent={true}
//                 visible={addModalVisible}
//                 onRequestClose={() => {
//                     setAddModalVisible(false);
//                     resetForm();
//                 }}
//             >
//                 <View style={styles.modalOverlay}>
//                     <View style={styles.modalContainer}>
//                         {/* Modal Header */}
//                         <View style={styles.modalHeader}>
//                             <View style={styles.modalHeaderLeft}>
//                                 <Ionicons name="business-outline" size={24} color={COLORS.primary} />
//                                 <Text style={styles.modalTitle}>Create Company for User</Text>
//                             </View>
//                             <TouchableOpacity
//                                 style={styles.closeButton}
//                                 onPress={() => {
//                                     setAddModalVisible(false);
//                                     resetForm();
//                                 }}
//                                 disabled={adding}
//                             >
//                                 <Ionicons name="close" size={24} color={COLORS.textLight} />
//                             </TouchableOpacity>
//                         </View>

//                         {/* Modal Content */}
//                         <ScrollView 
//                             style={styles.modalScrollView}
//                             contentContainerStyle={styles.modalContent}
//                             showsVerticalScrollIndicator={false}
//                         >
//                             {/* Step 1: Select Owner */}
//                             <View style={styles.section}>
//                                 <Text style={styles.sectionTitle}>
//                                     <Ionicons name="person-outline" size={20} color={COLORS.primary} />
//                                     Step 1: Select User to Become Company Owner
//                                 </Text>

//                                 <Text style={styles.sectionDescription}>
//                                     Select a regular user (role: user) who doesn't own a company yet.
//                                 </Text>

//                                 {/* User Search */}
//                                 <View style={styles.userSearchContainer}>
//                                     <Ionicons name="search" size={20} color={COLORS.textLight} style={styles.searchIcon} />
//                                     <TextInput
//                                         style={styles.userSearchInput}
//                                         placeholder="Search eligible users by name or email..."
//                                         placeholderTextColor={COLORS.textLight}
//                                         value={userSearchQuery}
//                                         onChangeText={setUserSearchQuery}
//                                     />
//                                 </View>

//                                 {/* Selected User Preview */}
//                                 {selectedUser && (
//                                     <View style={styles.selectedUserContainer}>
//                                         <View style={styles.selectedUserHeader}>
//                                             <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
//                                             <Text style={styles.selectedUserTitle}>Selected User</Text>
//                                         </View>
//                                         <View style={styles.selectedUserInfo}>
//                                             <View style={styles.userAvatarSmall}>
//                                                 <Ionicons name="person" size={16} color={COLORS.primary} />
//                                             </View>
//                                             <View style={styles.selectedUserDetails}>
//                                                 <Text style={styles.selectedUserName}>{selectedUser.name}</Text>
//                                                 <Text style={styles.selectedUserEmail}>{selectedUser.email}</Text>
//                                             </View>
//                                             <TouchableOpacity
//                                                 style={styles.changeButton}
//                                                 onPress={() => setSelectedUser(null)}
//                                             >
//                                                 <Text style={styles.changeButtonText}>Change</Text>
//                                             </TouchableOpacity>
//                                         </View>
//                                         <Text style={styles.noteText}>
//                                             ⓘ User's role will be changed to "company"
//                                         </Text>
//                                     </View>
//                                 )}

//                                 {/* Users List */}
//                                 {loadingUsers ? (
//                                     <View style={styles.loadingUsersContainer}>
//                                         <ActivityIndicator size="small" color={COLORS.primary} />
//                                         <Text style={styles.loadingUsersText}>Loading eligible users...</Text>
//                                     </View>
//                                 ) : (
//                                     <View style={styles.usersListContainer}>
//                                         <View style={styles.usersListHeader}>
//                                             <Text style={styles.usersListTitle}>
//                                                 Eligible Users ({filteredUsers.length})
//                                             </Text>
//                                             <Text style={styles.usersListSubtitle}>
//                                                 Users without companies
//                                             </Text>
//                                         </View>
//                                         {filteredUsers.length === 0 ? (
//                                             <View style={styles.noUsersContainer}>
//                                                 <Ionicons name="people-outline" size={40} color={COLORS.border} />
//                                                 <Text style={styles.noUsersText}>No eligible users found</Text>
//                                                 <Text style={styles.noUsersSubtext}>
//                                                     All users already have companies
//                                                 </Text>
//                                             </View>
//                                         ) : (
//                                             <FlatList
//                                                 data={filteredUsers}
//                                                 keyExtractor={(item) => item._id}
//                                                 renderItem={renderUserItem}
//                                                 scrollEnabled={true}
//                                                 style={styles.usersList}
//                                                 contentContainerStyle={styles.usersListContent}
//                                             />
//                                         )}
//                                     </View>
//                                 )}
//                             </View>

//                             {/* Step 2: Company Details */}
//                             <View style={styles.section}>
//                                 <Text style={styles.sectionTitle}>
//                                     <Ionicons name="business-outline" size={20} color={COLORS.primary} />
//                                     Step 2: Company Details
//                                 </Text>

//                                 <View style={styles.formGroup}>
//                                     <Text style={styles.label}>
//                                         Company Name <Text style={styles.required}>*</Text>
//                                     </Text>
//                                     <View style={styles.inputContainer}>
//                                         <Ionicons name="business-outline" size={20} color={COLORS.textLight} style={styles.inputIcon} />
//                                         <TextInput
//                                             style={styles.input}
//                                             placeholder="Enter company name"
//                                             placeholderTextColor={COLORS.textLight}
//                                             value={formData.name}
//                                             onChangeText={(text) => handleInputChange('name', text)}
//                                         />
//                                     </View>
//                                 </View>

//                                 <View style={styles.formGroup}>
//                                     <Text style={styles.label}>Description</Text>
//                                     <View style={[styles.inputContainer, styles.textAreaContainer]}>
//                                         <Ionicons name="document-text-outline" size={20} color={COLORS.textLight} style={styles.inputIcon} />
//                                         <TextInput
//                                             style={[styles.input, styles.textArea]}
//                                             placeholder="Describe the company..."
//                                             placeholderTextColor={COLORS.textLight}
//                                             value={formData.description}
//                                             onChangeText={(text) => handleInputChange('description', text)}
//                                             multiline
//                                             numberOfLines={4}
//                                             textAlignVertical="top"
//                                         />
//                                     </View>
//                                     <Text style={styles.charCount}>
//                                         {formData.description.length}/500 characters
//                                     </Text>
//                                 </View>
//                             </View>
//                         </ScrollView>

//                         {/* Modal Actions */}
//                         <View style={styles.modalActions}>
//                             <TouchableOpacity
//                                 style={styles.cancelButton}
//                                 onPress={() => {
//                                     setAddModalVisible(false);
//                                     resetForm();
//                                 }}
//                                 disabled={adding}
//                             >
//                                 <Text style={styles.cancelButtonText}>Cancel</Text>
//                             </TouchableOpacity>

//                             <TouchableOpacity
//                                 style={[
//                                     styles.submitButton,
//                                     (!formData.name.trim() || !selectedUser) && styles.submitButtonDisabled
//                                 ]}
//                                 onPress={handleCreateCompanyForUser}
//                                 disabled={adding || !formData.name.trim() || !selectedUser}
//                             >
//                                 {adding ? (
//                                     <ActivityIndicator size="small" color={COLORS.white} />
//                                 ) : (
//                                     <>
//                                         <Ionicons name="business-outline" size={20} color={COLORS.white} />
//                                         <Text style={styles.submitButtonText}>Create Company</Text>
//                                     </>
//                                 )}
//                             </TouchableOpacity>
//                         </View>
//                     </View>
//                 </View>
//             </Modal>
//         </SafeAreaView>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: COLORS.surface,
//     },
//     header: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         paddingHorizontal: 20,
//         paddingVertical: 16,
//         backgroundColor: COLORS.background,
//         borderBottomWidth: 1,
//         borderBottomColor: COLORS.border,
//     },
//     headerLeft: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: 12,
//     },
//     headerRight: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: 12,
//     },
//     headerTitle: {
//         fontSize: 24,
//         fontWeight: '700',
//         color: COLORS.text,
//     },
//     addButton: {
//         width: 44,
//         height: 44,
//         borderRadius: 22,
//         backgroundColor: COLORS.primary,
//         alignItems: 'center',
//         justifyContent: 'center',
//         elevation: 2,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//     },
//     searchContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         backgroundColor: COLORS.background,
//         margin: 16,
//         paddingHorizontal: 16,
//         paddingVertical: 12,
//         borderRadius: 12,
//         borderWidth: 1,
//         borderColor: COLORS.border,
//     },
//     searchIcon: {
//         marginRight: 12,
//     },
//     searchInput: {
//         flex: 1,
//         fontSize: 16,
//         color: COLORS.text,
//     },
//     statsContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         paddingHorizontal: 16,
//         marginBottom: 16,
//     },
//     statCard: {
//         flex: 1,
//         backgroundColor: COLORS.background,
//         padding: 16,
//         borderRadius: 12,
//         alignItems: 'center',
//         marginHorizontal: 6,
//         borderWidth: 1,
//         borderColor: COLORS.border,
//     },
//     statNumber: {
//         fontSize: 24,
//         fontWeight: '700',
//         color: COLORS.primary,
//         marginBottom: 4,
//     },
//     statLabel: {
//         fontSize: 12,
//         color: COLORS.textLight,
//         fontWeight: '500',
//     },
//     loadingContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     loadingText: {
//         marginTop: 12,
//         color: COLORS.textLight,
//         fontSize: 16,
//     },
//     listContent: {
//         paddingHorizontal: 16,
//         paddingBottom: 20,
//     },
//     companyCard: {
//         backgroundColor: COLORS.background,
//         borderRadius: 16,
//         padding: 20,
//         marginBottom: 16,
//         borderWidth: 1,
//         borderColor: COLORS.border,
//         elevation: 1,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.05,
//         shadowRadius: 4,
//     },
//     companyHeader: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginBottom: 12,
//     },
//     companyLogo: {
//         width: 50,
//         height: 50,
//         borderRadius: 25,
//         backgroundColor: `${COLORS.primary}15`,
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginRight: 12,
//     },
//     companyTitleContainer: {
//         flex: 1,
//     },
//     companyName: {
//         fontSize: 18,
//         fontWeight: '700',
//         color: COLORS.text,
//         marginBottom: 6,
//     },
//     statusBadge: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         alignSelf: 'flex-start',
//         paddingHorizontal: 10,
//         paddingVertical: 4,
//         borderRadius: 12,
//         borderWidth: 1,
//         gap: 4,
//     },
//     statusText: {
//         fontSize: 12,
//         fontWeight: '600',
//     },
//     companyActions: {
//         flexDirection: 'row',
//         gap: 8,
//     },
//     actionButton: {
//         width: 36,
//         height: 36,
//         borderRadius: 18,
//         backgroundColor: COLORS.surface,
//         justifyContent: 'center',
//         alignItems: 'center',
//         borderWidth: 1,
//         borderColor: COLORS.border,
//     },
//     companyDescription: {
//         fontSize: 14,
//         color: COLORS.textLight,
//         lineHeight: 20,
//         marginBottom: 12,
//     },
//     ownerContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: 6,
//         marginBottom: 16,
//         paddingVertical: 8,
//         paddingHorizontal: 12,
//         backgroundColor: COLORS.surface,
//         borderRadius: 8,
//         borderWidth: 1,
//         borderColor: COLORS.border,
//     },
//     ownerInfo: {
//         flex: 1,
//     },
//     ownerText: {
//         fontSize: 13,
//         color: COLORS.text,
//         fontWeight: '500',
//     },
//     companyRoleBadge: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         backgroundColor: COLORS.primary,
//         paddingHorizontal: 8,
//         paddingVertical: 2,
//         borderRadius: 4,
//         marginTop: 4,
//         alignSelf: 'flex-start',
//         gap: 4,
//     },
//     companyRoleText: {
//         fontSize: 10,
//         color: COLORS.white,
//         fontWeight: '600',
//     },
//     companyFooter: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         paddingTop: 12,
//         borderTopWidth: 1,
//         borderTopColor: COLORS.border,
//     },
//     companyId: {
//         fontSize: 12,
//         color: COLORS.grey,
//         fontFamily: 'monospace',
//     },
//     approveButton: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         backgroundColor: COLORS.success,
//         paddingHorizontal: 16,
//         paddingVertical: 8,
//         borderRadius: 8,
//         gap: 6,
//     },
//     approveText: {
//         color: COLORS.white,
//         fontWeight: '600',
//         fontSize: 14,
//     },
//     emptyContainer: {
//         alignItems: 'center',
//         paddingVertical: 60,
//         paddingHorizontal: 40,
//     },
//     emptyText: {
//         fontSize: 18,
//         fontWeight: '600',
//         color: COLORS.textLight,
//         marginTop: 16,
//         marginBottom: 8,
//     },
//     emptySubText: {
//         fontSize: 14,
//         color: COLORS.grey,
//         textAlign: 'center',
//         marginBottom: 24,
//     },
//     addFirstButton: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         backgroundColor: COLORS.primary,
//         paddingHorizontal: 24,
//         paddingVertical: 12,
//         borderRadius: 10,
//         gap: 8,
//         elevation: 2,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//     },
//     addFirstText: {
//         color: COLORS.white,
//         fontWeight: '600',
//         fontSize: 16,
//     },
//     // Modal Styles
//     modalOverlay: {
//         flex: 1,
//         backgroundColor: 'rgba(0, 0, 0, 0.5)',
//         justifyContent: 'flex-end',
//     },
//     modalContainer: {
//         backgroundColor: COLORS.background,
//         borderTopLeftRadius: 24,
//         borderTopRightRadius: 24,
//         maxHeight: '90%',
//     },
//     modalHeader: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         paddingHorizontal: 20,
//         paddingVertical: 16,
//         borderBottomWidth: 1,
//         borderBottomColor: COLORS.border,
//     },
//     modalHeaderLeft: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: 12,
//     },
//     modalTitle: {
//         fontSize: 20,
//         fontWeight: '700',
//         color: COLORS.text,
//     },
//     closeButton: {
//         padding: 4,
//     },
//     modalScrollView: {
//         maxHeight: '70%',
//     },
//     modalContent: {
//         padding: 20,
//     },
//     section: {
//         marginBottom: 24,
//     },
//     sectionTitle: {
//         fontSize: 18,
//         fontWeight: '600',
//         color: COLORS.text,
//         marginBottom: 8,
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: 8,
//     },
//     sectionDescription: {
//         fontSize: 14,
//         color: COLORS.textLight,
//         marginBottom: 16,
//         lineHeight: 20,
//     },
//     userSearchContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         backgroundColor: COLORS.surface,
//         borderRadius: 12,
//         paddingHorizontal: 16,
//         paddingVertical: 12,
//         marginBottom: 16,
//         borderWidth: 1,
//         borderColor: COLORS.border,
//     },
//     userSearchInput: {
//         flex: 1,
//         fontSize: 16,
//         color: COLORS.text,
//     },
//     selectedUserContainer: {
//         backgroundColor: `${COLORS.success}10`,
//         borderRadius: 12,
//         padding: 16,
//         marginBottom: 16,
//         borderWidth: 1,
//         borderColor: COLORS.success,
//     },
//     selectedUserHeader: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: 8,
//         marginBottom: 12,
//     },
//     selectedUserTitle: {
//         fontSize: 16,
//         fontWeight: '600',
//         color: COLORS.success,
//     },
//     selectedUserInfo: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: 12,
//     },
//     userAvatarSmall: {
//         width: 40,
//         height: 40,
//         borderRadius: 20,
//         backgroundColor: `${COLORS.primary}20`,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     selectedUserDetails: {
//         flex: 1,
//     },
//     selectedUserName: {
//         fontSize: 16,
//         fontWeight: '600',
//         color: COLORS.text,
//         marginBottom: 2,
//     },
//     selectedUserEmail: {
//         fontSize: 14,
//         color: COLORS.textLight,
//     },
//     changeButton: {
//         paddingHorizontal: 12,
//         paddingVertical: 6,
//         backgroundColor: COLORS.surface,
//         borderRadius: 8,
//         borderWidth: 1,
//         borderColor: COLORS.border,
//     },
//     changeButtonText: {
//         fontSize: 14,
//         color: COLORS.text,
//         fontWeight: '500',
//     },
//     noteText: {
//         fontSize: 12,
//         color: COLORS.textLight,
//         marginTop: 8,
//         fontStyle: 'italic',
//     },
//     loadingUsersContainer: {
//         padding: 20,
//         alignItems: 'center',
//     },
//     loadingUsersText: {
//         marginTop: 8,
//         color: COLORS.textLight,
//         fontSize: 14,
//     },
//     usersListContainer: {
//         marginBottom: 16,
//     },
//     usersListHeader: {
//         marginBottom: 12,
//     },
//     usersListTitle: {
//         fontSize: 16,
//         fontWeight: '600',
//         color: COLORS.text,
//     },
//     usersListSubtitle: {
//         fontSize: 12,
//         color: COLORS.textLight,
//         marginTop: 2,
//     },
//     usersList: {
//         maxHeight: 200,
//     },
//     usersListContent: {
//         paddingBottom: 8,
//     },
//     userItem: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         padding: 12,
//         backgroundColor: COLORS.surface,
//         borderRadius: 12,
//         marginBottom: 8,
//         borderWidth: 1,
//         borderColor: COLORS.border,
//     },
//     selectedUserItem: {
//         backgroundColor: `${COLORS.primary}10`,
//         borderColor: COLORS.primary,
//     },
//     userAvatar: {
//         width: 50,
//         height: 50,
//         borderRadius: 25,
//         backgroundColor: `${COLORS.primary}20`,
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginRight: 12,
//     },
//     userInfo: {
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
//     userRole: {
//         fontSize: 12,
//         color: COLORS.grey,
//     },
//     noUsersContainer: {
//         padding: 30,
//         alignItems: 'center',
//         backgroundColor: COLORS.surface,
//         borderRadius: 12,
//         borderWidth: 1,
//         borderColor: COLORS.border,
//     },
//     noUsersText: {
//         fontSize: 16,
//         color: COLORS.textLight,
//         marginTop: 12,
//         marginBottom: 4,
//     },
//     noUsersSubtext: {
//         fontSize: 14,
//         color: COLORS.grey,
//         textAlign: 'center',
//     },
//     formGroup: {
//         marginBottom: 20,
//     },
//     label: {
//         fontSize: 16,
//         fontWeight: '600',
//         color: COLORS.text,
//         marginBottom: 8,
//     },
//     required: {
//         color: COLORS.error,
//     },
//     inputContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         backgroundColor: COLORS.background,
//         borderWidth: 1,
//         borderColor: COLORS.border,
//         borderRadius: 12,
//         paddingHorizontal: 16,
//     },
//     inputIcon: {
//         marginRight: 12,
//     },
//     input: {
//         flex: 1,
//         paddingVertical: 14,
//         fontSize: 16,
//         color: COLORS.text,
//     },
//     textAreaContainer: {
//         alignItems: 'flex-start',
//     },
//     textArea: {
//         minHeight: 100,
//         paddingTop: 14,
//     },
//     charCount: {
//         fontSize: 12,
//         color: COLORS.textLight,
//         alignSelf: 'flex-end',
//         marginTop: 8,
//     },
//     modalActions: {
//         flexDirection: 'row',
//         padding: 20,
//         backgroundColor: COLORS.background,
//         borderTopWidth: 1,
//         borderTopColor: COLORS.border,
//         gap: 12,
//     },
//     cancelButton: {
//         flex: 1,
//         paddingVertical: 16,
//         borderRadius: 12,
//         backgroundColor: COLORS.surface,
//         borderWidth: 1,
//         borderColor: COLORS.border,
//         alignItems: 'center',
//     },
//     cancelButtonText: {
//         fontSize: 16,
//         fontWeight: '600',
//         color: COLORS.text,
//     },
//     submitButton: {
//         flex: 2,
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'center',
//         gap: 8,
//         paddingVertical: 16,
//         borderRadius: 12,
//         backgroundColor: COLORS.primary,
//     },
//     submitButtonDisabled: {
//         backgroundColor: COLORS.grey,
//         opacity: 0.7,
//     },
//     submitButtonText: {
//         fontSize: 16,
//         fontWeight: '600',
//         color: COLORS.white,
//     },
// });

// export default CompaniesScreen;
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/stores/authstore';
import axios from 'axios';
import { BASE_URL } from '@/constants/Api';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'react-native';

// ========== أنواع البيانات ==========
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface CompanyOwner {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface Company {
  _id: string;
  name: string;
  description?: string;
  isApproved: boolean;
  owner: CompanyOwner;
  createdAt: string;
  updatedAt: string;
}

// ========== الألوان ==========
const COLORS = {
  primary: '#4ADE80',
  secondary: '#2DD4BF',
  background: '#FFFFFF',
  surface: '#F2F2F7',
  text: '#000000',
  textLight: '#8E8E93',
  border: '#C6C6C8',
  error: '#FF3B30',
  success: '#34C759',
  warning: '#FF9500',
  grey: '#9CA3AF',
  white: '#FFFFFF',
};

// Helper for responsive modal max height
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MODAL_MAX_HEIGHT = Math.round(SCREEN_HEIGHT);

// ========== المكون الرئيسي ==========
const CompaniesScreen = () => {
  const { user, token } = useAuthStore();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [eligibleUsers, setEligibleUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [adding, setAdding] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  // ========== جلب الشركات ==========
  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const res = await axios.get<Company[]>(`${BASE_URL}/api/company`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompanies(res.data || []);
    } catch (err: any) {
      console.error(err);
      Alert.alert('Error', err.response?.data?.message || 'Failed to load companies');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ========== جلب المستخدمين المؤهلين ==========
  const fetchEligibleUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await axios.get(`${BASE_URL}/api/company/eligible-users`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setEligibleUsers(res.data || []);
    } catch (err: any) {
      console.error('Error fetching eligible users:', err);
      let errorMessage = 'Failed to load eligible users';
      if (err.response?.status === 401) {
        errorMessage = 'Authentication failed. Please login again.';
      } else if (err.response?.status === 403) {
        errorMessage = 'You do not have permission to access this resource.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      Alert.alert('Error', errorMessage);
      setEligibleUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  // ========== الموافقة على شركة ==========
  const approveCompany = async (companyId: string) => {
    try {
      await axios.patch(
        `${BASE_URL}/api/company/${companyId}/approve`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCompanies(prev =>
        prev.map(comp => (comp._id === companyId ? { ...comp, isApproved: true } : comp))
      );
      Alert.alert('Success', 'Company approved successfully');
    } catch (err: any) {
      console.error(err);
      Alert.alert('Error', err.response?.data?.message || 'Failed to approve company');
    }
  };

  // ========== حذف شركة ==========
  const deleteCompany = async (companyId: string) => {
    Alert.alert('Delete Company', 'Are you sure you want to delete this company? This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await axios.delete(`${BASE_URL}/api/company/${companyId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setCompanies(prev => prev.filter(comp => comp._id !== companyId));
            Alert.alert('Success', 'Company deleted successfully');
          } catch (err: any) {
            console.error(err);
            Alert.alert('Error', err.response?.data?.message || 'Failed to delete company');
          }
        },
      },
    ]);
  };

  // ========== إنشاء شركة لمستخدم ==========
  const handleCreateCompanyForUser = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Company name is required');
      return;
    }
    if (!selectedUser) {
      Alert.alert('Error', 'Please select a user to be the owner');
      return;
    }

    try {
      setAdding(true);
      const response = await axios.post(
        `${BASE_URL}/api/company/for-user`,
        {
          userId: selectedUser._id,
          name: formData.name,
          description: formData.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setCompanies(prev => [response.data.company, ...prev]);
      setEligibleUsers(prev => prev.filter(u => u._id !== selectedUser._id));
      setAddModalVisible(false);
      resetForm();
      Alert.alert('Success', 'Company created successfully!');
    } catch (error: any) {
      console.error('Create company error:', error);
      let errorMessage = 'Failed to create company';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      Alert.alert('Error', errorMessage);
    } finally {
      setAdding(false);
    }
  };

  // ========== إعادة تعيين النموذج ==========
  const resetForm = () => {
    setFormData({ name: '', description: '' });
    setSelectedUser(null);
    setUserSearchQuery('');
  };

  // ========== معالجة التغيير في الحقول ==========
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // ========== جلب البيانات عند التحميل ==========
  useEffect(() => {
    if (token) {
      fetchCompanies();
    }
  }, [token]);

  // ========== تحديث عند السحب ==========
  const onRefresh = () => {
    setRefreshing(true);
    fetchCompanies();
  };

  // ========== فتح المودال ==========
  const openAddModal = async () => {
    setAddModalVisible(true);
    fetchEligibleUsers();
  };

  // ========== التصفية ==========
  const filteredCompanies = companies.filter(
    company =>
      company.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.owner?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.owner?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = eligibleUsers.filter(
    user =>
      user.name?.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  // ========== عرض شركة ==========
  const renderCompany = ({ item }: { item: Company }) => (
    <View style={styles.companyCard}>
      <View style={styles.companyHeader}>
        <View style={styles.companyLogo}>
          <Ionicons name="business-outline" size={24} color={COLORS.primary} />
        </View>
        <View style={styles.companyTitleContainer}>
          <Text style={styles.companyName} numberOfLines={1}>
            {item.name}
          </Text>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: item.isApproved ? `${COLORS.success}20` : `${COLORS.warning}10`,
                borderColor: item.isApproved ? COLORS.success : COLORS.warning,
              },
            ]}
          >
            <Ionicons
              name={item.isApproved ? 'checkmark-circle' : 'time-outline'}
              size={14}
              color={item.isApproved ? COLORS.success : COLORS.warning}
            />
            <Text
              style={[
                styles.statusText,
                { color: item.isApproved ? COLORS.success : COLORS.warning },
              ]}
            >
              {item.isApproved ? 'Approved' : 'Pending'}
            </Text>
          </View>
        </View>
        <View style={styles.companyActions}>
          <TouchableOpacity style={styles.actionButton} onPress={() => deleteCompany(item._id)}>
            <Ionicons name="trash-outline" size={20} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.companyDescription} numberOfLines={2}>
        {item.description || 'No description available'}
      </Text>

      {item.owner && (
        <View style={styles.ownerContainer}>
          <Ionicons name="person-outline" size={14} color={COLORS.textLight} />
          <Text style={styles.ownerText}>
            Owner: {item.owner.name} • {item.owner.email}
          </Text>
          {item.owner.role === 'company' && (
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>{item.owner.role.toUpperCase()}</Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.companyFooter}>
        <Text style={styles.companyId}>
          <Ionicons name="key-outline" size={12} color={COLORS.grey} /> ID: {item._id?.substring(0, 8)}...
        </Text>
        {!item.isApproved && user?.role === 'admin' && (
          <TouchableOpacity style={styles.approveButton} onPress={() => approveCompany(item._id)}>
            <Ionicons name="checkmark-outline" size={16} color={COLORS.white} />
            <Text style={styles.approveText}>Approve</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  // ========== عرض مستخدم ==========
  const renderUserItem = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={[styles.userItem, selectedUser?._id === item._id && styles.selectedUserItem]}
      onPress={() => setSelectedUser(item)}
    >
      <View style={styles.userAvatar}>
        <Ionicons name="person" size={20} color={COLORS.primary} />
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.userName} numberOfLines={1}>
          {item.name || 'Unnamed User'}
        </Text>
        <Text style={styles.userEmail} numberOfLines={1}>
          {item.email}
        </Text>
        <Text style={styles.userRole}>Role: {item.role}</Text>
      </View>
      {selectedUser?._id === item._id && <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="business" size={28} color={COLORS.primary} />
          <Text style={styles.headerTitle}>Companies</Text>
        </View>
        {user?.role === 'admin' && (
          <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
            <Ionicons name="add" size={24} color={COLORS.white} />
          </TouchableOpacity>
        )}
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={COLORS.textLight} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search companies..."
          placeholderTextColor={COLORS.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={COLORS.textLight} />
          </TouchableOpacity>
        )}
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{companies.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: COLORS.success }]}>{companies.filter(c => c.isApproved).length}</Text>
          <Text style={styles.statLabel}>Approved</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: COLORS.warning }]}>{companies.filter(c => !c.isApproved).length}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
      </View>

      {/* Companies List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          {/* <ActivityIndicator size="large" color={COLORS.primary} /> */}
          <Image source={require('@/assets/images/logo.png')}  style={{width:100,height:100}} resizeMode='center' />
          {/* <Text style={styles.loadingText}>Loading companies...</Text> */}

        </View>
      ) : (
        <FlatList
          data={filteredCompanies}
          keyExtractor={item => item._id}
          renderItem={renderCompany}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="business-outline" size={80} color={COLORS.border} />
              <Text style={styles.emptyText}>No companies found</Text>
              <Text style={styles.emptySubText}>{searchQuery ? 'Try a different search' : 'No companies yet'}</Text>
              {!searchQuery && user?.role === 'admin' && (
                <TouchableOpacity style={styles.addFirstButton} onPress={openAddModal}>
                  <Ionicons name="add" size={20} color={COLORS.white} />
                  <Text style={styles.addFirstText}>Create First Company</Text>
                </TouchableOpacity>
              )}
            </View>
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Create Company Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addModalVisible}
        onRequestClose={() => {
          setAddModalVisible(false);
          resetForm();
        }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView
              style={styles.keyboardAvoiding}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
              <View style={styles.modalContainer}>
                {/* Header */}
                <View style={styles.modalHeader}>
                  <View style={styles.modalHeaderLeft}>
                    <Ionicons name="business-outline" size={24} color={COLORS.primary} />
                    <Text style={styles.modalTitle}>Create Company for User</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => {
                      setAddModalVisible(false);
                      resetForm();
                    }}
                    disabled={adding}
                  >
                    <Ionicons name="close" size={24} color={COLORS.textLight} />
                  </TouchableOpacity>
                </View>

                {/* Content */}
                <View style={styles.modalContent}>
                  {/* Step 1: Select User */}
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                      <Ionicons name="person-outline" size={18} color={COLORS.primary} />{' '}
                      Step 1: Select User
                    </Text>

                    {/* User Search */}
                    <View style={styles.userSearchContainer}>
                      <Ionicons name="search" size={20} color={COLORS.textLight} style={styles.searchIcon} />
                      <TextInput
                        style={styles.userSearchInput}
                        placeholder="Search users..."
                        placeholderTextColor={COLORS.textLight}
                        value={userSearchQuery}
                        onChangeText={setUserSearchQuery}
                      />
                    </View>

                    {/* Selected User Preview */}
                    {selectedUser && (
                      <View style={styles.selectedUserContainer}>
                        <View style={styles.selectedUserHeader}>
                          <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
                          <Text style={styles.selectedUserTitle}>Selected User</Text>
                        </View>
                        <View style={styles.selectedUserInfo}>
                          <View style={styles.userAvatarSmall}>
                            <Ionicons name="person" size={16} color={COLORS.primary} />
                          </View>
                          <View style={styles.selectedUserDetails}>
                            <Text style={styles.selectedUserName} numberOfLines={1}>
                              {selectedUser.name || 'Unnamed User'}
                            </Text>
                            <Text style={styles.selectedUserEmail} numberOfLines={1}>
                              {selectedUser.email}
                            </Text>
                          </View>
                          <TouchableOpacity style={styles.changeButton} onPress={() => setSelectedUser(null)}>
                            <Text style={styles.changeButtonText}>Change</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}

                    {/* Users List */}
                    <View style={styles.usersListContainer}>
                      {loadingUsers ? (
                        <View style={styles.loadingUsersContainer}>
                          <ActivityIndicator size="small" color={COLORS.primary} />
                          <Text style={styles.loadingUsersText}>Loading users...</Text>
                        </View>
                      ) : filteredUsers.length === 0 ? (
                        <View style={styles.noUsersContainer}>
                          <Ionicons name="people-outline" size={40} color={COLORS.border} />
                          <Text style={styles.noUsersText}>No eligible users</Text>
                        </View>
                      ) : (
                        <>
                          <Text style={styles.usersCountText}>
                            {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} available
                          </Text>
                          <FlatList
                            data={filteredUsers}
                            keyExtractor={item => item._id}
                            renderItem={renderUserItem}
                            style={styles.usersList}
                            contentContainerStyle={styles.usersListContent}
                            showsVerticalScrollIndicator={false}
                            nestedScrollEnabled={true}
                          />
                        </>
                      )}
                    </View>
                  </View>

                  {/* Step 2: Company Details */}
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                      <Ionicons name="business-outline" size={18} color={COLORS.primary} />{' '}
                      Step 2: Company Details
                    </Text>

                    <TextInput
                      style={styles.input}
                      placeholder="Company Name *"
                      placeholderTextColor={COLORS.textLight}
                      value={formData.name}
                      onChangeText={text => handleInputChange('name', text)}
                    />

                    <TextInput
                      style={[styles.input, styles.textArea]}
                      placeholder="Description (optional)"
                      placeholderTextColor={COLORS.textLight}
                      value={formData.description}
                      onChangeText={text => handleInputChange('description', text)}
                      multiline
                      numberOfLines={3}
                      textAlignVertical="top"
                    />
                  </View>
                </View>

                {/* Modal Actions */}
                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => {
                      setAddModalVisible(false);
                      resetForm();
                    }}
                    disabled={adding}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.submitButton,
                      (!formData.name.trim() || !selectedUser) && styles.submitButtonDisabled,
                    ]}
                    onPress={handleCreateCompanyForUser}
                    disabled={adding || !formData.name.trim() || !selectedUser}
                  >
                    {adding ? (
                      <ActivityIndicator size="small" color={COLORS.white} />
                    ) : (
                      <>
                        <Ionicons name="business-outline" size={18} color={COLORS.white} />
                        <Text style={styles.submitButtonText}>Create</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

// ========== الأنماط ==========
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: COLORS.textLight,
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  companyCard: {
    backgroundColor: COLORS.background,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  companyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  companyLogo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: `${COLORS.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  companyTitleContainer: {
    flex: 1,
  },
  companyName: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  companyActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  companyDescription: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 20,
    marginBottom: 12,
  },
  ownerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  ownerText: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '500',
    flex: 1,
  },
  roleBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  roleBadgeText: {
    fontSize: 10,
    color: COLORS.white,
    fontWeight: '600',
  },
  companyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  companyId: {
    fontSize: 12,
    color: COLORS.grey,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  approveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.success,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  approveText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 13,
  },
  emptyContainer: {
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
    marginBottom: 20,
  },
  addFirstButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  addFirstText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 15,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
    height: '100%'
  },
  keyboardAvoiding: {
    flex: 1,
    justifyContent: 'flex-end',
    // height:'90%'
  },
  modalContainer: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: MODAL_MAX_HEIGHT,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    maxHeight: MODAL_MAX_HEIGHT - 180,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  userSearchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
  },
  selectedUserContainer: {
    backgroundColor: `${COLORS.success}10`,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.success,
  },
  selectedUserHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  selectedUserTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.success,
  },
  selectedUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  userAvatarSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${COLORS.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedUserDetails: {
    flex: 1,
  },
  selectedUserName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  selectedUserEmail: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  changeButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  changeButtonText: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '500',
  },
  loadingUsersContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingUsersText: {
    marginTop: 12,
    color: COLORS.textLight,
    fontSize: 14,
  },
  usersListContainer: {
    minHeight: 150,
    marginBottom: 10,
  },
  usersCountText: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 8,
  },
  usersList: {
    maxHeight: 200,
  },
  usersListContent: {
    paddingBottom: 8,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  selectedUserItem: {
    backgroundColor: `${COLORS.primary}10`,
    borderColor: COLORS.primary,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${COLORS.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 2,
  },
  userRole: {
    fontSize: 12,
    color: COLORS.grey,
  },
  noUsersContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  noUsersText: {
    fontSize: 15,
    color: COLORS.textLight,
    marginTop: 12,
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: COLORS.text,
    marginBottom: 12,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  submitButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.grey,
    opacity: 0.7,
  },
  submitButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 15,
  },
});

export default CompaniesScreen;