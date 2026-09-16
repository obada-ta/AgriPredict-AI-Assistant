

// import Post from "@/components/Post";
// import { usePostStore } from "@/stores/postStore";
// import { COLORS } from "@/constants/theme";
// import { Ionicons } from "@expo/vector-icons";
// import { useEffect, useState } from "react";
// import { FlatList, Image, RefreshControl, Text, TouchableOpacity, View } from "react-native";
// import { styles } from "@/styles/feed.styles";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useRouter } from "expo-router";
// import FontAwesome from "@expo/vector-icons/FontAwesome";
// import { BASE_URL } from "@/constants/Api";

// export default function Index() {
//   const [refreshing, setRefreshing] = useState(false);
//   const { posts, setPosts, updatePost, listenToPostUpdates, deletePost } = usePostStore();

//   const router = useRouter();

//   useEffect(() => {
//     const fetchPosts = async () => {
//       const res = await fetch(`${BASE_URL}/api/posts`);
//       const data = await res.json();
//       setPosts(data);
//     };
//     fetchPosts();
//     listenToPostUpdates();
//   }, []);

//   const onRefresh = async () => {
//     setRefreshing(true);
//     const res = await fetch(`${BASE_URL}/api/posts`);
//     const data = await res.json();
//     setPosts(data);
//     setRefreshing(false);
//   };

//   if (posts.length === 0) return <NoPostsFound />;

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <Image source={require("@/assets/images/AGRIPREDICT.png")} style={{ width: 140, height: 60 }} resizeMode="contain" />
//         <View style={{ flexDirection: "row", gap: 10 }}>
//           <TouchableOpacity onPress={() => router.push("/User")} style={{ backgroundColor: COLORS.primary, borderRadius: 100, padding: 10 }}>
//             <Ionicons name="search-outline" size={24} color="white" />
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => router.push("/chat/Chat")}>
//             <FontAwesome name="send-o" size={24} color="white" style={{ backgroundColor: COLORS.primary, borderRadius: 100, padding: 10 }} />
//           </TouchableOpacity>
//         </View>
//       </View>

//       <FlatList
//         data={posts}
//         keyExtractor={(item) => item._id}
//         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
//         renderItem={({ item }) => (
//           <Post
//             post={{
//               ...item,
//               likesCount: item.likesCount ?? item.likes?.length ?? 0,
//               commentsCount: item.commentsCount ?? 0,
//             }}
//             onPostUpdate={updatePost}

//             onPostDelete={deletePost}

//           />

//         )}
//         showsVerticalScrollIndicator={false}
//       />
//     </SafeAreaView>
//   );
// }

// const NoPostsFound = () => (
//   <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//     <Text style={{ fontSize: 20, color: COLORS.primary }}>No posts yet</Text>
//   </View>
// );

import Post from "@/components/Post";
import { usePostStore } from "@/stores/postStore";
import { COLORS } from "@/constants/theme";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { FlatList, Image, RefreshControl, Text, TouchableOpacity, View } from "react-native";
import { styles } from "@/styles/feed.styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { BASE_URL } from "@/constants/Api";
import DraggableChatbotIcon from "@/components/DraggableChatbotIcon";

export default function Index() {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { posts, setPosts, updatePost, listenToPostUpdates, deletePost } = usePostStore();
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/api/posts`);
        if (!res.ok) throw new Error('Failed to fetch posts');
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
    listenToPostUpdates();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await fetch(`${BASE_URL}/api/posts`);
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error('Error refreshing posts:', error);
    }
    setRefreshing(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Image
            source={require("@/assets/images/AGRIPREDICT.png")}
            style={{ width: 140, height: 60 }}
            resizeMode="contain"
          />
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: COLORS.primary, fontSize: 16 }}>Loading posts...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (posts.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Image
            source={require("@/assets/images/AGRIPREDICT.png")}
            style={{ width: 140, height: 60 }}
            resizeMode="contain"
          />
          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity
              onPress={() => router.push("/User")}
              style={{ backgroundColor: COLORS.primary, borderRadius: 100, padding: 10 }}
            >
              <Ionicons name="search-outline" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/chat/Chat")}>
              <FontAwesome
                name="send-o"
                size={24}
                color="white"
                style={{ backgroundColor: COLORS.primary, borderRadius: 100, padding: 10 }}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Ionicons name="newspaper-outline" size={80} color={COLORS.grey} />
          <Text style={{ fontSize: 18, color: COLORS.primary, marginTop: 16, fontFamily: 'JetBrainsMono-Medium' }}>
            No posts yet
          </Text>
          <Text style={{ fontSize: 14, color: COLORS.textLight, marginTop: 8, textAlign: 'center' }}>
            Be the first to share something amazing!
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("@/assets/images/AGRIPREDICT.png")}
          style={{ width: 140, height: 60 }}
          resizeMode="contain"
        />
        <View style={{ flexDirection: "row", gap: 10 }}>
          <TouchableOpacity
            onPress={() => router.push("/User")}
            style={{ backgroundColor: COLORS.primary, borderRadius: 100, padding: 10 }}
          >
            <Ionicons name="search-outline" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/chat/Chat")}>
            <FontAwesome
              name="send-o"
              size={24}
              color="white"
              style={{ backgroundColor: COLORS.primary, borderRadius: 100, padding: 10 }}
            />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
        renderItem={({ item }) => (
          <Post
            post={{
              ...item,
              likesCount: item.likesCount ?? item.likes?.length ?? 0,
              commentsCount: item.commentsCount ?? 0,
            }}
            onPostUpdate={updatePost}
            onPostDelete={deletePost}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 8 }}
        ListFooterComponent={<View style={{ margin: 20 }}></View>}
      />
      <DraggableChatbotIcon />
    </SafeAreaView>
  );
}