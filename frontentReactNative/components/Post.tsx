
// import { COLORS } from "@/constants/theme";
// import { styles } from "@/styles/feed.styles";
// import { Ionicons } from "@expo/vector-icons";
// import { formatDistanceToNow } from "date-fns";
// import { Image } from "expo-image";
// import { useState, useEffect, useRef } from "react";
// import { Alert, Text, TouchableOpacity, View } from "react-native";
// import CommentsModal from "./CommentsModal";
// import { BASE_URL } from "@/constants/Api";
// import { useAuthStore } from "@/stores/authstore";
// import { Animated, Easing } from "react-native";
// import { router } from "expo-router";
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export type PostType = {
//   _id: string;
//   title: string;
//   content: string;
//   image: string;
//   imageUrl?: string;
//   likes: string[];
//   likesCount: number;
//   commentsCount?: number;
//   isLiked?: boolean;
//   createdAt: string;
//   user?: {
//     _id: string;
//     id?: string;
//     name: string;
//     avatarUrl?: string,
//     role?: string
//   };
//   company?: {
//     _id: string;
//     name: string;
//   }
// };

// type PostProps = {
//   post: PostType;
//   onPostUpdate?: (id: string, updates: Partial<PostType>) => void;
//   onPostDelete?: (id: string) => void
// };

// export default function Post({ post, onPostUpdate, onPostDelete }: PostProps) {
//   const scaleAnim = useRef(new Animated.Value(1)).current;

//   const { token, user } = useAuthStore();
//   const [isLiked, setIsLiked] = useState(false);
//   const [currentLikes, setCurrentLikes] = useState(0);
//   const [loadingLike, setLoadingLike] = useState(true);
//   const [showComments, setShowComments] = useState(false);

//   const imageUri = post.imageUrl || `${BASE_URL}${post.image}`;

//   // مفتاح لحفظ حالة الإعجاب في AsyncStorage
//   const LIKE_KEY = `post_${post._id}_liked_by_${user?.id || 'guest'}`;

//   // دالة للتحقق من حالة الإعجاب عند تحميل المنشور
//   const checkInitialLikeStatus = async () => {
//     if (!token || !user) {
//       // إذا لم يكن المستخدم مسجل الدخول، استخدم القيمة الافتراضية
//       setIsLiked(false);
//       setCurrentLikes(post.likesCount ?? post.likes.length);
//       setLoadingLike(false);
//       return;
//     }

//     try {
//       // 1. أولاً: التحقق من الخادم
//       const serverRes = await fetch(`${BASE_URL}/api/likes/${post._id}/check`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (serverRes.ok) {
//         const serverData = await serverRes.json();
//         setIsLiked(serverData.hasLiked);
//         setCurrentLikes(serverData.totalLikes);

//         // حفظ في AsyncStorage للاستخدام بدون إنترنت
//         await AsyncStorage.setItem(LIKE_KEY, JSON.stringify(serverData.hasLiked));
//       } else {
//         // إذا فشل طلب الخادم، استخدم البيانات المحلية
//         throw new Error("Server request failed");
//       }
//     } catch (serverError) {
//       console.log("Server check failed, trying local storage:", serverError);

//       // 2. إذا فشل الاتصال بالخادم، استخدم البيانات المحلية
//       try {
//         const localLike = await AsyncStorage.getItem(LIKE_KEY);
//         if (localLike !== null) {
//           setIsLiked(JSON.parse(localLike));
//         } else {
//           // استخدام القيمة الافتراضية من الـ post
//           setIsLiked(post.isLiked ?? false);
//         }
//       } catch (localError) {
//         console.log("Local storage error:", localError);
//         setIsLiked(post.isLiked ?? false);
//       }

//       // استخدام عدد الإعجابات من البيانات الأصلية
//       setCurrentLikes(post.likesCount ?? post.likes.length);
//     } finally {
//       setLoadingLike(false);
//     }
//   };

//   // تحميل حالة الإعجاب عند بدء التحميل
//   useEffect(() => {
//     checkInitialLikeStatus();
//   }, [post._id, token, user]);

//   const animateLike = () => {
//     Animated.sequence([
//       Animated.timing(scaleAnim, {
//         toValue: 1.3,
//         duration: 120,
//         easing: Easing.out(Easing.ease),
//         useNativeDriver: true,
//       }),
//       Animated.timing(scaleAnim, {
//         toValue: 1,
//         duration: 120,
//         useNativeDriver: true,
//       }),
//     ]).start();
//   };

//   const handleLike = async () => {
//     if (!token || !user) {
//       Alert.alert("Authentication required", "Please log in to like posts.");
//       return;
//     }

//     // حفظ الحالة السابقة للتراجع إذا فشل الطلب
//     const prevLiked = isLiked;
//     const prevLikes = currentLikes;

//     // تحديث واجهة المستخدم فوراً (Optimistic Update)
//     const newLikedState = !prevLiked;
//     setIsLiked(newLikedState);
//     setCurrentLikes(newLikedState ? prevLikes + 1 : prevLikes - 1);

//     // حفظ في AsyncStorage فوراً
//     await AsyncStorage.setItem(LIKE_KEY, JSON.stringify(newLikedState));

//     if (!prevLiked) animateLike();

//     try {
//       const res = await fetch(`${BASE_URL}/api/likes/${post._id}`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (!res.ok) {
//         const err = await res.json();
//         throw new Error(err.message);
//       }

//       const data = await res.json();

//       // تحديث الحالة مع البيانات من الخادم
//       setIsLiked(data.liked);
//       setCurrentLikes(data.likesCount);

//       // تحديث AsyncStorage بالبيانات الصحيحة من الخادم
//       await AsyncStorage.setItem(LIKE_KEY, JSON.stringify(data.liked));

//       // إعلام الـ parent component بالتحديث
//       onPostUpdate?.(post._id, {
//         isLiked: data.liked,
//         likesCount: data.likesCount,
//       });

//     } catch (error: any) {
//       // التراجع عن التغييرات إذا فشل الطلب
//       setIsLiked(prevLiked);
//       setCurrentLikes(prevLikes);
//       await AsyncStorage.setItem(LIKE_KEY, JSON.stringify(prevLiked));

//       Alert.alert("Error", error.message || "Failed to like post");
//     }
//   };

//   const handleDelete = () => {
//     Alert.alert(
//       "Delete Post",
//       "Are you sure you want to delete this post?",
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Delete",
//           style: "destructive",
//           onPress: async () => {
//             if (!token) return;

//             try {
//               const res = await fetch(`${BASE_URL}/api/posts/userpost/${post._id}`, {
//                 method: "DELETE",
//                 headers: {
//                   Authorization: `Bearer ${token}`,
//                 },
//               });

//               if (res.ok) {
//                 // ✅ Only call onPostDelete if the server confirms deletion
//                 onPostDelete?.(post._id);
//               } else {
//                 const errorData = await res.json();
//                 Alert.alert("Error", errorData.message || "Failed to delete post");
//               }
//             } catch (error) {
//               console.error("Delete error:", error);
//               Alert.alert("Error", "Unable to delete post. Please try again.");
//             }
//           },
//         },
//       ]
//     );
//   };

//   return (
//     <View style={styles.post}>
//       <View style={styles.postHeader}>
//         <TouchableOpacity
//           style={styles.postHeaderLeft}
//           onPress={() =>
//             router.push(
//               post.user?._id === user?.id
//                 ? '/(tabs)/profile'
//                 : `/user/${post.user?._id}`
//             )
//           }
//         >
//           {post.company ?
//             <Ionicons name="business" size={20} color={COLORS.primary} /> : null
//           }
//           <Image
//             source={{ uri: post.user?.avatarUrl || "https://via.placeholder.com/40" }}
//             style={styles.postAvatar}
//           />
//           <Text style={styles.postUsername}>{post.user?.name || post.company?.name || "User"}</Text>
//         </TouchableOpacity>

//         {user?.id === post.user?._id ?
//           <View style={{ flexDirection: 'row', justifyContent: "center", gap: 10 }}>
//             <TouchableOpacity onPress={handleDelete}>
//               <Ionicons name="trash-outline" size={20} color={'white'} style={{ backgroundColor: COLORS.error, padding: 1, borderRadius: 5 }} />
//             </TouchableOpacity>
//             <TouchableOpacity
//               onPress={() => {
//                 router.push({
//                   pathname: '/edit-post/[id]',
//                   params: { id: post._id },
//                 });
//               }}
//             >
//               <Ionicons name="create-outline" size={20} color={'white'} style={{ backgroundColor: COLORS.grey, padding: 1, borderRadius: 5 }} />
//             </TouchableOpacity>
//           </View>
//           :
//           null
//         }
//       </View>

//       <Image
//         source={{ uri: imageUri }}
//         style={styles.postImage}
//         contentFit="cover"
//         transition={200}
//       />

//       <View style={styles.postActions}>
//         <TouchableOpacity onPress={handleLike} disabled={loadingLike}>
//           <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
//             <Ionicons
//               name={isLiked ? "heart" : "heart-outline"}
//               size={24}
//               color={isLiked ? COLORS.primary : COLORS.white}
//             />
//           </Animated.View>
//         </TouchableOpacity>

//         <TouchableOpacity onPress={() => setShowComments(true)}>
//           <Ionicons name="chatbubble-outline" size={22} color={COLORS.white} />
//         </TouchableOpacity>
//       </View>

//       <View style={styles.postInfo}>
//         {loadingLike ? (
//           <Text style={styles.likesText}>Loading likes...</Text>
//         ) : (
//           <Text style={styles.likesText}>
//             {currentLikes > 0 ? `${currentLikes} likes` : "Be the first to like"}
//           </Text>
//         )}
//         <Text style={styles.captionText}>{post.content}</Text>
//         <Text style={styles.timeAgo}>
//           {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
//         </Text>
//       </View>

//       <CommentsModal
//         postId={post._id}
//         visible={showComments}
//         onClose={() => setShowComments(false)}
//       />
//     </View >
//   );
// }

import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/feed.styles";
import { Ionicons } from "@expo/vector-icons";
import { formatDistanceToNow } from "date-fns";
import { Image } from "expo-image";
import { useState, useEffect, useRef } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import CommentsModal from "./CommentsModal";
import { BASE_URL } from "@/constants/Api";
import { useAuthStore } from "@/stores/authstore";
import { Animated, Easing } from "react-native";
import { router } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';

export type PostType = {
  _id: string;
  title: string;
  content: string;
  image: string;
  imageUrl?: string;
  likes: string[];
  likesCount: number;
  commentsCount?: number;
  isLiked?: boolean;
  createdAt: string;
  user?: {
    _id: string;
    id?: string;
    name: string;
    avatarUrl?: string;
    role?: string;
  };
  company?: {
    _id: string;
    name: string;
    owner?: {
      _id: string;
      name: string;
      avatarUrl?: string;
      role?: string;
    };
  };
};

type PostProps = {
  post: PostType;
  onPostUpdate?: (id: string, updates: Partial<PostType>) => void;
  onPostDelete?: (id: string) => void;
};

export default function Post({ post, onPostUpdate, onPostDelete }: PostProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const { token, user } = useAuthStore();
  const [isLiked, setIsLiked] = useState(false);
  const [currentLikes, setCurrentLikes] = useState(0);
  const [loadingLike, setLoadingLike] = useState(true);
  const [showComments, setShowComments] = useState(false);

  const imageUri = post.imageUrl || `${BASE_URL}${post.image}`;

  // تحديد ما إذا كان المنشور تابع لشركة
  const isCompanyPost = !!post.company;

  // تحديد بيانات المالك
  const ownerData = isCompanyPost && post.company?.owner
    ? post.company.owner
    : post.user;

  // تحديد اسم العرض
  const displayName = isCompanyPost
    ? post.company?.name || "Company"
    : ownerData?.name || "User";

  // تحديد رابط الصورة الشخصية
  const avatarUrl = ownerData?.avatarUrl ||
    (post.user?.avatarUrl || "https://via.placeholder.com/40");

  // مفتاح لحفظ حالة الإعجاب في AsyncStorage
  const LIKE_KEY = `post_${post._id}_liked_by_${user?.id || 'guest'}`;

  // دالة للتحقق من حالة الإعجاب عند تحميل المنشور
  const checkInitialLikeStatus = async () => {
    if (!token || !user) {
      setIsLiked(false);
      setCurrentLikes(post.likesCount ?? post.likes.length);
      setLoadingLike(false);
      return;
    }

    try {
      const serverRes = await fetch(`${BASE_URL}/api/likes/${post._id}/check`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (serverRes.ok) {
        const serverData = await serverRes.json();
        setIsLiked(serverData.hasLiked);
        setCurrentLikes(serverData.totalLikes);
        await AsyncStorage.setItem(LIKE_KEY, JSON.stringify(serverData.hasLiked));
      } else {
        throw new Error("Server request failed");
      }
    } catch (serverError) {
      console.log("Server check failed, trying local storage:", serverError);

      try {
        const localLike = await AsyncStorage.getItem(LIKE_KEY);
        if (localLike !== null) {
          setIsLiked(JSON.parse(localLike));
        } else {
          setIsLiked(post.isLiked ?? false);
        }
      } catch (localError) {
        console.log("Local storage error:", localError);
        setIsLiked(post.isLiked ?? false);
      }

      setCurrentLikes(post.likesCount ?? post.likes.length);
    } finally {
      setLoadingLike(false);
    }
  };

  useEffect(() => {
    checkInitialLikeStatus();
  }, [post._id, token, user]);

  const animateLike = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.3,
        duration: 120,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleLike = async () => {
    if (!token || !user) {
      Alert.alert("Authentication required", "Please log in to like posts.");
      return;
    }

    const prevLiked = isLiked;
    const prevLikes = currentLikes;

    const newLikedState = !prevLiked;
    setIsLiked(newLikedState);
    setCurrentLikes(newLikedState ? prevLikes + 1 : prevLikes - 1);

    await AsyncStorage.setItem(LIKE_KEY, JSON.stringify(newLikedState));

    if (!prevLiked) animateLike();

    try {
      const res = await fetch(`${BASE_URL}/api/likes/${post._id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }

      const data = await res.json();

      setIsLiked(data.liked);
      setCurrentLikes(data.likesCount);
      await AsyncStorage.setItem(LIKE_KEY, JSON.stringify(data.liked));

      onPostUpdate?.(post._id, {
        isLiked: data.liked,
        likesCount: data.likesCount,
      });

    } catch (error: any) {
      setIsLiked(prevLiked);
      setCurrentLikes(prevLikes);
      await AsyncStorage.setItem(LIKE_KEY, JSON.stringify(prevLiked));
      Alert.alert("Error", error.message || "Failed to like post");
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Post",
      "Are you sure you want to delete this post?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            if (!token) return;

            try {
              const res = await fetch(`${BASE_URL}/api/posts/userpost/${post._id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
              });

              if (res.ok) {
                onPostDelete?.(post._id);
              } else {
                const errorData = await res.json();
                Alert.alert("Error", errorData.message || "Failed to delete post");
              }
            } catch (error) {
              console.error("Delete error:", error);
              Alert.alert("Error", "Unable to delete post. Please try again.");
            }
          },
        },
      ]
    );
  };

  // دالة للانتقال إلى الملف الشخصي المناسب
  const navigateToProfile = () => {
    if (isCompanyPost && post.company?.owner) {
      router.push(`/user/${post.company.owner._id}`);
    } else if (post.user?._id === user?.id) {
      router.push('/(tabs)/profile');
    } else if (post.user?._id) {
      router.push(`/user/${post.user._id}`);
    }
  };

  // تحديد المستخدم الذي لديه صلاحية التعديل/الحذف
  const canEditDelete = isCompanyPost
    ? post.company?.owner?._id === user?.id
    : post.user?._id === user?.id;

  return (
    <View style={styles.post}>
      <View style={styles.postHeader}>
        <TouchableOpacity
          style={styles.postHeaderLeft}
          onPress={navigateToProfile}
        >
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: avatarUrl }}
              style={styles.postAvatar}
            />
            {isCompanyPost && (
              <View style={styles.companyBadge}>
                <Ionicons name="business" size={12} color={COLORS.background} />
              </View>
            )}
          </View>

          <View style={styles.nameContainer}>
            <View style={styles.nameRow}>
              <Text style={styles.postUsername}>{displayName}</Text>
              {isCompanyPost && (
                <Ionicons
                  name="business"
                  size={16}
                  color={COLORS.primary}
                  style={styles.companyIcon}
                />
              )}
            </View>

            {isCompanyPost && post.company?.owner && (
              <Text style={styles.ownerName}>
                {post.company.owner.name}
              </Text>
            )}
          </View>
        </TouchableOpacity>

        {canEditDelete && (
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              onPress={handleDelete}
              style={styles.actionButton}
            >
              <Ionicons
                name="trash-outline"
                size={20}
                color={COLORS.error}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: '/edit-post/[id]',
                  params: { id: post._id },
                });
              }}
              style={styles.actionButton}
            >
              <Ionicons
                name="create-outline"
                size={20}
                color={COLORS.grey}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Image
        source={{ uri: imageUri }}
        style={styles.postImage}
        contentFit="cover"
        transition={200}
      />

      <View style={styles.postActions}>
        <TouchableOpacity onPress={handleLike} disabled={loadingLike}>
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={24}
              color={isLiked ? COLORS.primary : COLORS.white}
            />
          </Animated.View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowComments(true)}>
          <Ionicons name="chatbubble-outline" size={22} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.postInfo}>
        {loadingLike ? (
          <Text style={styles.likesText}>Loading likes...</Text>
        ) : (
          <Text style={styles.likesText}>
            {currentLikes > 0 ? `${currentLikes} likes` : "Be the first to like"}
          </Text>
        )}
        <Text style={styles.captionText}>{post.content || "not content"}</Text>
        <Text style={styles.timeAgo}>
          {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
        </Text>
      </View>

      <CommentsModal
        postId={post._id}
        visible={showComments}
        onClose={() => setShowComments(false)}
      />
    </View>
  );
}