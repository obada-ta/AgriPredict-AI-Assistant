
import { BASE_URL } from "@/constants/Api";
import { COLORS } from "@/constants/theme";
import { useAuthStore } from "@/stores/authstore";
import { styles } from "@/styles/profile.styles";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from 'expo-image-picker';
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// User data type
interface User {
  id: string;
  name: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
  followers: string[];
  following: string[];
  postsCount: number;
}

interface Post {
  _id: string;
  title: string;
  content: string;
  image: string;
  likes: string[];
  comments: number;
  createdAt: string;
}

export default function Profile() {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isViewModalSetting, setIsViewModalSetting] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [newAvatar, setNewAvatar] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { logout, user, token } = useAuthStore();
  const [editedProfile, setEditedProfile] = useState({
    name: "",
    email: "",
    bio: "",
  });

  // Fetch user profile from server
  const fetchUserProfile = async () => {
    try {
      if (!token) {
        console.log('No token available');
        return;
      }
      setIsRefreshing(true);
      const apiUrl = `${BASE_URL}/api/auth/getUserProfile/${user?.id}`;
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch data: ${response.status}`);
      }

      const result = await response.json();
      if (result.success && result.user) {
        // تحديث بيانات المستخدم مع avatarUrl
        const normalizePath = (path: string) => path.replace(/\\/g, '/');


    const userData = {
  id: result.user._id,
  name: result.user.name,
  email: result.user.email,
  bio: result.user.bio || "",
  avatarUrl: result.user.avatar ? `${BASE_URL}/${normalizePath(result.user.avatar)}` : undefined,
  followers: result.user.followers || [],
  following: result.user.following || [],
  postsCount: result.user.postsCount || 0
};

        setCurrentUser(userData);
        setEditedProfile({
          name: result.user.name,
          email: result.user.email,
          bio: result.user.bio || "",
        });

        // تحديث الـ posts
        if (result.posts && Array.isArray(result.posts)) {
          const formattedPosts = result.posts.map((post: any) => ({
            _id: post._id,
            title: post.title || "",
            content: post.content || "",
            image: post.image ? `${BASE_URL}${post.image}` : require('@/assets/images/logo.png'),
            likes: post.likes || [],
            comments: 0, // يمكنك إضافة comments من الـ API إذا كان متاحًا
            createdAt: post.createdAt
          }));
          setPosts(formattedPosts);
        }
      } else {
        throw new Error(result.message || "Failed to fetch user data");
      }
    } catch (error: any) {
      console.error("Error fetching user profile:", error);
      if (error.message.includes('Network request failed')) {
        Alert.alert(
          "Connection Error",
          "Unable to connect to server. Please check your internet connection and try again."
        );
      } else {
        Alert.alert("Error", error.message || "An error occurred while fetching data");
      }
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  };
console.log(currentUser);

  // Pick image from gallery
  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission Required", "We need access to your gallery to change the photo!");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets && result.assets[0]) {
        setNewAvatar(result.assets[0]);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to select image");
    }
  };

  // Take photo with camera
  const takePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission Required", "We need camera permission to take a photo!");
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets && result.assets[0]) {
        setNewAvatar(result.assets[0]);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "Failed to take photo");
    }
  };

  // Remove selected image
  const removeSelectedImage = () => {
    setNewAvatar(null);
  };

  // Save profile changes
  const handleSaveProfile = async () => {
    try {
      if (!token) {
        Alert.alert("Error", "You must login first");
        return;
      }
      setIsLoading(true);
      const formData = new FormData();
      formData.append('name', editedProfile.name.trim());
      formData.append('email', editedProfile.email.trim());
      formData.append('bio', editedProfile.bio?.trim() || '');

      if (newAvatar) {
        const uri = newAvatar.uri;
        const filename = uri.split('/').pop() || `avatar-${Date.now()}.jpg`;
        const extension = filename.split('.').pop()?.toLowerCase();
        let mimeType = 'image/jpeg';
        if (extension === 'png') mimeType = 'image/png';
        else if (extension === 'jpg' || extension === 'jpeg') mimeType = 'image/jpeg';

        formData.append('avatar', {
          uri,
          name: filename,
          type: mimeType,
        } as any);
      }

      const apiUrl = `${BASE_URL}/api/auth/userMe`;
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Update failed: ${response.status}`);
      }

      const result = await response.json();
      if (result.success && result.user) {
        setCurrentUser(prev => prev ? {
          ...prev,
          name: result.user.name,
          email: result.user.email,
          bio: result.user.bio || "",
          avatarUrl: result.user.avatar ? `${BASE_URL}/${result.user.avatar}` : prev.avatarUrl
        } : null);
        setNewAvatar(null);
        setIsEditModalVisible(false);
        Alert.alert("Success", "Profile updated successfully");
      } else {
        Alert.alert("Error", result.message || "Failed to update profile");
      }
    } catch (error: any) {
      console.error("Error in handleSaveProfile:", error);
      if (error.message.includes('Network request failed')) {
        Alert.alert(
          "Network Error",
          "Please check:\n• Internet connection\n• Server status\n• Image size is less than 5MB"
        );
      } else {
        Alert.alert("Error", error.message || "An error occurred during update");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = () => {
    logout();
  };

  // Fetch data on mount
  useEffect(() => {
    if (token) {
      fetchUserProfile();
    }
  }, [token]);

  // Loading state
  if (isRefreshing && !currentUser) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Ionicons name="refresh" size={48} color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading data</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (!currentUser) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={COLORS.error} />
          <Text style={styles.errorText}>Failed to load data</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchUserProfile}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return `${Math.floor(diffInHours / 24)}d ago`;
    }
  };

  // Render post item
  const renderPostItem = ({ item }: { item: Post }) => (
    <TouchableOpacity
      style={styles.gridItem}
      onPress={() => setSelectedPost(item)}
      activeOpacity={0.8}
    >
      <Image
        source={typeof item.image === 'string' ? { uri: item.image } : item.image}
        style={styles.gridImage}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.postOverlay}>
        <View style={styles.postStats}>
          <Ionicons name="heart" size={16} color="white" />
          <Text style={styles.postStatText}>{item.likes.length}</Text>
          <Ionicons name="chatbubble" size={16} color="white" style={{ marginLeft: 8 }} />
          <Text style={styles.postStatText}>{item.comments}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        {user?.role==='company'? 
        <>
          <Ionicons name="business" size={20} color={COLORS.primary} />
          <Text>Company</Text>
        </>
        :
        <View style={styles.headerLeft}>
          <Text style={styles.username}>{currentUser.name}</Text>
        </View>
        }
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIcon}
            onPress={() => setIsViewModalSetting(true)}
          >
            <Ionicons name="settings-outline" size={24} color={'black'} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={fetchUserProfile}
            colors={[COLORS.primary]}
          />
        }
      >
        <View style={styles.profileInfo}>
          {/* AVATAR & STATS */}
          <View style={styles.avatarAndStats}>
            <View style={styles.avatarContainer}>
              <Image
                source={currentUser.avatarUrl ? { uri: currentUser.avatarUrl } : require('@/assets/images/avatar.png')}
                style={styles.avatar}
                contentFit="cover"
                transition={200}
              />
              {isLoading && (
                <View style={styles.loadingOverlay}>
                  <Ionicons name="refresh" size={20} color={"white"} />
                </View>
              )}
            </View>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{currentUser.postsCount}</Text>
                <Text style={styles.statLabel}>Posts</Text>
                
                
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{currentUser.followers.length}</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{currentUser.following.length}</Text>
                <Text style={styles.statLabel}>Following</Text>
              </View>
            </View>
          </View>

          {/* Name and Bio */}
          <Text style={styles.name}>{currentUser.name}</Text>
          {currentUser.bio ? (
            <Text style={styles.bio}>{currentUser.bio}</Text>
          ) : (
            <Text style={styles.noBio}>No bio yet</Text>
          )}

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.editButton, isLoading && styles.disabledButton]}
              onPress={() => setIsEditModalVisible(true)}
              disabled={isLoading}
            >
              <Text style={styles.editButtonText}>
                {isLoading ? "Loading..." : "Edit Profile"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton} onPress={()=>router.push('/(tabs)/create')}>
              <Ionicons name="share-outline" size={20} color={'white'} />
            </TouchableOpacity>
          </View>
        </View>

        {/* POSTS SECTION */}
        <View style={styles.postsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Posts</Text>
            <TouchableOpacity>
              <Ionicons name="grid" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          {posts.length === 0 ? (
            <NoPostsFound />
          ) : (
            <FlatList
              data={posts}
              numColumns={3}
              scrollEnabled={false}
              renderItem={renderPostItem}
              keyExtractor={(item) => item._id}
              contentContainerStyle={styles.gridContainer}
            />
          )}
        </View>
      </ScrollView>

      {/* EDIT PROFILE MODAL */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => !isLoading && setIsEditModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalContainer}
          >
            <ScrollView style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit Profile</Text>
                <TouchableOpacity
                  onPress={() => !isLoading && setIsEditModalVisible(false)}
                  disabled={isLoading}
                >
                  <Ionicons name="close" size={24} color={'black'} />
                </TouchableOpacity>
              </View>

              {/* Avatar Section */}
              <View style={[styles.inputContainer, { flexDirection: 'row', justifyContent: 'center' }]}>
                <View style={styles.avatarEditContainer}>
                  <Image
                    source={
                      newAvatar
                        ? { uri: newAvatar.uri }
                        : currentUser.avatarUrl
                          ? { uri: currentUser.avatarUrl }
                          : require('@/assets/images/avatar.png')
                    }
                    style={[styles.avatar, { width: 120, height: 120 }]}
                    contentFit="cover"
                    transition={200}
                  />
                  <View style={styles.avatarActions}>
                    <TouchableOpacity
                      style={[styles.avatarButton, isLoading && styles.disabledButton]}
                      onPress={pickImage}
                      disabled={isLoading}
                    >
                      <Ionicons name="image-outline" size={20} color={'white'} />
                      <Text style={styles.avatarButtonText}>Gallery</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.avatarButton, isLoading && styles.disabledButton]}
                      onPress={takePhoto}
                      disabled={isLoading}
                    >
                      <Ionicons name="camera-outline" size={20} color={'white'} />
                      <Text style={styles.avatarButtonText}>Camera</Text>
                    </TouchableOpacity>
                    {newAvatar && (
                      <TouchableOpacity
                        style={[styles.avatarButton, { backgroundColor: '#FF3B30' }, isLoading && styles.disabledButton]}
                        onPress={removeSelectedImage}
                        disabled={isLoading}
                      >
                        <Ionicons name="trash-outline" size={20} color={'white'} />
                        <Text style={styles.avatarButtonText}>Remove</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>

              {/* Form Inputs */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput
                  style={styles.input}
                  value={editedProfile.name}
                  onChangeText={(text) => setEditedProfile({ ...editedProfile, name: text })}
                  placeholderTextColor={COLORS.grey}
                  editable={!isLoading}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={editedProfile.email}
                  onChangeText={(text) => setEditedProfile({ ...editedProfile, email: text })}
                  placeholderTextColor={COLORS.grey}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!isLoading}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Bio</Text>
                <TextInput
                  style={[styles.input, styles.bioInput]}
                  value={editedProfile.bio}
                  onChangeText={(text) => setEditedProfile({ ...editedProfile, bio: text })}
                  multiline
                  numberOfLines={4}
                  placeholderTextColor={COLORS.grey}
                  placeholder="Tell us about yourself..."
                  editable={!isLoading}
                />
              </View>

              <TouchableOpacity
                style={[styles.saveButton, isLoading && styles.disabledButton]}
                onPress={handleSaveProfile}
                disabled={isLoading}
              >
                <Text style={styles.saveButtonText}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Post Detail Modal */}
      <Modal
        visible={!!selectedPost}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setSelectedPost(null)}
      >
        <View style={styles.modalBackdrop}>
          {selectedPost && (
            <View style={styles.postDetailContainer}>
              <View style={styles.postDetailHeader}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => setSelectedPost(null)}
                >
                  <Ionicons name="arrow-back" size={24} color={'white'} />
                </TouchableOpacity>
                <Text style={styles.postDetailUsername}>{currentUser.name}</Text>
                <TouchableOpacity style={styles.optionsButton}>
                  <Ionicons name="ellipsis-horizontal" size={24} color={'white'} />
                </TouchableOpacity>
              </View>

              <View style={styles.postDetailContent}>
                <Image
                  source={typeof selectedPost.image === 'string' ? { uri: selectedPost.image } : selectedPost.image}
                  style={styles.postDetailImage}
                  contentFit="contain"
                />

                <View style={styles.postDetailInfo}>
                  <View style={styles.postDetailStats}>
                    <TouchableOpacity style={styles.postDetailStat}>
                      <Ionicons name="heart-outline" size={24} color={'white'} />
                      <Text style={styles.postDetailStatText}>{selectedPost.likes.length}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.postDetailStat}>
                      <Ionicons name="chatbubble-outline" size={24} color={'white'} />
                      <Text style={styles.postDetailStatText}>{selectedPost.comments}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.postDetailStat}>
                      <Ionicons name="share-outline" size={24} color={'white'} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.postDetailText}>
                    <Text style={styles.postDetailUsername}>{currentUser.name}</Text>
                    <Text style={styles.postDetailCaption}>{selectedPost.content}</Text>
                    <Text style={styles.postDetailTime}>{formatTime(selectedPost.createdAt)}</Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>
      </Modal>

      {/* SETTINGS MODAL */}
      <Modal
        visible={isViewModalSetting}
        animationType="none"
        transparent={true}
        onRequestClose={() => setIsViewModalSetting(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsViewModalSetting(false)}
        >
          <View
            style={styles.settingsSidebar}
            onStartShouldSetResponder={() => true}
            onTouchEnd={(e) => e.stopPropagation()}
          >
            <View style={styles.sidebarHeader}>
              <Text style={styles.sidebarTitle}>Settings</Text>
              <TouchableOpacity
                onPress={() => setIsViewModalSetting(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={[
                { id: 'notifications', title: 'Notifications', icon: 'notifications-outline' },
                { id: 'help', title: 'Help', icon: 'help-circle-outline' },
                { id: 'language', title: 'Language', icon: 'language-outline' },
                { id: 'changePassword', title: 'Change Password', icon: 'lock-closed-outline' },
                { id: 'feedBack', title: 'FeedBack', icon: 'document-text-outline' },
              ]}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.sidebarItem}
                  onPress={() => {
                    setIsViewModalSetting(false);
                    if (item.id === 'changePassword') {
                      router.push('/change-password');
                    } else if (item.id === 'notifications') {
                      router.push('/(tabs)/notifications');
                    }
                     else if (item.id === 'feedBack') {
                      router.push('/FeedBack');
                    }
                  }}
                >
                  <Ionicons name={item.icon as any} size={22} color={COLORS.primary} />
                  <Text style={[styles.sidebarItemText, { textTransform: 'capitalize' }]}>
                    {item.title}
                  </Text>
                </TouchableOpacity>
              )}
              

              contentContainerStyle={{ paddingHorizontal: 16 }}
            />

            <TouchableOpacity
              onPress={handleSignOut}
              style={styles.logoutButton}
            >
              <Ionicons name="log-out-outline" size={30} color="#FF3B30" />
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

