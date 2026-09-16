
// import { Loader } from "@/components/Loader";
// import {
//   findUserById,
//   getUserPosts,
//   MOCK_USER,
//   type MockPost,
//   type MockUser
// } from "@/constants/mock-data";
// import { COLORS } from "@/constants/theme";
// import { styles } from "@/styles/profile.styles";
// import { Ionicons } from "@expo/vector-icons";
// import { Image } from "expo-image";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import { useEffect, useState } from "react";
// import { FlatList, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";

// export default function UserProfileScreen() {
//   const { id } = useLocalSearchParams();
//   const router = useRouter();
//   const [isFollowing, setIsFollowing] = useState(false);
//   const [profile, setProfile] = useState<MockUser | null>(null);
//   const [posts, setPosts] = useState<MockPost[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [followersCount, setFollowersCount] = useState(0);

//   useEffect(() => {
//     // محاكاة جلب البيانات
//     setTimeout(() => {
//       const user = findUserById(id as string);
//       const user1 = fetch("");

//       const userPosts = getUserPosts(id as string);

//       setProfile(user || null);
//       setPosts(userPosts);
//       setFollowersCount(user?.followers || 0);
//       setLoading(false);
//     }, 1000);
//   }, [id]);

//   const handleBack = () => {
//     if (router.canGoBack()) router.back();
//     else router.replace("/(tabs)");
//   };

//   const toggleFollow = () => {
//     const newIsFollowing = !isFollowing;
//     setIsFollowing(newIsFollowing);

//     // تحديث عدد المتابعين
//     setFollowersCount(prev => newIsFollowing ? prev + 1 : prev - 1);

//     // في التطبيق الحقيقي، هنا ستتم إضافة منطق المتابعة/إلغاء المتابعة إلى الخادم
//     console.log(`${newIsFollowing ? 'Following' : 'Unfollowing'} user:`, profile?.username);
//   };

//   const isCurrentUser = profile?._id === MOCK_USER._id;

//   if (loading) return <Loader />;
//   if (!profile) return <UserNotFound />;

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={handleBack}>
//           <Ionicons name="arrow-back" size={24} color={'white'} />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>{profile.username}</Text>
//         <View style={{ width: 24 }} />
//       </View>

//       <ScrollView showsVerticalScrollIndicator={false}>
//         <View style={styles.profileInfo}>
//           <View style={styles.avatarAndStats}>
//             {/* AVATAR */}
//             <Image
//               source={profile.image}
//               style={styles.avatar}
//               contentFit="cover"
//               cachePolicy="memory-disk"
//             />

//             {/* STATS */}
//             <View style={styles.statsContainer}>
//               <View style={styles.statItem}>
//                 <Text style={styles.statNumber}>{posts.length}</Text>
//                 <Text style={styles.statLabel}>Posts</Text>
//               </View>
//               <View style={styles.statItem}>
//                 <Text style={styles.statNumber}>{followersCount}</Text>
//                 <Text style={styles.statLabel}>Followers</Text>
//               </View>
//               <View style={styles.statItem}>
//                 <Text style={styles.statNumber}>{profile.following}</Text>
//                 <Text style={styles.statLabel}>Following</Text>
//               </View>
//             </View>
//           </View>

//           <Text style={styles.name}>{profile.fullname}</Text>
//           {profile.bio && <Text style={styles.bio}>{profile.bio}</Text>}

//           {isCurrentUser ? (
//             <Pressable
//               style={styles.editProfileButton}
//               onPress={() => router.push("/(tabs)/profile")}
//             >
//               <Text style={styles.editProfileButtonText}>Edit Profile</Text>
//             </Pressable>
//           ) : (
//             <Pressable
//               style={[styles.followButton, isFollowing && styles.followingButton]}
//               onPress={toggleFollow}
//             >
//               <Text style={[styles.followButtonText, isFollowing && styles.followingButtonText]}>
//                 {isFollowing ? "Following" : "Follow"}
//               </Text>
//             </Pressable>
//           )}
//         </View>

//         <View style={styles.postsGrid}>
//           {posts.length === 0 ? (
//             <View style={styles.noPostsContainer}>
//               <Ionicons name="images-outline" size={48} color={'gray'} />
//               <Text style={styles.noPostsText}>No posts yet</Text>
//             </View>
//           ) : (
//             <FlatList
//               data={posts}
//               numColumns={3}
//               scrollEnabled={false}
//               renderItem={({ item }) => (
//                 <TouchableOpacity style={styles.gridItem}>
//                   <Image
//                     source={item.imageUrl}
//                     style={styles.gridImage}
//                     contentFit="cover"
//                     transition={200}
//                     cachePolicy="memory-disk"
//                   />
//                 </TouchableOpacity>
//               )}
//               keyExtractor={(item) => item._id}
//             />
//           )}
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// function UserNotFound() {
//   const router = useRouter();

