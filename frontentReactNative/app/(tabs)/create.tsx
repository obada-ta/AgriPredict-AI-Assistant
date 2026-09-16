// import { MOCK_USER } from "@/constants/mock-data";
// import { COLORS } from "@/constants/theme";
// import { styles } from "@/styles/create.styles";
// import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import { useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";

// import { Image } from "expo-image";

// import * as ImagePicker from "expo-image-picker";
// import { SafeAreaView } from "react-native-safe-area-context";

// // محاكاة إنشاء منشور جديد
// const createMockPost = async (imageUri: string, caption: string) => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve({
//         _id: `post_${Date.now()}`,
//         imageUrl: imageUri,
//         caption,
//         likes: 0,
//         comments: 0,
//         _creationTime: Date.now(),
//         isLiked: false,
//         isBookmarked: false,
//         author: MOCK_USER,
//       });
//     }, 2000);
//   });
// };

// export default function CreateScreen() {
//   const router = useRouter();

//   const [caption, setCaption] = useState("");
//   const [selectedImage, setSelectedImage] = useState<string | null>(null);
//   const [isSharing, setIsSharing] = useState(false);

//   const pickImage = async () => {
//     try {
//       // طلب الإذن للوصول إلى المعرض
//       const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

//       if (status !== 'granted') {
//         Alert.alert('Permission required', 'Sorry, we need camera roll permissions to make this work!');
//         return;
//       }

//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: "images",
//         allowsEditing: true,
//         aspect: [1, 1],
//         quality: 0.8,
//       });

//       if (!result.canceled) {
//         setSelectedImage(result.assets[0].uri);
//       }
//     } catch (error) {
//       console.log("Error picking image:", error);
//       Alert.alert('Error', 'Failed to pick image');
//     }
//   };

//   const handleShare = async () => {
//     if (!selectedImage) return;

//     try {
//       setIsSharing(true);

//       // محاكاة إنشاء المنشور
//       await createMockPost(selectedImage, caption);

//       // إظهار رسالة نجاح
//       Alert.alert('Success', 'Your post has been shared!', [
//         {
//           text: 'OK',
//           onPress: () => {
//             setSelectedImage(null);
//             setCaption("");
//             router.push("/(tabs)");
//           }
//         }
//       ]);

//     } catch (error) {
//       console.log("Error sharing post:", error);
//       Alert.alert('Error', 'Failed to share post. Please try again.');
//     } finally {
//       setIsSharing(false);
//     }
//   };

//   const handleClose = () => {
//     if (caption || selectedImage) {
//       Alert.alert(
//         'Discard Post?',
//         'Are you sure you want to discard this post?',
//         [
//           {
//             text: 'Cancel',
//             style: 'cancel'
//           },
//           {
//             text: 'Discard',
//             style: 'destructive',
//             onPress: () => {
//               setSelectedImage(null);
//               setCaption("");
//               router.back();
//             }
//           }
//         ]
//       );
//     } else {
//       setSelectedImage(null);
//       setCaption("");
//       router.back();
//     }
//   };

//   if (!selectedImage) {
//     return (
//       <View style={styles.container}>
//         <View style={styles.header}>
//           <TouchableOpacity onPress={handleClose}>
//             <Ionicons name="arrow-back" size={28} color={COLORS.primary} />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>New Post</Text>
//           <View style={{ width: 28 }} />
//         </View>