function NoPostsFound() {
  return (
    <View style={styles.noPostsContainer}>
      <View style={styles.noPostsIconContainer}>
        <Ionicons name="camera-outline" size={48} color={COLORS.grey} />
      </View>
      
      <Text style={styles.noPostsTitle}>No Posts Yetmohasdf</Text>
      
      <Text style={styles.noPostsSubtitle}>When you share photos, they'll appear here</Text>
      <TouchableOpacity style={styles.createPostButton} onPress={()=>router.push('/(tabs)/create')}>
        <Text style={styles.createPostButtonText}>Share your first photo</Text>
      </TouchableOpacity>
    </View>
  );
}
/////////////////////////////////////////////////////////////////////////////
// import { BASE_URL } from "@/constants/Api";
// import { COLORS } from "@/constants/theme";
// import { useAuthStore } from "@/stores/authstore";
// import { styles } from "@/styles/profile.styles";
// import { Ionicons } from "@expo/vector-icons";
// import { Image } from "expo-image";
// import * as ImagePicker from "expo-image-picker";
// import { router } from "expo-router";
// import { useEffect, useState } from "react";
// import {
//   Alert,
//   FlatList,
//   Keyboard,
//   KeyboardAvoidingView,
//   Modal,
//   Platform,
//   RefreshControl,
//   ScrollView,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   TouchableWithoutFeedback,
//   View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// /* ================= TYPES ================= */

