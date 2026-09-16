// (adminandStaff)/user.tsx
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/stores/authstore';
import axios from 'axios';
import { BASE_URL } from '@/constants/Api';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';

const UserScreen = () => {
  const { user, logout, token } = useAuthStore();
  const [users, setUsers] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    role: '',
  });
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [addForm, setAddForm] = useState({
    name: '',
    email: '',
    password: '',
  });


  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${BASE_URL}/api/auth/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data.data || []);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setEditForm({
      name: user.name || '',
      email: user.email || '',
      role: user.role || '',
    });
    setEditModalVisible(true);
  };

  const handleUpdateUser = async () => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/auth/users/${editingUser._id}`,
        editForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // تحديث القائمة محلياً
      // setUsers(users.map((u) =>
      //   u._id === editingUser._id ? { ...u, ...editForm } : u
      // ));

      Alert.alert('Success', 'User updated successfully');
      setEditModalVisible(false);
      setEditingUser(null);
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to update user');
    }
  };

  const confirmDeleteUser = (user: any) => {
    // منع حذف المستخدم الحالي


    setUserToDelete(user);
    setDeleteModalVisible(true);
  };

  const handleDeleteUser = async () => {
    try {
      await axios.delete(`${BASE_URL}/api/auth/users/${userToDelete._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // إزالة المستخدم من القائمة محلياً
      setUsers(users.filter((u: any) => u._id !== userToDelete._id));

      Alert.alert('Success', 'User deleted successfully');
      setDeleteModalVisible(false);
      setUserToDelete(null);
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to delete user');
    }
  };

  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return '#dc2626';
      case 'staff':
        return '#059669';
      case 'user':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'shield-checkmark';
      case 'staff':
        return 'people';
      case 'client':
        return 'person';
      default:
        return 'help';
    }
  };

  const filteredUsers = users.filter((userItem: any) =>
    userItem.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    userItem.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    userItem.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderUser = ({ item }: { item: any }) => (
    <View style={styles.userItem}>
      <View style={styles.userAvatar}>
        <Ionicons
          name={getRoleIcon(item.role)}
          size={24}
          color={getRoleColor(item.role)}
        />
      </View>

      <View style={styles.userInfo}>
        <View style={styles.userHeader}>
          <Text style={styles.userName}>{item.name || 'No Name'}</Text>
          <View style={[styles.roleBadge, { backgroundColor: getRoleColor(item.role) + '20' }]}>
            <Text style={[styles.roleText, { color: getRoleColor(item.role) }]}>
              {item.role?.toUpperCase()}
            </Text>
          </View>
        </View>

        <Text style={styles.userEmail}>
          <Ionicons name="mail-outline" size={14} color="#666" /> {item.email}
        </Text>

        <Text style={styles.userId}>
          <Ionicons name="key-outline" size={14} color="#666" /> ID: {item._id?.substring(0, 8)}...
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEditUser(item)}
          disabled={item._id === user?.id}
        >
          <Ionicons name="create-outline" size={20} color="#3b82f6" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => confirmDeleteUser(item)}
          disabled={item._id === user?.id}
        >
          <Ionicons name="trash-outline" size={20} color="#dc2626" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleAddStaff = async () => {
    if (!addForm.name || !addForm.email || !addForm.password) {
      return Alert.alert('Error', 'All fields are required');
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/api/auth/register`,
        {
          ...addForm,
          role: 'staff', // حدد role كـ staff فقط
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers([response.data.user, ...users]); // تحديث القائمة محلياً
      Alert.alert('Success', 'Staff added successfully');
      setAddModalVisible(false);
      setAddForm({ name: '', email: '', password: '' });
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to add staff');
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="people" size={24} color={COLORS.primary} />
          <Text style={styles.headerTitle}>
            {user?.role === 'staff' ? 'Staff Dashboard' : 'Admin Dashboard'}
          </Text>
        </View>

        <View style={styles.headerRight}>
          {/* <Text style={styles.welcomeText}>
            Welcome, {user?.name?.split(' ')[0]}
          </Text> */}
          <TouchableOpacity style={styles.logoutButton} onPress={() => logout()}>
            <Ionicons name="log-out-outline" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}


      <TouchableOpacity
        style={{
          backgroundColor: '#059669',
          padding: 8,
          borderRadius: 8,
          marginLeft: 12,
          width: 42
        }}
        onPress={() => setAddModalVisible(true)}
      >
        <Ionicons name="person-add-outline" size={20} color="white" />
      </TouchableOpacity>
      <View style={styles.searchContainer}>

        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search users by name, email, or role..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { flexGrow: 1 }]}>
          <Text style={styles.statNumber}>{users.length}</Text>
          <Text style={styles.statLabel}>All Users</Text>
        </View>

        {/* <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {users.filter((u: any) => u.role === "admin").length}
          </Text>
          <Text style={styles.statLabel}>Admins</Text>
        </View> */}

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {users.filter((u: any) => u.role === "staff").length}
          </Text>
          <Text style={styles.statLabel}>Staff</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {users.filter((u: any) => u.role === "client").length}
          </Text>
          <Text style={styles.statLabel}>Clients</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {users.filter((u: any) => u.role === "company").length}
          </Text>
          <Text style={styles.statLabel}>Company</Text>
        </View>
      </View>


      {/* Loading / Error / List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading users...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={50} color="#dc2626" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchUsers}>
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item._id}
          renderItem={renderUser}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#4f46e5']}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={80} color="#d1d5db" />
              <Text style={styles.emptyText}>No users found</Text>
              <Text style={styles.emptySubText}>
                {searchQuery ? 'Try a different search term' : 'Start by adding new users'}
              </Text>
            </View>
          }
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Edit User Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit User</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={editForm.name}
                onChangeText={(text) => setEditForm({ ...editForm, name: text })}
                placeholder="Enter name"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={editForm.email}
                onChangeText={(text) => setEditForm({ ...editForm, email: text })}
                placeholder="Enter email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Role</Text>
              <View style={styles.roleOptions}>
                {['admin', 'staff', 'user'].map((role) => (
                  <TouchableOpacity
                    key={role}
                    style={[
                      styles.roleOption,
                      editForm.role === role && styles.roleOptionSelected,
                      { borderColor: getRoleColor(role) }
                    ]}
                    onPress={() => setEditForm({ ...editForm, role })}
                  >
                    <Text style={[
                      styles.roleOptionText,
                      editForm.role === role && { color: getRoleColor(role) }
                    ]}>
                      {role.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleUpdateUser}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.deleteModalHeader}>
              <Ionicons name="warning" size={50} color="#dc2626" />
              <Text style={styles.deleteModalTitle}>Delete User</Text>
              <Text style={styles.deleteModalText}>
                Are you sure you want to delete {userToDelete?.name}?
                This action cannot be undone.
              </Text>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.deleteConfirmButton]}
                onPress={handleDeleteUser}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={addModalVisible}
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Staff</Text>
              <TouchableOpacity onPress={() => setAddModalVisible(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={addForm.name}
                onChangeText={(text) => setAddForm({ ...addForm, name: text })}
                placeholder="Enter name"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={addForm.email}
                onChangeText={(text) => setAddForm({ ...addForm, email: text })}
                placeholder="Enter email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                value={addForm.password}
                onChangeText={(text) => setAddForm({ ...addForm, password: text })}
                placeholder="Enter password"
                secureTextEntry
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setAddModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddStaff}
              >
                <Text style={styles.saveButtonText}>Add Staff</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>


    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
  },
  welcomeText: {
    fontSize: 14,
    color: '#6b7280',
  },
  logoutButton: {
    backgroundColor: '#dc2626',
    padding: 8,
    borderRadius: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 12,
  },

  statCard: {
    width: "28%",             // كروت متناسقة 2×2
    // width: "48%",             // كروت متناسقة 2×2

    backgroundColor: "#fff",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },

  statNumber: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.primary,
  },

  statLabel: {
    fontSize: 11,
    color: "#6b7280",
    marginTop: 4,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#6b7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    textAlign: 'center',
    color: '#dc2626',
    marginTop: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 50,
    marginBottom: 10,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: {
    fontSize: 10,
    fontWeight: '700',
  },
  userEmail: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  userId: {
    fontSize: 12,
    color: '#9ca3af',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#dbeafe',
  },
  deleteButton: {
    backgroundColor: '#fee2e2',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#1f2937',
  },
  roleOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  roleOption: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
  },
  roleOptionSelected: {
    backgroundColor: '#f8fafc',
  },
  roleOptionText: {
    fontWeight: '600',
    fontSize: 12,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
  },
  cancelButtonText: {
    color: '#6b7280',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: COLORS.primary,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  deleteModalHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  deleteModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#dc2626',
    marginTop: 16,
  },
  deleteModalText: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 8,
    lineHeight: 20,
  },
  deleteConfirmButton: {
    backgroundColor: '#dc2626',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default UserScreen;