//         <TouchableOpacity
//           style={styles.emptyImageContainer}
//           onPress={pickImage}
//           activeOpacity={0.7}
//         >
//           <Ionicons name="image-outline" size={48} color={COLORS.grey} />
//           <Text style={styles.emptyImageText}>Tap to select an image</Text>
//           <Text style={[styles.emptyImageText, { fontSize: 14, marginTop: 8 }]}>
//             Choose a square image for best results
//           </Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={{ marginTop: 40}}>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         style={styles.container}
//         keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
//       >
//         <View style={styles.contentContainer}>
//           {/* HEADER */}
//           <View style={styles.header}>
//             <TouchableOpacity
//               onPress={handleClose}
//               disabled={isSharing}
//             >
//               <Ionicons
//                 name="close-outline"
//                 size={28}
//                 color={isSharing ? COLORS.grey : 'black'}
//               />
//             </TouchableOpacity>
//             <Text style={styles.headerTitle}>New Post</Text>
//             <TouchableOpacity
//               style={[styles.shareButton, isSharing && styles.shareButtonDisabled]}
//               disabled={isSharing || !selectedImage}
//               onPress={handleShare}
//             >
//               {isSharing ? (
//                 <ActivityIndicator size="small" color={COLORS.primary} />
//               ) : (
//                 <Text style={styles.shareText}>Share</Text>
//               )}
//             </TouchableOpacity>
//           </View>

//           <ScrollView
//             contentContainerStyle={styles.scrollContent}
//             bounces={false}
//             keyboardShouldPersistTaps="handled"
//           >
//             <View style={[styles.content, isSharing && styles.contentDisabled]}>
//               {/* IMAGE SECTION */}
//               <View style={styles.imageSection}>
//                 <Image
//                   source={selectedImage}
//                   style={styles.previewImage}
//                   contentFit="cover"
//                   transition={200}
//                 />
//                 <TouchableOpacity
//                   style={styles.changeImageButton}
//                   onPress={pickImage}
//                   disabled={isSharing}
//                 >
//                   <Ionicons name="image-outline" size={20} color={'black'} />
//                   <Text style={styles.changeImageText}>Change</Text>
//                 </TouchableOpacity>
//               </View>

//               {/* INPUT SECTION */}
//               <View style={styles.inputSection}>
//                 <View style={styles.captionContainer}>
//                   <Image
//                     source={MOCK_USER.image}
//                     style={styles.userAvatar}
//                     contentFit="cover"
//                     transition={200}
//                   />
//                   <TextInput
//                     style={styles.captionInput}
//                     placeholder="Write a caption..."
//                     placeholderTextColor={COLORS.grey}
//                     multiline
//                     value={caption}
//                     onChangeText={setCaption}
//                     editable={!isSharing}
//                     maxLength={2200}
//                   />
//                 </View>
//                 <Text style={styles.charCount}>
//                   {caption.length}/2200
//                 </Text>
//               </View>
//             </View>
//           </ScrollView>
//         </View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }
// import { MOCK_USER } from "@/constants/mock-data";
// import { COLORS } from "@/constants/theme";
// import { styles } from "@/styles/create.styles";
// import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import { useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { Image } from "expo-image";
// import * as ImagePicker from "expo-image-picker";
// import { SafeAreaView } from "react-native-safe-area-context";

// // محاكاة إنشاء منشور جديد
// const createMockPost = async (imageUri: string, caption: string) => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve({
//         _id: `post_${Date.now()}`,
//         imageUrl: imageUri,
//         caption,
//         likes: 0,
//         comments: 0,
//         _creationTime: Date.now(),
//         isLiked: false,
//         isBookmarked: false,
//         author: MOCK_USER,
//       });
//     }, 1500);
//   });
// };

// export default function CreateScreen() {
//   const router = useRouter();
//   const [caption, setCaption] = useState("");
//   const [selectedImage, setSelectedImage] = useState<string | null>(null);
//   const [isSharing, setIsSharing] = useState(false);