// interface User {
//   _id: string;
//   name: string;
//   email: string;
//   bio?: string;
//   avatar?: string;
//   avatarUrl?: string;
//   postsCount: number;
//   followers: string[];
//   following: string[];
// }

// interface Post {
//   _id: string;
//   image?: string;
//   images?: string[];
//   createdAt: string;
// }

// /* ================= COMPONENT ================= */

// export default function Profile() {
//   const { user, token, logout } = useAuthStore();

//   const [currentUser, setCurrentUser] = useState<User | null>(null);
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [selectedPost, setSelectedPost] = useState<Post | null>(null);

//   const [isEditModalVisible, setIsEditModalVisible] = useState(false);
//   const [isViewModalSetting, setIsViewModalSetting] = useState(false);
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const [newAvatar, setNewAvatar] = useState<any>(null);
//   const [editedProfile, setEditedProfile] = useState({
//     name: "",
//     email: "",
//     bio: "",
//   });

//   /* ================= FETCH PROFILE ================= */

//   const fetchUserProfile = async () => {
//     try {
//       if (!token || !user?.id) return;

//       setIsRefreshing(true);

//       const response = await fetch(
//         `${BASE_URL}/api/auth/getUserProfile/${user.id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const result = await response.json();
//       if (!result.success) throw new Error(result.message);

// const normalizePath = (path: string) => path.replace(/\\/g, '/');



//       setCurrentUser({
//         ...result.user,
// avatarUrl: result.user.avatar 
//   ? `${BASE_URL}/${normalizePath(result.user.avatar)}`
//   : undefined,
//       });

//       setPosts(result.posts);

//       setEditedProfile({
//         name: result.user.name,
//         email: result.user.email,
//         bio: result.user.bio || "",
//       });
//     } catch (e: any) {
//       Alert.alert("Error", e.message);
//     } finally {
//       setIsRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     fetchUserProfile();
//   }, [token]);

//   /* ================= IMAGE PICK ================= */

//   const pickImage = async () => {
//     const permission =
//       await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (!permission.granted) return;

//     const result = await ImagePicker.launchImageLibraryAsync({
//       allowsEditing: true,
//       aspect: [1, 1],
//       quality: 0.8,
//     });

//     if (!result.canceled) {
//       setNewAvatar(result.assets[0]);
//     }
//   };

//   /* ================= SAVE PROFILE ================= */

//   const handleSaveProfile = async () => {
//     try {
//       if (!token) return;

//       setIsLoading(true);

//       const formData = new FormData();
//       formData.append("name", editedProfile.name);
//       formData.append("email", editedProfile.email);
//       formData.append("bio", editedProfile.bio);

//       if (newAvatar) {
//         formData.append("avatar", {
//           uri: newAvatar.uri,
//           name: "avatar.jpg",
//           type: "image/jpeg",
//         } as any);
//       }

//       const response = await fetch(`${BASE_URL}/api/auth/userMe`, {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       });

//       const result = await response.json();
//       if (!result.success) throw new Error(result.message);

//       setCurrentUser((prev) =>
//         prev
//           ? {
//               ...prev,
//               ...result.user,
//               avatarUrl: result.user.avatar
//                 ? `${BASE_URL}/${result.user.avatar.replace(/\\/g, "/")}`
//                 : prev.avatarUrl,
//             }
//           : null
//       );

//       setIsEditModalVisible(false);
//       setNewAvatar(null);
//     } catch (e: any) {
//       Alert.alert("Error", e.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (!currentUser) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <Text>Loading...</Text>
//       </SafeAreaView>
//     );
//   }

//   /* ================= UI ================= */

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* HEADER */}
//       <View style={styles.header}>
//         <Text style={styles.username}>{currentUser.name}</Text>
//         <TouchableOpacity onPress={() => setIsViewModalSetting(true)}>
//           <Ionicons name="settings-outline" size={24} />
//         </TouchableOpacity>
//       </View>

//       <ScrollView
//         refreshControl={
//           <RefreshControl
//             refreshing={isRefreshing}
//             onRefresh={fetchUserProfile}
//             colors={[COLORS.primary]}
//           />
//         }
//       >
//         {/* PROFILE INFO */}
//         <View style={styles.profileInfo}>
//           <Image
//             source={
//               currentUser.avatarUrl
//                 ? { uri: currentUser.avatarUrl }
//                 : require("@/assets/images/logo.png")
//             }
//             style={styles.avatar}
//             contentFit="cover"
//           />

