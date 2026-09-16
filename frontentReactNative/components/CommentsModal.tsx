
// import { getPostComments, MOCK_USER } from "@/constants/mock-data";
// import { COLORS } from "@/constants/theme";
// import { styles } from "@/styles/feed.styles";
// import { Ionicons } from "@expo/vector-icons";
// import { useEffect, useState } from "react";
// import {
//   FlatList,
//   KeyboardAvoidingView,
//   Modal,
//   Platform,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import Comment from "./Comment";
// import { Loader } from "./Loader";

// type CommentsModal = {
//   postId: string;
//   visible: boolean;
//   onClose: () => void;
// };

// // محاكاة إضافة تعليق جديد
// const addMockComment = async (postId: string, content: string) => {
//   // في التطبيق الحقيقي، هذا سيكون API call
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve({
//         _id: `comment_${Date.now()}`,
//         content,
//         _creationTime: Date.now(),
//         user: MOCK_USER,
//       });
//     }, 500);
//   });
// };

// export default function CommentsModal({ onClose, postId, visible }: CommentsModal) {
//   const [newComment, setNewComment] = useState("");
//   const [comments, setComments] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [posting, setPosting] = useState(false);

//   useEffect(() => {
//     if (visible && postId) {
//       loadComments();
//     }
//   }, [visible, postId]);

//   const loadComments = () => {
//     setLoading(true);
//     // محاكاة جلب التعليقات من الخادم
//     setTimeout(() => {
//       const postComments = getPostComments(postId);
//       setComments(postComments);
//       setLoading(false);
//     }, 1000);
//   };

//   const handleAddComment = async () => {
//     if (!newComment.trim()) return;

//     try {
//       setPosting(true);

//       // محاكاة إضافة تعليق جديد
//       const newCommentData: any = await addMockComment(postId, newComment);

//       // إضافة التعليق الجديد إلى القائمة
//       setComments(prev => [newCommentData, ...prev]);
//       setNewComment("");
//     } catch (error) {
//       console.log("Error adding comment:", error);
//     } finally {
//       setPosting(false);
//     }
//   };

//   return (
//     <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         style={styles.modalContainer}
//       >
//         <View style={styles.modalHeader}>
//           <TouchableOpacity onPress={onClose}>
//             <Ionicons name="close" size={24} color={COLORS.white} />
//           </TouchableOpacity>
//           <Text style={styles.modalTitle}>Comments</Text>
//           <View style={{ width: 24 }} />
//         </View>

//         {loading ? (
//           <Loader />
//         ) : (
//           <FlatList
//             data={comments}
//             keyExtractor={(item) => item._id}
//             renderItem={({ item }) => <Comment comment={item} />}
//             contentContainerStyle={styles.commentsList}
//             ListEmptyComponent={
//               <View style={styles.noCommentsContainer}>
//                 <Ionicons name="chatbubble-outline" size={48} color={COLORS.grey} />
//                 <Text style={styles.noCommentsText}>No comments yet</Text>
//                 <Text style={styles.noCommentsSubtext}>Be the first to comment</Text>
//               </View>
//             }
//           />
//         )}

//         <View style={styles.commentInput}>
//           <TextInput
//             style={styles.input}
//             placeholder="Add a comment..."
//             placeholderTextColor={COLORS.grey}
//             value={newComment}
//             onChangeText={setNewComment}
//             multiline
//             editable={!posting}
//           />

//           <TouchableOpacity 
//             onPress={handleAddComment} 
//             disabled={!newComment.trim() || posting}
//           >
//             {posting ? (
//               <Loader  />
//             ) : (
//               <Text style={[styles.postButton, !newComment.trim() && styles.postButtonDisabled]}>
//                 Post
//               </Text>
//             )}
//           </TouchableOpacity>
//         </View>
//       </KeyboardAvoidingView>
//     </Modal>
//   );
// }
import { View, Text, Modal, FlatList, TouchableOpacity, TextInput, Image } from "react-native";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { formatDistanceToNow } from "date-fns";

import { styles } from "@/styles/feed.styles";
import { COLORS } from "@/constants/theme";
import { useCommentStore } from "@/stores/commentStore";
import { useAuthStore } from "@/stores/authstore";
import { router } from "expo-router";

type Props = { postId: string; visible: boolean; onClose: () => void };

export default function CommentsModal({ postId, visible, onClose }: Props) {
  const { comments, fetchComments, addComment, deleteComment, listenToComments } = useCommentStore();
  const { user } = useAuthStore();
  const [text, setText] = useState("");

  useEffect(() => {
    if (visible) {
      fetchComments(postId);
      listenToComments(postId);
    }
  }, [visible]);

  const handleAddComment = async () => {
    if (!text.trim()) return;
    await addComment(postId, text);
    setText("");
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose}><Ionicons name="close" size={24} color={COLORS.white} /></TouchableOpacity>
          <Text style={styles.modalTitle}>Comments</Text>
          <View style={{ width: 24 }} />
        </View>

        {comments.length === 0 ? (
          <View style={styles.noCommentsContainer}>
            <Ionicons name="chatbubble-outline" size={48} color={COLORS.grey} />
            <Text style={styles.noCommentsText}>No comments yet</Text>
            <Text style={styles.noCommentsSubtext}>Be the first to comment</Text>
          </View>
        ) : (
          <FlatList
            style={styles.commentsList}
            data={comments.filter(c => c && c.user)}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => {
              if (!item || !item.user) return null;
              return (
                <View style={styles.commentContainer}>
                  <TouchableOpacity onPress={() => router.push(
                    item.user._id === user?.id ?
                      '/(tabs)/profile' :
                      `/user/${item.user._id}`

                  )}>
                    <Image source={{ uri: item.user.avatarUrl || "https://via.placeholder.com/40" }} style={styles.commentAvatar} />
                  </TouchableOpacity>
                  <View style={styles.commentContent}>
                    <Text style={styles.commentUsername}>{item.user.name}</Text>
                    <Text style={styles.commentText}>{item.content}</Text>
                    <Text style={styles.commentTime}>{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}</Text>
                  </View>

                  {item.user.id === user?.id && (
                    <TouchableOpacity onPress={() => deleteComment(item._id)}>
                      <Ionicons name="trash-outline" size={18} color={COLORS.primary} />
                    </TouchableOpacity>
                  )}
                </View>
              );
            }}
          />
        )}

        <View style={styles.commentInput}>
          <TextInput placeholder="Add a comment..." placeholderTextColor={COLORS.grey} value={text} onChangeText={setText} style={styles.input} />
          <TouchableOpacity onPress={handleAddComment} disabled={!text.trim()}>
            <Text style={[styles.postButton, !text.trim() && styles.postButtonDisabled]}>Post</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