//   const pickImage = async () => {
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== "granted") {
//       Alert.alert("Permission required", "We need access to your photos to upload a post.");
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [1, 1],
//       quality: 0.8,
//     });

//     if (!result.canceled && result.assets[0]) {
//       setSelectedImage(result.assets[0].uri);
//     }
//   };

//   const handleShare = async () => {
//     if (!selectedImage) return;

//     try {
//       setIsSharing(true);
//       await createMockPost(selectedImage, caption);

//       Alert.alert("Success", "Your post has been shared!", [
//         {
//           text: "OK",
//           onPress: () => {
//             setCaption("");
//             setSelectedImage(null);
//             router.replace("/(tabs)/profile"); // أو أي شاشة رئيسية
//           },
//         },
//       ]);
//     } catch (error) {
//       console.error("Share error:", error);
//       Alert.alert("Error", "Failed to share your post. Please try again.");
//     } finally {
//       setIsSharing(false);
//     }
//   };

//   const handleClose = () => {
//     if (caption.trim() || selectedImage) {
//       Alert.alert(
//         "Discard Post?",
//         "Are you sure you want to discard this post?",
//         [
//           { text: "Cancel", style: "cancel" },
//           {
//             text: "Discard",
//             style: "destructive",
//             onPress: () => router.back(),
//           },
//         ]
//       );
//     } else {
//       router.back();
//     }
//   };

//   // شاشة اختيار الصورة الأولية
//   if (!selectedImage) {
//     return (
//       <SafeAreaView style={styles.safeArea}>
//         <View style={styles.header}>
//           <TouchableOpacity onPress={handleClose} hitSlop={20}>
//             <Ionicons name="arrow-back" size={24} color={COLORS.text} />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>New Post</Text>
//           <View style={{ width: 24 }} />
//         </View>

//         <TouchableOpacity
//           style={styles.emptyContainer}
//           onPress={pickImage}
//           activeOpacity={0.8}
//         >
//           <Ionicons name="image-outline" size={56} color={COLORS.grey} />
//           <Text style={styles.emptyText}>Select Image</Text>
//           <Text style={[styles.emptyText, { fontSize: 14, marginTop: 8, opacity: 0.7 }]}>
//             Square images work best
//           </Text>
//         </TouchableOpacity>
//       </SafeAreaView>
//     );
//   }

//   // شاشة تحرير المنشور
//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         style={styles.container}
//         keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
//       >
//         <View style={styles.header}>
//           <TouchableOpacity onPress={handleClose} disabled={isSharing} hitSlop={20}>
//             <Ionicons
//               name="close"
//               size={24}
//               color={isSharing ? COLORS.grey : COLORS.text}
//             />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>New Post</Text>
//           <TouchableOpacity
//             style={[styles.shareButton, isSharing && styles.shareButtonDisabled]}
//             onPress={handleShare}
//             disabled={isSharing}
//           >
//             {isSharing ? (
//               <ActivityIndicator size="small" color="white" />
//             ) : (
//               <Text style={styles.shareButtonText}>Share</Text>
//             )}
//           </TouchableOpacity>
//         </View>

//         <ScrollView
//           contentContainerStyle={styles.scrollContent}
//           keyboardShouldPersistTaps="handled"
//           showsVerticalScrollIndicator={false}
//         >
//           <View style={styles.imageContainer}>
//             <Image
//               source={{ uri: selectedImage }}
//               style={styles.previewImage}
//               contentFit="cover"
//               transition={200}
//             />
//             <TouchableOpacity
//               style={styles.changeButton}
//               onPress={pickImage}
//               disabled={isSharing}
//             >
//               <Ionicons name="image-outline" size={20} color="white" />
//               <Text style={styles.changeButtonText}>Change</Text>
//             </TouchableOpacity>
//           </View>

//           <View style={styles.inputSection}>
//             <View style={styles.captionRow}>
//               <Image
//                 source={{ uri: MOCK_USER.image }}
//                 style={styles.avatar}
//                 contentFit="cover"
//               />
//               <TextInput
//                 style={styles.textInput}
//                 placeholder="Write a caption..."
//                 placeholderTextColor={COLORS.grey}
//                 multiline
//                 numberOfLines={4}
//                 value={caption}
//                 onChangeText={setCaption}
//                 editable={!isSharing}
//                 maxLength={2200}
//               />
//               <TextInput
//                 style={styles.textInput}
//                 placeholder="Write a caption..."
//                 placeholderTextColor={COLORS.grey}
//                 multiline
//                 numberOfLines={4}
//                 value={caption}
//                 onChangeText={setCaption}
//                 editable={!isSharing}
//                 maxLength={2200}
//               />
//             </View>
//             <Text style={styles.charCount}>{caption.length}/200</Text>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/create.styles";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "@/stores/authstore";
import { BASE_URL } from "@/constants/Api";
import * as FileSystem from "expo-file-system";
import axios from "axios";

export default function CreateScreen() {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [caption, setCaption] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "We need access to your photos to upload a post.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images", // ✅ تم التحديث هنا
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleShare = async () => {
    if (!selectedImage || !user || !token) return;

    try {
      setIsSharing(true);

      const formData = new FormData();
      formData.append("title", caption.substring(0, 100) || "No title");
      formData.append("content", caption);
      formData.append("image", {
        uri: selectedImage,
        name: `post_${Date.now()}.jpg`,
        type: "image/jpeg",
      } as any);

      const response = await axios.post(`${BASE_URL}/api/posts`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        timeout: 30000,
      });

      if (response.data.success) {
        Alert.alert("Success", response.data.message || "Your post has been shared!", [
          {
            text: "OK",
            onPress: () => {
              setCaption("");
              setSelectedImage(null);
              router.replace("/(tabs)");
            },
          },
        ]);
      } else {
        throw new Error(response.data.message || "Unknown error");
      }
    } catch (error: any) {
      console.error("Create Post Error:", error.response?.data || error.message);
      Alert.alert("Error", error.response?.data?.message || "Failed to share post. Please try again.");
    } finally {
      setIsSharing(false);
    }
  };

  const handleClose = () => {
    if (caption.trim() || selectedImage) {
      Alert.alert(
        "Discard Post?",
        "Are you sure you want to discard this post?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Discard",
            style: "destructive",
            onPress: () => router.back(),
          },
        ]
      );
    } else {
      router.back();
    }
  };

  // شاشة اختيار الصورة الأولية
  if (!selectedImage) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} hitSlop={20}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Post</Text>
          <View style={{ width: 24 }} />
        </View>

        <TouchableOpacity
          style={styles.emptyContainer}
          onPress={pickImage}
          activeOpacity={0.8}
        >
          <Ionicons name="image-outline" size={56} color={COLORS.grey} />
          <Text style={styles.emptyText}>Select Image</Text>
          <Text style={[styles.emptyText, { fontSize: 14, marginTop: 8, opacity: 0.7 }]}>
            Square images work best
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // شاشة تحرير المنشور
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} disabled={isSharing} hitSlop={20}>
            <Ionicons
              name="close"
              size={24}
              color={isSharing ? COLORS.grey : COLORS.text}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Post</Text>
          <TouchableOpacity
            style={[styles.shareButton, isSharing && styles.shareButtonDisabled]}
            onPress={handleShare}
            disabled={isSharing}
          >
            {isSharing ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.shareButtonText}>Share</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: selectedImage }}
              style={styles.previewImage}
              contentFit="cover"
              transition={200}
            />
            <TouchableOpacity
              style={styles.changeButton}
              onPress={pickImage}
              disabled={isSharing}
            >
              <Ionicons name="image-outline" size={20} color="white" />
              <Text style={styles.changeButtonText}>Change</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputSection}>
            <View style={styles.captionRow}>
              <Image
                source={{ uri: user?.avatarUrl || user?.avatar || "https://via.placeholder.com/40" }}
                style={styles.avatar}
                contentFit="cover"
              />
              {/* ❌ تم إصلاح التكرار: كان هناك <TextInput> مكرر! */}
              <TextInput
                style={styles.textInput}
                placeholder="Write a caption..."
                placeholderTextColor={COLORS.grey}
                multiline
                numberOfLines={4}
                value={caption}
                onChangeText={setCaption}
                editable={!isSharing}
                maxLength={2200}
              />
            </View>
            <Text style={styles.charCount}>{caption.length}/2200</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}