//           <View style={styles.statsContainer}>
//             <View style={styles.statItem}>
//               <Text style={styles.statNumber}>
//                 {currentUser.postsCount}
//               </Text>
//               <Text style={styles.statLabel}>Posts</Text>
//             </View>

//             <View style={styles.statItem}>
//               <Text style={styles.statNumber}>
//                 {currentUser.followers.length}
//               </Text>
//               <Text style={styles.statLabel}>Followers</Text>
//             </View>

//             <View style={styles.statItem}>
//               <Text style={styles.statNumber}>
//                 {currentUser.following.length}
//               </Text>
//               <Text style={styles.statLabel}>Following</Text>
//             </View>
//           </View>

//           <Text style={styles.name}>{currentUser.name}</Text>
//           <Text style={styles.bio}>
//             {currentUser.bio || "No bio yet"}
//           </Text>

//           <TouchableOpacity
//             style={styles.editButton}
//             onPress={() => setIsEditModalVisible(true)}
//           >
//             <Text style={styles.editButtonText}>Edit Profile</Text>
//           </TouchableOpacity>
//         </View>

//         {/* POSTS */}
//         {posts.length === 0 ? (
//           <NoPostsFound />
//         ) : (
//           <FlatList
//             data={posts}
//             numColumns={3}
//             scrollEnabled={false}
//             keyExtractor={(item) => item._id}
//             renderItem={({ item }) => (
//               <TouchableOpacity
//                 style={styles.gridItem}
//                 onPress={() => setSelectedPost(item)}
//               >
//                 <Image
//                   source={{
//                     uri: `${BASE_URL}${item.image}`,
//                   }}
//                   style={styles.gridImage}
//                   contentFit="cover"
//                 />
//               </TouchableOpacity>
//             )}
//           />
//         )}
//       </ScrollView>

//       {/* EDIT MODAL */}
//       <Modal visible={isEditModalVisible} transparent>
//         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//           <KeyboardAvoidingView
//             behavior={Platform.OS === "ios" ? "padding" : "height"}
//             style={styles.modalContainer}
//           >
//             <View style={styles.modalContent}>
//               <TextInput
//                 value={editedProfile.name}
//                 onChangeText={(t) =>
//                   setEditedProfile({ ...editedProfile, name: t })
//                 }
//                 style={styles.input}
//                 placeholder="Name"
//               />

//               <TextInput
//                 value={editedProfile.bio}
//                 onChangeText={(t) =>
//                   setEditedProfile({ ...editedProfile, bio: t })
//                 }
//                 style={styles.input}
//                 placeholder="Bio"
//               />

//               <TouchableOpacity onPress={pickImage}>
//                 <Text>Select Avatar</Text>
//               </TouchableOpacity>

//               <TouchableOpacity onPress={handleSaveProfile}>
//                 <Text>Save</Text>
//               </TouchableOpacity>
//             </View>
//           </KeyboardAvoidingView>
//         </TouchableWithoutFeedback>
//       </Modal>

//       {/* POST MODAL */}
//       <Modal visible={!!selectedPost} transparent>
//         <TouchableOpacity
//           style={styles.modalBackdrop}
//           onPress={() => setSelectedPost(null)}
//         >
//           {selectedPost && (
//             <Image
//               source={{
//                 uri: `${BASE_URL}${selectedPost.image}`,
//               }}
//               style={styles.postDetailImage}
//               contentFit="contain"
//             />
//           )}
//         </TouchableOpacity>
//       </Modal>

//       {/* SETTINGS */}
//       <Modal visible={isViewModalSetting} transparent>
//         <TouchableOpacity
//           style={styles.modalOverlay}
//           onPress={() => setIsViewModalSetting(false)}
//         >
//           <TouchableOpacity
//             style={styles.logoutButton}
//             onPress={logout}
//           >
//             <Text>Logout</Text>
//           </TouchableOpacity>
//         </TouchableOpacity>
//       </Modal>
//     </SafeAreaView>
//   );
// }

// /* ================= EMPTY POSTS ================= */

// function NoPostsFound() {
//   return (
//     <View style={styles.noPostsContainer}>
//       <Ionicons name="images-outline" size={48} color={COLORS.grey} />
//       <Text>No posts yet</Text>
//     </View>
//   );
// }

//////////////////////////////////////////////////////////////////////////////
// import { BASE_URL } from "@/constants/Api";
// import { COLORS } from "@/constants/theme";
// import { useAuthStore } from "@/stores/authstore";
// import { styles } from "@/styles/profile.styles";
// import { Ionicons } from "@expo/vector-icons";
// import { Image } from "expo-image";
// import { useEffect, useState } from "react";
// import {
//   Alert,
//   FlatList,
//   RefreshControl,
//   ScrollView,
//   Text,
//   TouchableOpacity,
//   View,
//   SafeAreaView,
// } from "react-native";

// // Post type
// interface Post {
//   id: string;
//   imageUrl: string;
//   title?: string;
//   content?: string;
//   likes?: number;
//   comments?: number;
//   timestamp?: string;
// }

// export default function Profile() {
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [selectedPost, setSelectedPost] = useState<Post | null>(null);
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const { user, token } = useAuthStore();

//   // Fetch user posts only
//   const fetchUserPosts = async () => {
//     try {
//       if (!token) return;
//       setIsRefreshing(true);

//       const apiUrl = `${BASE_URL}/api/auth/getUserProfile/${user?.id}`;
//       const response = await fetch(apiUrl, {
//         method: "GET",
//         headers: {
//           "Authorization": `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Failed to fetch data: ${response.status}`);
//       }

//       const result = await response.json();
//       if (result.success && result.posts) {
//         const formattedPosts = result.posts.map((p: any) => ({
//           id: p._id,
//           title: p.title,
//           content: p.content,
//           imageUrl: `${BASE_URL}${p.image.replace("\\", "/")}`,
//         }));
//         setPosts(formattedPosts);
//       } else {
//         throw new Error(result.message || "Failed to fetch posts");
//       }
//     } catch (error: any) {
//       console.error("Error fetching posts:", error);
//       Alert.alert("Error", error.message || "An error occurred while fetching posts");
//     } finally {
//       setIsRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     fetchUserPosts();
//   }, [token]);

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView
//         refreshControl={
//           <RefreshControl
//             refreshing={isRefreshing}
//             onRefresh={fetchUserPosts}
//             colors={[COLORS.primary]}
//           />
//         }
//       >
//         {posts.length === 0 ? (
//           <NoPostsFound />
//         ) : (
//           <FlatList
//             data={posts}
//             numColumns={3}
//             scrollEnabled={false}
//             renderItem={({ item }) => (
//               <TouchableOpacity style={styles.gridItem} onPress={() => setSelectedPost(item)}>
//                 <Image
//                   source={{ uri: item.imageUrl }}
//                   style={styles.gridImage}
//                   contentFit="cover"
//                   transition={200}
//                 />
//               </TouchableOpacity>
//             )}
//             keyExtractor={(item) => item.id}
//           />
//         )}
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// function NoPostsFound() {
//   return (
//     <View style={styles.noPostsContainer}>
//       <Ionicons name="images-outline" size={48} color={COLORS.grey} />
//       <Text style={styles.noPostsText}>No posts yet</Text>
//     </View>
//   );
// }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// import { BASE_URL } from "@/constants/Api";
// import { COLORS } from "@/constants/theme";
// import { useAuthStore } from "@/stores/authstore";
// import { styles } from "@/styles/profile.styles";
// import { Ionicons } from "@expo/vector-icons";
// import { Image } from "expo-image";
// import * as ImagePicker from 'expo-image-picker';
// import { router } from "expo-router";
// import { useEffect, useState } from "react";
// import {
//   Alert,
//   FlatList,
//   Keyboard,
//   KeyboardAvoidingView,
//   Modal,
//   Platform,
//   RefreshControl,
//   ScrollView,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   TouchableWithoutFeedback,
//   View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// // User data type
// interface User {
//   id: string;
//   name: string;
//   email: string;
//   bio?: string;
//   avatarUrl?: string;
//   posts: number;
//   followers: number;
//   following: number;
// }