//   return (
//     <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => router.back()}>
//           <Ionicons name="arrow-back" size={24} color={'white'} />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>User</Text>
//         <View style={{ width: 24 }} />
//       </View>

//       <View style={{ alignItems: 'center' }}>
//         <Ionicons name="person-outline" size={64} color={'gray'} />
//         <Text style={{ color: 'white', fontSize: 18, marginTop: 16 }}>
//           User not found
//         </Text>
//         <TouchableOpacity
//           style={[styles.followButton, { marginTop: 16 }]}
//           onPress={() => router.replace('/(tabs)')}
//         >
//           <Text style={styles.followButtonText}>Go Home</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Modal,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { BASE_URL } from "@/constants/Api";
import { COLORS } from "@/constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "@/stores/authstore";

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user: currentUser } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [ImageProfile, setImageProile] = useState(false);

  // دالة لضمان تكوين رابط صحيح
  const makeUrl = (path: string) => {
    if (!path) return "";
    let cleanPath = path.replace(/\\/g, "/");
    if (cleanPath.startsWith("/")) cleanPath = cleanPath.substring(1);
    return `${BASE_URL}/${cleanPath}`;
  };

  useEffect(() => {
    fetch(`${BASE_URL}/api/auth/getUserProfile/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const user = {
            ...data.user,
            avatarUrl: makeUrl(data.user.avatar),
          };

          const userPosts = data.posts.map((p: any) => ({
            ...p,
            imageUrl: makeUrl(p.image),
          }));

          setProfile(user);
          setPosts(userPosts);
          setFollowersCount(data.user.followers?.length || 0);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)");
  };

  const toggleFollow = () => {
    const newState = !isFollowing;
    setIsFollowing(newState);
    setFollowersCount(prev => (newState ? prev + 1 : prev - 1));
  };

  // داخل render
  const canViewPosts = () => {
    if (!currentUser?.id) return false;
    if (currentUser.id === profile._id) return true;
    const isFollower = profile.followers?.some((f: string) => f === currentUser.id);
    const isFollowing = profile.following?.some((f: string) => f === currentUser.id);
    return isFollower || isFollowing;
  };
  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: COLORS.background }]}>
        <ActivityIndicator color={COLORS.primary} style={{ width: 30, height: 30 }}></ActivityIndicator>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={[styles.center, { backgroundColor: COLORS.background }]}>
        <Text style={{ color: COLORS.text }}>User not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: COLORS.text }]}>
          {profile.role == 'company' ? 'Company' : null}

          {profile.name}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* PROFILE */}
        <View style={styles.profileInfo}>
          <View style={styles.avatarAndStats}>
            {profile.avatarUrl ? (
              <TouchableOpacity onPress={() => setImageProile(true)}>
                <Image
                  source={{ uri: profile.avatarUrl }}
                  style={styles.avatar}
                  contentFit="cover"
                />
              </TouchableOpacity>
            ) : (
              <View
                style={[
                  styles.avatar,
                  { backgroundColor: COLORS.border, justifyContent: "center", alignItems: "center" },
                ]}
              >
                <Ionicons name="person" size={36} color={COLORS.grey} />
              </View>
            )}

            <View style={styles.statsContainer}>
              <Stat label="Posts" value={posts.length} />
              <Stat label="Followers" value={followersCount} />
              <Stat label="Following" value={profile.following?.length || 0} />
            </View>
          </View>

          <Text style={[styles.name, { color: COLORS.text }]}>{profile.name}</Text>
          {profile.bio && <Text style={[styles.bio, { color: COLORS.textLight }]}>{profile.bio}</Text>}

          <Pressable
            style={[
              styles.followButton,
              { backgroundColor: isFollowing ? COLORS.grey : COLORS.primary },
            ]}
            onPress={toggleFollow}
          >
            <Text
              style={[
                styles.followButtonText,
                { color: isFollowing ? COLORS.textLight : COLORS.white },
              ]}
            >
              {

                canViewPosts() ? "Following" : "Follow"
              }
            </Text>
          </Pressable>
        </View>

        {/* POSTS */}
        {/* <View style={styles.postsGrid}>

          {posts.length === 0 ? (
            <View style={styles.center}>
              <Ionicons name="images-outline" size={48} color={COLORS.grey} />
              <Text style={{ color: COLORS.grey, marginTop: 8 }}>No posts yet</Text>
            </View>
          ) : (
            <FlatList
              data={posts}
              numColumns={3}
              scrollEnabled={false}
              keyExtractor={item => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.gridItem}>
                  {item.imageUrl ? (
                    <Image
                      source={{ uri: item.imageUrl }}
                      style={styles.gridImage}
                      contentFit="cover"
                    />
                  ) : (
                    <View
                      style={[
                        styles.gridImage,
                        { backgroundColor: COLORS.border, justifyContent: "center", alignItems: "center" },
                      ]}
                    >
                      <Ionicons name="image" size={24} color={COLORS.grey} />
                    </View>
                  )}
                </TouchableOpacity>
              )}
            />
          )}

        </View> */}


        {canViewPosts() ? (
          <View style={styles.postsGrid}>
            {posts.length === 0 ? (
              <View style={styles.center}>
                <Ionicons name="images-outline" size={48} color={COLORS.grey} />
                <Text style={{ color: COLORS.grey, marginTop: 8 }}>No posts yet</Text>
              </View>
            ) : (
              <FlatList
                data={posts}
                numColumns={3}
                scrollEnabled={false}
                keyExtractor={item => item._id}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.gridItem}>
                    {item.imageUrl ? (
                      <Image
                        source={{ uri: item.imageUrl }}
                        style={styles.gridImage}
                        contentFit="cover"
                      />
                    ) : (
                      <View
                        style={[
                          styles.gridImage,
                          { backgroundColor: COLORS.border, justifyContent: "center", alignItems: "center" }
                        ]}
                      >
                        <Ionicons name="image" size={24} color={COLORS.grey} />
                      </View>
                    )}
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        ) : (
          <View style={styles.postsGrid}>
            <View style={styles.center}>
              <Ionicons name="lock-closed" size={48} color={COLORS.grey} />
              <Text style={{ color: COLORS.grey, marginTop: 8 }}>
                This content is private
              </Text>
            </View>
          </View>
        )}

      </ScrollView>
      <Modal
        visible={ImageProfile}
        animationType="fade"
        transparent={true}
      // onRequestClose={() => setImageProile(true)}
      >
        <View style={[styles.modalBackdrop, { padding: 10 }]}>
          <TouchableOpacity onPress={(perv) => setImageProile(!perv)} style={{ position: "absolute", left: 0, top: 0, padding: 20 }}>
            <Ionicons name="close" color={'white'} size={30} />
          </TouchableOpacity>
          {profile.avatarUrl ? (
            <Image
              source={{ uri: profile.avatarUrl }}
              style={[styles.avatar, { width: '100%', height: '50%' }]}
              contentFit="cover"
            />
          ) : (
            <View
              style={[
                styles.avatar,
                { backgroundColor: COLORS.border, justifyContent: "center", alignItems: "center" },
              ]}
            >
              <Ionicons name="person" size={36} color={COLORS.grey} />
            </View>
          )}

        </View>

      </Modal>
    </SafeAreaView>
  );
}

/* --------- SMALL COMPONENT --------- */
function Stat({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.statItem}>
      <Text style={[styles.statNumber, { color: COLORS.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: COLORS.textLight }]}>{label}</Text>
    </View>
  );
}

/* --------- STYLES --------- */
const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { height: 56, paddingHorizontal: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerTitle: { fontSize: 18, fontWeight: "600" },
  profileInfo: { padding: 16 },
  avatarAndStats: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 90, height: 90, borderRadius: 45 },
  statsContainer: { flex: 1, flexDirection: "row", justifyContent: "space-around" },
  statItem: { alignItems: "center" },
  statNumber: { fontSize: 16, fontWeight: "bold" },
  statLabel: { fontSize: 12 },
  name: { fontSize: 16, fontWeight: "600", marginTop: 12 },
  bio: { marginTop: 4 },
  followButton: { marginTop: 12, paddingVertical: 8, borderRadius: 6 },
  followButtonText: { textAlign: "center", fontWeight: "600" },
  postsGrid: { marginTop: 16 },
  gridItem: { flex: 1 / 3, aspectRatio: 1, margin: 1 },
  gridImage: { width: "100%", height: "100%", borderRadius: 4 },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
});
