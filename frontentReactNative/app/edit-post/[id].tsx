// app/edit-post/[id].tsx

import { useState, useEffect } from 'react';
import {
    View,
    TextInput,
    Alert,
    StyleSheet,
    Image as RNImage,
    TouchableOpacity,
    Text,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BASE_URL } from '@/constants/Api';
import { useAuthStore } from '@/stores/authstore';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/theme';

export default function EditPostScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { token } = useAuthStore();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
    const [newImage, setNewImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
    const [imageRemoved, setImageRemoved] = useState(false); // ← جديد: تتبع حذف الصورة
    const [loading, setLoading] = useState(false);
    const [loadingPost, setLoadingPost] = useState(true);
    const [post, setPost] = useState<any>(null);

    // جلب بيانات المنشور الحالي
    useEffect(() => {
        if (!token || !id) {
            Alert.alert("خطأ", "معلومات المصادقة غير مكتملة");
            router.back();
            return;
        }

        const fetchPost = async () => {
            setLoadingPost(true);
            try {
                const res = await fetch(`${BASE_URL}/api/posts/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) {
                    const error = await res.json().catch(() => ({}));
                    throw new Error(error.message || 'فشل في تحميل المنشور');
                }

                const postData = await res.json();
                setPost(postData);
                setTitle(postData.title || '');
                setContent(postData.content || '');
                setCurrentImageUrl(postData.imageUrl || null);
            } catch (err: any) {
                console.error("Fetch post error:", err);
                Alert.alert("خطأ", err.message || "تعذر تحميل بيانات المنشور");
                router.back();
            } finally {
                setLoadingPost(false);
            }
        };
        console.log(post);


        fetchPost();
    }, [id, token]);

    // طلب إذن الوصول إلى المعرض
    const requestPermission = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('رفض الإذن', 'نحتاج إذن الوصول إلى المعرض لإتمام العملية');
            return false;
        }
        return true;
    };

    // اختيار صورة من المعرض
    const pickImage = async () => {
        const hasPermission = await requestPermission();
        if (!hasPermission) return;

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [10, 10],
            quality: 0.8,
        });

        if (!result.canceled) {
            setNewImage(result.assets[0]);
            setImageRemoved(false); // إذا اختار صورة جديدة، ألغي حالة الحذف
        }
    };

    // إزالة الصورة الحالية
    const removeImage = () => {
        setNewImage(null);
        setCurrentImageUrl(null);
        setImageRemoved(true);
    };

    // إرسال التعديلات إلى السيرفر
    const handleUpdate = async () => {
        if (!title.trim()) {
            Alert.alert("تحقق", "العنوان مطلوب");
            return;
        }

        if (!token || !id) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);

        // إذا طلب المستخدم حذف الصورة
        if (imageRemoved) {
            formData.append('removeImage', 'true');
        }
        // إذا اختار صورة جديدة
        else if (newImage) {
            const filename = newImage.uri.split('/').pop() || `post-${id}.jpg`;
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : 'image/jpeg';

            formData.append('image', {
                uri: newImage.uri,
                type,
                name: filename,
            } as any);
        }

        try {
            const res = await fetch(`${BASE_URL}/api/posts/${id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    // ⚠️ لا تضبط Content-Type — سيُضبط تلقائيًا مع FormData
                },
                body: formData,
            });

            const data = await res.json();
            if (res.ok) {
                Alert.alert("نجاح", data.message || "تم تحديث المنشور بنجاح");
                setImageRemoved(false); // إعادة التعيين بعد النجاح
                router.back();
            } else {
                Alert.alert("خطأ", data.message || "فشل في تحديث المنشور");
            }
        } catch (err: any) {
            console.error("Update error:", err);
            Alert.alert("خطأ في الشبكة", "يرجى التحقق من اتصالك بالإنترنت");
        } finally {
            setLoading(false);
        }
    };

    const displayImage = newImage?.uri || currentImageUrl;

    if (loadingPost) {
        return (
            <SafeAreaView style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>جاري تحميل المنشور...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={24} color={COLORS.white} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>تعديل المنشور</Text>
                </View>

                <View style={styles.formContainer}>
                    <Text style={styles.label}>العنوان</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="أدخل عنوان المنشور"
                        placeholderTextColor={COLORS.textLight}
                        value={title}
                        onChangeText={setTitle}
                    />

                    <Text style={styles.label}>المحتوى</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="اكتب محتوى المنشور هنا"
                        placeholderTextColor={COLORS.textLight}
                        value={content}
                        onChangeText={setContent}
                        multiline
                        numberOfLines={6}
                    />

                    <Text style={styles.label}>الصورة</Text>
                    {displayImage ? (
                        <View style={styles.imageContainer}>
                            <RNImage source={{ uri: displayImage }} style={styles.imagePreview} />
                            <TouchableOpacity
                                style={styles.removeImageButton}
                                onPress={removeImage}
                            >
                                <Ionicons name="trash-outline" size={20} color="#fff" />
                            </TouchableOpacity>
                            <Text style={styles.imageInfo}>
                                {newImage ? 'صورة جديدة' : 'الصورة الحالية'}
                            </Text>
                        </View>
                    ) : (
                        <View style={styles.noImageContainer}>
                            <Ionicons name="image-outline" size={50} color={COLORS.border} />
                            <Text style={styles.noImageText}>لا توجد صورة للمنشور</Text>
                        </View>
                    )}

                    <TouchableOpacity
                        onPress={pickImage}
                        style={styles.imageButton}
                    >
                        <Ionicons name="images-outline" size={20} color={COLORS.white} />
                        <Text style={styles.imageButtonText}>
                            {displayImage ? 'تغيير الصورة' : 'اختر صورة'}
                        </Text>
                    </TouchableOpacity>

                    {/* معلومات المنشور الأصلية */}
                    <View style={styles.postInfo}>
                        <Text style={styles.infoTitle}>معلومات المنشور</Text>
                        <View style={styles.infoRow}>
                            <Ionicons name="calendar-outline" size={16} color={COLORS.textLight} />
                            <Text style={styles.infoText}>
                                {post?.createdAt
                                    ? new Date(post.createdAt).toLocaleDateString('ar-SA')
                                    : 'غير محدد'}
                            </Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Ionicons name="heart-outline" size={16} color={COLORS.textLight} />
                            <Text style={styles.infoText}>
                                {post?.likes?.length || 0} إعجاب
                            </Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Ionicons name="chatbubble-outline" size={16} color={COLORS.textLight} />
                            <Text style={styles.infoText}>
                                {post?.commentsCount || 0} تعليق
                            </Text>
                        </View>
                    </View>

                    {/* أزرار التعديل */}
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={() => router.back()}
                            disabled={loading}
                        >
                            <Text style={styles.cancelButtonText}>إلغاء</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, styles.updateButton, loading && styles.disabledButton]}
                            onPress={handleUpdate}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color={COLORS.white} />
                            ) : (
                                <>
                                    <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.white} />
                                    <Text style={styles.updateButtonText}>تحديث</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: COLORS.textLight,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: COLORS.primary,
    },
    backButton: {
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    formContainer: {
        padding: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 8,
        marginTop: 16,
    },
    input: {
        backgroundColor: COLORS.surface,
        padding: 12,
        borderRadius: 12,
        fontSize: 16,
        color: COLORS.text,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    textArea: {
        height: 120,
        textAlignVertical: 'top',
    },
    imageContainer: {
        position: 'relative',
        marginBottom: 12,
        alignItems: 'center',
    },
    imagePreview: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        backgroundColor: COLORS.surface,
    },
    removeImageButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageInfo: {
        marginTop: 8,
        fontSize: 14,
        color: COLORS.textLight,
        textAlign: 'center',
    },
    noImageContainer: {
        height: 200,
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderStyle: 'dashed',
        marginBottom: 12,
    },
    noImageText: {
        marginTop: 12,
        fontSize: 14,
        color: COLORS.textLight,
    },
    imageButton: {
        backgroundColor: COLORS.primary,
        padding: 14,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    imageButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    postInfo: {
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: COLORS.borderLight,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 12,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    infoText: {
        fontSize: 14,
        color: COLORS.textLight,
        marginLeft: 8,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    button: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginRight: 8,
    },
    cancelButtonText: {
        color: COLORS.text,
        fontSize: 16,
        fontWeight: '600',
    },
    updateButton: {
        backgroundColor: COLORS.primary,
        marginLeft: 8,
    },
    disabledButton: {
        opacity: 0.7,
    },
    updateButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
});