// interface Post {
//   id: string;
//   imageUrl: string;
//   title: string;
//   likes: number;
//   content: number;
//   timestamp: string;
// }

// export default function Profile() {
//   const [isEditModalVisible, setIsEditModalVisible] = useState(false);
//   const [isViewModalSetting, setIsViewModalSetting] = useState(false);
//   const [currentUser, setCurrentUser] = useState<User | null>(null);
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [selectedPost, setSelectedPost] = useState<Post | null>(null);
//   const [newAvatar, setNewAvatar] = useState<any>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const { logout, user, token } = useAuthStore();
//   const [editedProfile, setEditedProfile] = useState({
//     name: "",
//     email: "",
//     bio: "",
//   });

//   // Fetch user profile and posts from server in one call
//   const fetchUserProfile = async () => {
//     try {
//       if (!token || !user?.id) {
//         console.log('No token or user ID available');
//         return;
//       }
//       setIsRefreshing(true);
//       const apiUrl = `${BASE_URL}/api/auth/getUserProfile/${user.id}`;
//       const response = await fetch(apiUrl, {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Failed to fetch data: ${response.status}`);
//       }

//       const result = await response.json();
//       if (result.success && result.user) {
//         const fetchedUser = result.user;

//         // Compute counts
//         const followersCount = Array.isArray(fetchedUser.followers) ? fetchedUser.followers.length : 0;
//         const followingCount = Array.isArray(fetchedUser.following) ? fetchedUser.following.length : 0;
//         const postsCount = Array.isArray(result.posts) ? result.posts.length : 0;

//         // Fix avatar path
//         const avatarUrl = fetchedUser.avatar
//           ? `${BASE_URL}/${fetchedUser.avatar.replace(/\\/g, '/')}`
//           : null;

//         // Map posts
//         const mappedPosts: Post[] = (result.posts || []).map((post: any) => ({
//           id: post._id,
//           imageUrl: post.image ? `${BASE_URL}/${post.image.replace(/\\/g, '/')}` : '',
//           caption: post.content || post.title || '',
//           likes: Array.isArray(post.likes) ? post.likes.length : 0,
//           comments: 0, // not in your schema yet
//           timestamp: post.createdAt,
//         }));

//         setCurrentUser({
//           id: fetchedUser._id,
//           name: fetchedUser.name,
//           email: fetchedUser.email,
//           bio: fetchedUser.bio || '',
//           avatarUrl: fetchedUser.avatarUrl,
//           posts: postsCount,
//           followers: followersCount,
//           following: followingCount,
//         });

//         setEditedProfile({
//           name: fetchedUser.name,
//           email: fetchedUser.email,
//           bio: fetchedUser.bio || '',
//         });

//         setPosts(mappedPosts);
//       } else {
//         throw new Error(result.message || "Failed to fetch user data");
//       }
//     } catch (error: any) {
//       console.error("Error fetching user profile:", error);
//       if (error.message.includes('Network request failed')) {
//         Alert.alert(
//           "Connection Error",
//           "Unable to connect to server. Please check your internet connection and try again."
//         );
//       } else {
//         Alert.alert("Error", error.message || "An error occurred while fetching data");
//       }
//     } finally {
//       setIsRefreshing(false);
//       setIsLoading(false);
//     }
//   };

//   // Image picking functions (unchanged)
//   const pickImage = async () => {
//     try {
//       const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
//       if (!permissionResult.granted) {
//         Alert.alert("Permission Required", "We need access to your gallery to change the photo!");
//         return;
//       }
//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [1, 1],
//         quality: 0.8,
//       });
//       if (!result.canceled && result.assets && result.assets[0]) {
//         setNewAvatar(result.assets[0]);
//       }
//     } catch (error) {
//       console.error("Error picking image:", error);
//       Alert.alert("Error", "Failed to select image");
//     }
//   };

//   const takePhoto = async () => {
//     try {
//       const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
//       if (!permissionResult.granted) {
//         Alert.alert("Permission Required", "We need camera permission to take a photo!");
//         return;
//       }
//       const result = await ImagePicker.launchCameraAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [1, 1],
//         quality: 0.8,
//       });
//       if (!result.canceled && result.assets && result.assets[0]) {
//         setNewAvatar(result.assets[0]);
//       }
//     } catch (error) {
//       console.error("Error taking photo:", error);
//       Alert.alert("Error", "Failed to take photo");
//     }
//   };

//   const removeSelectedImage = () => {
//     setNewAvatar(null);
//   };

//   // Save profile changes
//   const handleSaveProfile = async () => {
//     try {
//       if (!token) {
//         Alert.alert("Error", "You must login first");
//         return;
//       }
//       setIsLoading(true);
//       const formData = new FormData();
//       formData.append('name', editedProfile.name.trim());
//       formData.append('email', editedProfile.email.trim());
//       formData.append('bio', editedProfile.bio?.trim() || '');

//       if (newAvatar) {
//         const uri = newAvatar.uri;
//         const filename = uri.split('/').pop() || `avatar-${Date.now()}.jpg`;
//         const extension = filename.split('.').pop()?.toLowerCase();
//         let mimeType = 'image/jpeg';
//         if (extension === 'png') mimeType = 'image/png';
//         else if (extension === 'jpg' || extension === 'jpeg') mimeType = 'image/jpeg';

//         formData.append('avatar', {
//           uri,
//           name: filename,
//           type: mimeType,
//         } as any);
//       }

