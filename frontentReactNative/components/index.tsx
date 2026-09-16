import {
    StatusBar,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
    ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { COLORS } from "@/constants/theme";
import { BASE_URL } from "@/constants/Api";
import { useAuthStore } from "@/stores/authstore";
import { useSocketStore } from "@/stores/socketStore";

interface UnapprovedPost {
    _id: string;
    title: string;
    content: string;
    imageUrl?: string;
    imagesUrls?: string[];
    user?: {
        _id: string;
        name: string;
        avatarUrl?: string;
    };
    company?: {
        _id: string;
        name: string;
    };
    createdAt: string;
}

const AdminDashboard = () => {
    const { token } = useAuthStore();
    const { socket, onlineUsers } = useSocketStore();

    const [posts, setPosts] = useState<UnapprovedPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [approvingId, setApprovingId] = useState<string | null>(null);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const res = await fetch(
                `${BASE_URL}/api/posts/getAllNotApprovedPosts`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = await res.json();
            setPosts(data);
        } catch (e) {
            Alert.alert("Error", "Failed to load posts");
        } finally {
            setLoading(false);
        }
    };

    const approvePost = async (id: string) => {
        try {
            setApprovingId(id);
            const res = await fetch(
                `${BASE_URL}/api/posts/${id}/approve`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (res.ok) {
                setPosts((prev) => prev.filter((p) => p._id !== id));
                Alert.alert("Success", "Post approved");
            }
        } catch {
            Alert.alert("Error", "Something went wrong");
        } finally {
            setApprovingId(null);
        }
    };

    const rejectPost = (id: string) => {
        Alert.alert("Reject Post", "Are you sure?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Reject",
                style: "destructive",
                onPress: async () => {
                    await fetch(`${BASE_URL}/api/posts/${id}/reject`, {
                        method: "DELETE",
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setPosts((prev) => prev.filter((p) => p._id !== id));
                },
            },
        ]);
    };

    useEffect(() => {
        fetchPosts();

        socket?.on("newPostCreated", fetchPosts);

        return () => {
            socket?.off("newPostCreated");
        };
    }, [socket, onlineUsers]);

    if (loading && posts.length === 0) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Loading posts...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={26} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Admin Dashboard</Text>
                <Ionicons name="notifications-outline" size={24} color="#fff" />
            </View>

            {/* Posts */}
            <ScrollView contentContainerStyle={styles.postsContainer}>
                {posts.map((post) => (
                    <View key={post._id} style={styles.postCard}>
                        {/* Post Image */}
                        <Image
                            source={{
                                uri:
                                    post.imageUrl ||
                                    "https://via.placeholder.com/400x200",
                            }}
                            style={styles.postImage}
                            resizeMode="cover"
                        />

                        <View style={styles.postContent}>
                            <Text style={styles.postTitle}>{post.title}</Text>
                            <Text style={styles.postDescription} numberOfLines={3}>
                                {post.content}
                            </Text>

                            {/* Author */}
                            <View style={styles.authorRow}>
                                <Image
                                    source={{
                                        uri:
                                            post.user?.avatarUrl ||
                                            "https://via.placeholder.com/40",
                                    }}
                                    style={styles.avatar}
                                />
                                <Text style={styles.authorName}>
                                    {post.user?.name || post.company?.name}
                                </Text>
                                <Text style={styles.date}>
                                    {new Date(post.createdAt).toLocaleDateString()}
                                </Text>
                            </View>

                            {/* Actions */}
                            <View style={styles.actions}>
                                <TouchableOpacity
                                    style={[styles.btn, styles.reject]}
                                    onPress={() => rejectPost(post._id)}
                                >
                                    <Text style={styles.btnText}>Reject</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.btn, styles.approve]}
                                    onPress={() => approvePost(post._id)}
                                >
                                    {approvingId === post._id ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <Text style={styles.btnText}>Approve</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

export default AdminDashboard;

/* ================== STYLES ================== */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f6f8",
    },

    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        marginTop: 10,
        color: COLORS.grey,
    },

    header: {
        backgroundColor: COLORS.primary,
        padding: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    headerTitle: {
        color: "#fff",
        fontSize: 10,
        fontWeight: "700",
    },

    postsContainer: {
        padding: 16,
    },

    postCard: {
        backgroundColor: "#fff",
        borderRadius: 18,
        marginBottom: 20,
        overflow: "hidden",
        elevation: 5,
    },

    postImage: {
        width: "100%",
        height: 200,
    },

    postContent: {
        padding: 14,
    },

    postTitle: {
        fontSize: 17,
        fontWeight: "700",
        marginBottom: 6,
    },

    postDescription: {
        fontSize: 13,
        color: COLORS.grey,
    },

    authorRow: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 12,
    },

    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 10,
    },

    authorName: {
        flex: 1,
        fontWeight: "600",
    },

    date: {
        fontSize: 11,
        color: COLORS.grey,
    },

    actions: {
        flexDirection: "row",
        gap: 12,
    },

    btn: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: "center",
    },

    approve: {
        backgroundColor: "#2ecc71",
    },

    reject: {
        backgroundColor: "#e74c3c",
    },

    btnText: {
        color: "#fff",
        fontWeight: "700",
    },
});