//       const apiUrl = `${BASE_URL}/api/auth/userMe`;
//       const response = await fetch(apiUrl, {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//         body: formData,
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Update failed: ${response.status}`);
//       }

//       const result = await response.json();
//       if (result.success && result.user) {
//         const updatedAvatarUrl = result.user.avatar
//           ? `${BASE_URL}/${result.user.avatar.replace(/\\/g, '/')}`
//           : null;

//         setCurrentUser((prev: any) => prev ? {
//           ...prev,
//           name: result.user.name,
//           email: result.user.email,
//           bio: result.user.bio || '',
//           avatarUrl: updatedAvatarUrl,
//         } : null);

//         setNewAvatar(null);
//         setIsEditModalVisible(false);
//         Alert.alert("Success", "Profile updated successfully");
//       } else {
//         Alert.alert("Error", result.message || "Failed to update profile");
//       }
//     } catch (error: any) {
//       console.error("Error in handleSaveProfile:", error);
//       if (error.message.includes('Network request failed')) {
//         Alert.alert(
//           "Network Error",
//           "Please check:\n• Internet connection\n• Server status\n• Image size is less than 5MB"
//         );
//       } else {
//         Alert.alert("Error", error.message || "An error occurred during update");
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSignOut = () => {
//     logout();
//   };

//   // Fetch data on mount
//   useEffect(() => {
//     if (token && user?.id) {
//       fetchUserProfile();
//     }
//   }, [token, user?.id]);

//   // Error & loading UI
//   if (!currentUser) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <View style={styles.errorContainer}>
//           <Ionicons name="alert-circle-outline" size={64} color={COLORS.error} />
//           <Text style={styles.errorText}>Failed to load data</Text>
//           <TouchableOpacity style={styles.retryButton} onPress={fetchUserProfile}>
//             <Text style={styles.retryButtonText}>Try Again</Text>
//           </TouchableOpacity>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* HEADER */}
//       <View style={styles.header}>
//         <View style={styles.headerLeft}>
//           <Text style={styles.username}>{currentUser.name}</Text>
//         </View>
//         <View style={styles.headerRight}>
//           <TouchableOpacity
//             style={styles.headerIcon}
//             onPress={() => setIsViewModalSetting(true)}
//           >
//             <Ionicons name="settings-outline" size={24} color={'black'} />
//           </TouchableOpacity>
//         </View>
//       </View>

//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl
//             refreshing={isRefreshing}
//             onRefresh={fetchUserProfile}
//             colors={[COLORS.primary]}
//           />
//         }
//       >
//         <View style={styles.profileInfo}>
//           {/* AVATAR & STATS */}
//           <View style={styles.avatarAndStats}>
//             <View style={styles.avatarContainer}>
//               <Image
//                 source={currentUser.avatarUrl ? { uri: currentUser.avatarUrl } : require('@/assets/images/logo.png')}
//                 style={styles.avatar}
//                 contentFit="cover"
//                 transition={200}
//               />
//               {isLoading && (
//                 <View style={styles.loadingOverlay}>
//                   <Ionicons name="refresh" size={20} color={"white"} />
//                 </View>
//               )}
//             </View>
//             <View style={styles.statsContainer}>
//               <View style={styles.statItem}>
//                 <Text style={styles.statNumber}>{currentUser.posts}</Text>
//                 <Text style={styles.statLabel}>Posts</Text>
//               </View>
//               <View style={styles.statItem}>
//                 <Text style={styles.statNumber}>{currentUser.followers}</Text>
//                 <Text style={styles.statLabel}>Followers</Text>
//               </View>
//               <View style={styles.statItem}>
//                 <Text style={styles.statNumber}>{currentUser.following}</Text>
//                 <Text style={styles.statLabel}>Following</Text>
//               </View>
//             </View>
//           </View>

//           {/* Name and Bio */}
//           <Text style={styles.name}>{currentUser.name}</Text>
//           {currentUser.bio ? (
//             <Text style={styles.bio}>{currentUser.bio}</Text>
//           ) : (
//             <Text style={styles.noBio}>No bio yet</Text>
//           )}

//           <View style={styles.actionButtons}>
//             <TouchableOpacity
//               style={[styles.editButton, isLoading && styles.disabledButton]}
//               onPress={() => setIsEditModalVisible(true)}
//               disabled={isLoading}
//             >
//               <Text style={styles.editButtonText}>
//                 {isLoading ? "Loading..." : "Edit Profile"}
//               </Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.shareButton}>
//               <Ionicons name="share-outline" size={20} color={'white'} />
//             </TouchableOpacity>
//           </View>
//         </View>

//         {posts.length === 0 ? (
//           <NoPostsFound />
//         ) : (
//           <FlatList
//             data={posts}
//             numColumns={3}
//             scrollEnabled={false}
//             renderItem={({ item }) => (
//               <TouchableOpacity style={styles.gridItem} onPress={() => setSelectedPost(item)}>
//                 <Image
//                   source={{ uri: item.imageUrl || require('@/assets/images/logo.png') }}
//                   style={styles.gridImage}
//                   contentFit="cover"
//                   transition={200}
//                 />
//               </TouchableOpacity>
//             )}
//             keyExtractor={(item) => item.id}
//           />
//         )}
//       </ScrollView>

//       {/* EDIT PROFILE MODAL */}
//       <Modal
//         visible={isEditModalVisible}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => !isLoading && setIsEditModalVisible(false)}
//       >
//         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//           <KeyboardAvoidingView
//             behavior={Platform.OS === "ios" ? "padding" : "height"}
//             style={styles.modalContainer}
//           >
//             <ScrollView style={styles.modalContent}>
//               <View style={styles.modalHeader}>
//                 <Text style={styles.modalTitle}>Edit Profile</Text>
//                 <TouchableOpacity
//                   onPress={() => !isLoading && setIsEditModalVisible(false)}
//                   disabled={isLoading}
//                 >
//                   <Ionicons name="close" size={24} color={'black'} />
//                 </TouchableOpacity>
//               </View>

//               <View style={[styles.inputContainer, { flexDirection: 'row', justifyContent: 'center' }]}>
//                 <View style={styles.avatarEditContainer}>
//                   <Image
//                     source={
//                       newAvatar
//                         ? { uri: newAvatar.uri }
//                         : currentUser.avatarUrl
//                           ? { uri: currentUser.avatarUrl }
//                           : require('@/assets/images/logo.png')
//                     }
//                     style={[styles.avatar, { width: 120, height: 120 }]}
//                     contentFit="cover"
//                     transition={200}
//                   />
//                   <View style={styles.avatarActions}>
//                     <TouchableOpacity
//                       style={[styles.avatarButton, isLoading && styles.disabledButton]}
//                       onPress={pickImage}
//                       disabled={isLoading}
//                     >
//                       <Ionicons name="image-outline" size={20} color={'white'} />
//                       <Text style={styles.avatarButtonText}>Gallery</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity
//                       style={[styles.avatarButton, isLoading && styles.disabledButton]}
//                       onPress={takePhoto}
//                       disabled={isLoading}
//                     >
//                       <Ionicons name="camera-outline" size={20} color={'white'} />
//                       <Text style={styles.avatarButtonText}>Camera</Text>
//                     </TouchableOpacity>
//                     {newAvatar && (
//                       <TouchableOpacity
//                         style={[styles.avatarButton, { backgroundColor: '#FF3B30' }, isLoading && styles.disabledButton]}
//                         onPress={removeSelectedImage}
//                         disabled={isLoading}
//                       >
//                         <Ionicons name="trash-outline" size={20} color={'white'} />
//                         <Text style={styles.avatarButtonText}>Remove</Text>
//                       </TouchableOpacity>
//                     )}
//                   </View>
//                 </View>
//               </View>

//               <View style={styles.inputContainer}>
//                 <Text style={styles.inputLabel}>Name</Text>
//                 <TextInput
//                   style={styles.input}
//                   value={editedProfile.name}
//                   onChangeText={(text) => setEditedProfile({ ...editedProfile, name: text })}
//                   placeholderTextColor={COLORS.grey}
//                   editable={!isLoading}
//                 />
//               </View>
//               <View style={styles.inputContainer}>
//                 <Text style={styles.inputLabel}>Email</Text>
//                 <TextInput
//                   style={styles.input}
//                   value={editedProfile.email}
//                   onChangeText={(text) => setEditedProfile({ ...editedProfile, email: text })}
//                   placeholderTextColor={COLORS.grey}
//                   keyboardType="email-address"
//                   autoCapitalize="none"
//                   editable={!isLoading}
//                 />
//               </View>
//               <View style={styles.inputContainer}>
//                 <Text style={styles.inputLabel}>Bio</Text>
//                 <TextInput
//                   style={[styles.input, styles.bioInput]}
//                   value={editedProfile.bio}
//                   onChangeText={(text) => setEditedProfile({ ...editedProfile, bio: text })}
//                   multiline
//                   numberOfLines={4}
//                   placeholderTextColor={COLORS.grey}
//                   placeholder="Tell us about yourself..."
//                   editable={!isLoading}
//                 />
//               </View>

//               <TouchableOpacity
//                 style={[styles.saveButton, isLoading && styles.disabledButton]}
//                 onPress={handleSaveProfile}
//                 disabled={isLoading}
//               >
//                 <Text style={styles.saveButtonText}>
//                   {isLoading ? "Saving..." : "Save Changes"}
//                 </Text>
//               </TouchableOpacity>
//             </ScrollView>
//           </KeyboardAvoidingView>
//         </TouchableWithoutFeedback>
//       </Modal>

//       {/* Post Detail Modal */}
//       <Modal
//         visible={!!selectedPost}
//         animationType="fade"
//         transparent={true}
//         onRequestClose={() => setSelectedPost(null)}
//       >
//         <View style={styles.modalBackdrop}>
//           {selectedPost && (
//             <View style={styles.postDetailContainer}>
//               <View style={styles.postDetailHeader}>
//                 <TouchableOpacity onPress={() => setSelectedPost(null)}>
//                   <Ionicons name="close" size={24} color={'white'} />
//                 </TouchableOpacity>
//               </View>
//               <Image
//                 source={{ uri: selectedPost.imageUrl }}
//                 cachePolicy="memory-disk"
//                 style={styles.postDetailImage}
//               />
//             </View>
//           )}
//         </View>
//       </Modal>

//       {/* Settings Modal */}
//       <Modal
//         visible={isViewModalSetting}
//         animationType="none"
//         transparent={true}
//         onRequestClose={() => setIsViewModalSetting(false)}
//       >
//         <TouchableOpacity
//           style={styles.modalOverlay}
//           activeOpacity={1}
//           onPress={() => setIsViewModalSetting(false)}
//         >
//           <View
//             style={styles.settingsSidebar}
//             onStartShouldSetResponder={() => true}
//             onTouchEnd={(e) => e.stopPropagation()}
//           >
//             <View style={styles.sidebarHeader}>
//               <Text style={styles.sidebarTitle}>Setting</Text>
//               <TouchableOpacity
//                 onPress={() => setIsViewModalSetting(false)}
//                 style={styles.closeButton}
//               >
//                 <Ionicons name="close" size={24} color="white" />
//               </TouchableOpacity>
//             </View>

//             <FlatList
//               data={[
//                 { id: 'notifications', title: 'Notifications', icon: 'notifications-outline' },
//                 { id: 'help', title: 'Help', icon: 'help-circle-outline' },
//                 { id: 'language', title: 'Language', icon: 'language-outline' },
//                 { id: 'changePassword', title: 'Change Password', icon: 'lock-closed-outline' },
//               ]}
//               keyExtractor={(item) => item.id}
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                   style={styles.sidebarItem}
//                   onPress={() => {
//                     setIsViewModalSetting(false);
//                     if (item.id === 'changePassword') {
//                       router.push('/change-password');
//                     } else if (item.id === 'notifications') {
//                       router.push('/(tabs)/notifications');
//                     }
//                   }}
//                 >
//                   <Ionicons name={item.icon as any} size={22} color="white" />
//                   <Text style={[styles.sidebarItemText, { textTransform: 'capitalize' }]}>
//                     {item.title}
//                   </Text>
//                 </TouchableOpacity>
//               )}
//               contentContainerStyle={{ paddingHorizontal: 16 }}
//             />

//             <TouchableOpacity
//               onPress={handleSignOut}
//               style={styles.logoutButton}
//             >
//               <Ionicons name="log-out-outline" size={30} color="white" />
//               <Text style={styles.logoutButtonText}>Logout</Text>
//             </TouchableOpacity>
//           </View>
//         </TouchableOpacity>
//       </Modal>
//     </SafeAreaView>
//   );
// }

// function NoPostsFound() {
//   return (
//     <View style={styles.noPostsContainer}>
//       <Ionicons name="images-outline" size={48} color={COLORS.grey} />
//       <Text style={styles.noPostsText}>No posts yet</Text>
//     </View>
//   );
// }
/////////////////////////////////////////////////////////////////////////////////////////////////////////
// import { BASE_URL } from "@/constants/Api";
// import { COLORS } from "@/constants/theme";
// import { useAuthStore } from "@/stores/authstore";
// import { styles } from "@/styles/profile.styles";
// import { Ionicons } from "@expo/vector-icons";
// import { Image } from "expo-image";
// import * as ImagePicker from "expo-image-picker";
// import { router } from "expo-router";
// import { useEffect, useState } from "react";
// import {
//   Alert,
//   FlatList,
//   Keyboard,
//   KeyboardAvoidingView,
//   Modal,
//   Platform,
//   RefreshControl,
//   ScrollView,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   TouchableWithoutFeedback,
//   View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// /* ================= TYPES ================= */

// interface User {
//   _id: string;
//   name: string;
//   email: string;
//   bio?: string;
//   avatar?: string;
//   postsCount: number;
//   followers: string[];
//   following: string[];
// }

// interface Post {
//   _id: string;
//   image?: string;
//   images?: string[];
//   createdAt: string;
// }

// /* ================= COMPONENT ================= */

// export default function Profile() {
//   const { user, token, logout } = useAuthStore();

//   const [currentUser, setCurrentUser] = useState<User | null>(null);
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [selectedPost, setSelectedPost] = useState<Post | null>(null);

//   const [isEditModalVisible, setIsEditModalVisible] = useState(false);
//   const [isViewModalSetting, setIsViewModalSetting] = useState(false);
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const [newAvatar, setNewAvatar] = useState<any>(null);
//   const [editedProfile, setEditedProfile] = useState({
//     name: "",
//     email: "",
//     bio: "",
//   });

//   /* ================= FETCH PROFILE ================= */

//   const fetchUserProfile = async () => {
//     try {
//       if (!token || !user?.id) return;

//       setIsRefreshing(true);

//       const response = await fetch(
//         `${BASE_URL}/api/auth/getUserProfile/${user.id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const result = await response.json();

//       if (!result.success) {
//         throw new Error(result.message);
//       }
//       setCurrentUser(result.user);
//       console.log(result.user);

//       setPosts(result.posts);

//       setEditedProfile({
//         name: result.user.name,
//         email: result.user.email,
//         bio: result.user.bio || "",
//       });
//     } catch (e: any) {
//       Alert.alert("Error", e.message);
//     } finally {
//       setIsRefreshing(false);
//     }
//   };
//   console.log(currentUser);
  

//   useEffect(() => {
//     fetchUserProfile();
//   }, [token]);

//   /* ================= IMAGE PICK ================= */

//   const pickImage = async () => {
//     const res = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (!res.granted) return;

//     const img = await ImagePicker.launchImageLibraryAsync({
//       allowsEditing: true,
//       aspect: [1, 1],
//       quality: 0.8,
//     });

//     if (!img.canceled) {
//       setNewAvatar(img.assets[0]);
//     }
//   };

//   /* ================= SAVE PROFILE ================= */

//   const handleSaveProfile = async () => {
//     try {
//       if (!token) return;

//       setIsLoading(true);

//       const formData = new FormData();
//       formData.append("name", editedProfile.name);
//       formData.append("email", editedProfile.email);
//       formData.append("bio", editedProfile.bio);

//       if (newAvatar) {
//         formData.append("avatar", {
//           uri: newAvatar.uri,
//           name: "avatar.jpg",
//           type: "image/jpeg",
//         } as any);
//       }

//       const response = await fetch(`${BASE_URL}/api/auth/userMe`, {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       });

//       const result = await response.json();

//       if (!result.success) throw new Error(result.message);

//       setCurrentUser(result.user);
//       setIsEditModalVisible(false);
//       setNewAvatar(null);
//     } catch (e: any) {
//       Alert.alert("Error", e.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (!currentUser) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <Text>Loading...</Text>
//       </SafeAreaView>
//     );
//   }

//   /* ================= UI ================= */

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* HEADER */}
//       <View style={styles.header}>
//         <Text style={styles.username}>{currentUser.name}</Text>
//         <TouchableOpacity onPress={() => setIsViewModalSetting(true)}>
//           <Ionicons name="settings-outline" size={24} />
//         </TouchableOpacity>
//       </View>

//       <ScrollView
//         refreshControl={
//           <RefreshControl
//             refreshing={isRefreshing}
//             onRefresh={fetchUserProfile}
//             colors={[COLORS.primary]}
//           />
//         }
//       >
//         {/* PROFILE INFO */}
//         <View style={styles.profileInfo}>
//           <Image
//             source={
//               currentUser.avatar
//                 ? { uri: `${BASE_URL}/${currentUser.avatar}` }
//                 : require("@/assets/images/logo.png")
//             }
//             style={styles.avatar}
//           />

//           <View style={styles.statsContainer}>
//             <View style={styles.statItem}>
//               <Text style={styles.statNumber}>
//                 {currentUser.postsCount}
//               </Text>
//               <Text style={styles.statLabel}>Posts</Text>
//             </View>

//             <View style={styles.statItem}>
//               <Text style={styles.statNumber}>
//                 {currentUser.followers.length}
//               </Text>
//               <Text style={styles.statLabel}>Followers</Text>
//             </View>

//             <View style={styles.statItem}>
//               <Text style={styles.statNumber}>
//                 {currentUser.following.length}
//               </Text>
//               <Text style={styles.statLabel}>Following</Text>
//             </View>
//           </View>

//           <Text style={styles.name}>{currentUser.name}</Text>
//           <Text style={styles.bio}>
//             {currentUser.bio || "No bio yet"}
//           </Text>

//           <TouchableOpacity
//             style={styles.editButton}
//             onPress={() => setIsEditModalVisible(true)}
//           >
//             <Text style={styles.editButtonText}>Edit Profile</Text>
//           </TouchableOpacity>
//         </View>

//         {/* POSTS */}
//         {posts.length === 0 ? (
//           <NoPostsFound />
//         ) : (
//           <FlatList
//             data={posts}
//             numColumns={3}
//             scrollEnabled={false}
//             keyExtractor={(item) => item._id}
//             renderItem={({ item }) => (
//               <TouchableOpacity
//                 style={styles.gridItem}
//                 onPress={() => setSelectedPost(item)}
//               >
//                 <Image
//                   source={{
//                     uri: `${BASE_URL}${item.image}`,
//                   }}
//                   style={styles.gridImage}
//                 />
//               </TouchableOpacity>
//             )}
//           />
//         )}
//       </ScrollView>

//       {/* EDIT MODAL */}
//       <Modal visible={isEditModalVisible} transparent>
//         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//           <KeyboardAvoidingView
//             behavior={Platform.OS === "ios" ? "padding" : "height"}
//             style={styles.modalContainer}
//           >
//             <View style={styles.modalContent}>
//               <TextInput
//                 value={editedProfile.name}
//                 onChangeText={(t) =>
//                   setEditedProfile({ ...editedProfile, name: t })
//                 }
//                 style={styles.input}
//               />
//               <TextInput
//                 value={editedProfile.bio}
//                 onChangeText={(t) =>
//                   setEditedProfile({ ...editedProfile, bio: t })
//                 }
//                 style={styles.input}
//               />
//               <TouchableOpacity onPress={pickImage}>
//                 <Text>Select Avatar</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={handleSaveProfile}>
//                 <Text>Save</Text>
//               </TouchableOpacity>
//             </View>
//           </KeyboardAvoidingView>
//         </TouchableWithoutFeedback>
//       </Modal>

//       {/* POST MODAL */}
//       <Modal visible={!!selectedPost} transparent>
//         <TouchableOpacity
//           style={styles.modalBackdrop}
//           onPress={() => setSelectedPost(null)}
//         >
//           {selectedPost && (
//             <Image
//               source={{
//                 uri: `${BASE_URL}${selectedPost.image}`,
//               }}
//               style={styles.postDetailImage}
//             />
//           )}
//         </TouchableOpacity>
//       </Modal>

//       {/* SETTINGS */}
//       <Modal visible={isViewModalSetting} transparent>
//         <TouchableOpacity
//           style={styles.modalOverlay}
//           onPress={() => setIsViewModalSetting(false)}
//         >
//           <TouchableOpacity
//             style={styles.logoutButton}
//             onPress={logout}
//           >
//             <Text>Logout</Text>
//           </TouchableOpacity>
//         </TouchableOpacity>
//       </Modal>
//     </SafeAreaView>
//   );
// }

// /* ================= EMPTY POSTS ================= */

// function NoPostsFound() {
//   return (
//     <View style={styles.noPostsContainer}>
//       <Ionicons name="images-outline" size={48} color={COLORS.grey} />
//       <Text>No posts yet</Text>
//     </View>
//   );
// }
